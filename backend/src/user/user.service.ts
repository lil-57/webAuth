import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common"

import { ErrorMessages } from "../common/errors/messages"

import { InjectRepository } from "@mikro-orm/nestjs"
import  { EntityRepository } from "@mikro-orm/core"
import  { EntityManager } from "@mikro-orm/core"

import { User } from "./user.entity"

import * as argon2 from "argon2"

import  { UserResponseDto } from "./dto/user-response.dto"
import  { UpdateUserDto } from "./dto/update-user.dto"
import  { ChangePasswordDto } from "./dto/change-password.dto"

@Injectable()
export class UserService {
  constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
        private readonly em: EntityManager,
    ) { }


  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll()
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt!,
      hasPassword: !!user.password,
    }))
  }


  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne(id)
    if (!user) {
      throw new NotFoundException(ErrorMessages.user.notFound(id))
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt!,
      hasPassword: !!user.password,
    }
  }


  async findUserById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException("ID de l’utilisateur manquant")
    }
    const user = await this.userRepository.findOne({ id })
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l’ID ${id} introuvable`)
    }
    return user
  }


  async findByEmail(email: string): Promise<User[]> {
    return this.userRepository.find({ email })
  }


  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne(id)
    if (!user) {
      throw new NotFoundException(ErrorMessages.user.notFound(id))
    }

    if (user.role === "admin") {
      throw new ForbiddenException(ErrorMessages.user.cannotDeleteAdmin)
    }

    await this.em.removeAndFlush(user)

    return { message: "User deleted successfully" }
  }


async updateUser(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
  const user = await this.userRepository.findOne(id)
  if (!user) {
    throw new NotFoundException(ErrorMessages.user.notFound(id))
  }

  if (data.email && data.email !== user.email) {
    const existing = await this.userRepository.findOne({ email: data.email })
    if (existing) {
      throw new ConflictException(ErrorMessages.user.emailExists)
    }
  }

  if (data.password) {
    data.password = await argon2.hash(data.password)
  }

  const { captchaToken, ...updateData } = data

  this.userRepository.assign(user, updateData)
  await this.em.persistAndFlush(user)

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt!,
    hasPassword: !!user.password,
  }
}


  
  async changePassword(id: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne(id)
    if (!user) {
      throw new NotFoundException(ErrorMessages.user.notFound(id))
    }

    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException(ErrorMessages.user.samePassword)
    }

    if (!user.password) {
      throw new BadRequestException("Aucun mot de passe enregistré pour cet utilisateur")
    }

    const passwordValid = await argon2.verify(user.password, dto.oldPassword)
    if (!passwordValid) {
      throw new UnauthorizedException(ErrorMessages.auth.invalidOldPassword)
    }

    user.password = await argon2.hash(dto.newPassword)
    await this.em.persistAndFlush(user)

    return { message: "Mot de passe modifié avec succès ✅" }
  }


  async emailExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ email })
    return count > 0
  }
}
