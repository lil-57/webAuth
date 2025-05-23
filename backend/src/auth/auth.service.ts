import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"

import { UserService } from "../user/user.service"

import { JwtService } from "@nestjs/jwt"

import { LoginDto } from "./dto/login.dto"
import { CreateUserDto } from "./dto/create-user.dto"

import { User } from "../user/user.entity"

import { ErrorMessages } from "../common/errors/messages"

import * as argon2 from "argon2"
import { randomUUID } from "crypto"

import { addMinutes } from "date-fns"
import { MagicLinkToken } from "../emails/email.token.entity"
import { MailService } from "../emails/email.service"


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly mailService: MailService,
  ) { }


  async createUser(data: CreateUserDto): Promise<{ access_token: string; refresh_token: string }> {

    const existing = await this.userRepository.findOne({ email: data.email })
    if (existing) {
      throw new ConflictException(ErrorMessages.user.emailExists)
    }

    const hashedPassword = await argon2.hash(data.password)

    const user = this.userRepository.create({ ...data, password: hashedPassword, role: "user", failedAttempts: 0 })

    await this.em.persistAndFlush(user)

    return this.getTokensForUser(user)
  }


  async login(dto: LoginDto) {
    const users = await this.usersService.findByEmail(dto.email)
    const user = users[0]

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.auth.invalidCredentials)
    }

    // Vérifie si le compte est déjà bloqué
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000)
      throw new UnauthorizedException(`Compte bloqué. Veuillez réessayer dans ${remainingTime} minute(s).`)
    }

    if (!user.password) {
      throw new UnauthorizedException("Aucun mot de passe défini pour cet utilisateur")
    }

    const passwordValid = await argon2.verify(user.password, dto.password)
    if (!passwordValid) {
      user.failedAttempts += 1;

      const blockThreshold = 5;

      // Blocage automatique
      if (user.failedAttempts % blockThreshold === 0) {
        const blockCount = Math.floor(user.failedAttempts / blockThreshold);
        const blockMinutes = 5 * blockCount;
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + blockMinutes);
        user.lockUntil = lockTime;

        await this.em.persistAndFlush(user);

        throw new UnauthorizedException(
          `Compte bloqué pour ${blockMinutes} minute(s) suite à plusieurs tentatives échouées.`,
        );
      }

      await this.em.persistAndFlush(user);

      // Calcul des tentatives restantes avant le prochain blocage
      const attemptsSinceLastBlock = user.failedAttempts % blockThreshold;

      if (attemptsSinceLastBlock === 3) {
        throw new UnauthorizedException("Mot de passe incorrect. 2 essais restants avant blocage du compte.");
      }

      if (attemptsSinceLastBlock === 4) {
        throw new UnauthorizedException("Mot de passe incorrect. 1 essai restant avant blocage du compte.");
      }

      throw new UnauthorizedException(ErrorMessages.auth.invalidCredentials);
    }


    // réinitialise le compteur de tentatives après une connexion réussie
    user.failedAttempts = 0
    user.lockUntil = null
    await this.em.persistAndFlush(user)

    return this.getTokensForUser(user)
  }


  async logout(userId: string): Promise<{ message: string }> {

    const user = await this.usersService.findUserById(userId)

    user.refreshToken = null

    await this.em.persistAndFlush(user)

    return { message: "Déconnexion réussie ✅" }
  }


  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    let payload: any
    try {
      //verifie le refresh token
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      })
    } catch {
      throw new UnauthorizedException("Refresh token invalide ou expiré")
    }

    const user = await this.userRepository.findOne({ id: String(payload.sub) })
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException("Utilisateur introuvable ou pas de refresh stocké")
    }

    //comparer le refresh token stocké avec celui envoyé
    const valid = await argon2.verify(user.refreshToken, refreshToken)
    if (!valid) {
      throw new UnauthorizedException("Refresh token ne correspond pas")
    }

    //signAsync genère un nouveau token
    const access_token = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: "15m" },
    )

    return {
      access_token,
      refresh_token: refreshToken,
    }
  }


  async generateMagicLinkToken(email: string): Promise<string> {

    const token = randomUUID()
    const expiresAt = addMinutes(new Date(), 15) // expire dans 15 minutes

    const magicToken = new MagicLinkToken()
    magicToken.email = email
    magicToken.token = token
    magicToken.expiresAt = expiresAt

    await this.em.persistAndFlush(magicToken) //enrengistre le token en base

    return token
  }



  private async getTokensForUser(user: User): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role }

    const access_token = await this.jwtService.signAsync(payload, { expiresIn: "15m" })//génère un token d'accès
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: "7d" })//génère un token de rafraichissement

    user.refreshToken = await argon2.hash(refresh_token)//hash le token de rafraichissement avant de l'enregistrer

    await this.em.persistAndFlush(user)//enregistre les tokens en base

    return { access_token, refresh_token }
  }


  async loginWithEmail(email: string) {
    const user = await this.em.findOne(User, { email })

    if (!user) {
      throw new UnauthorizedException("Utilisateur introuvable")
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000)
      throw new UnauthorizedException(`Compte bloqué. Veuillez réessayer dans ${remainingTime} minute(s).`)
    }

    return this.getTokensForUser(user)
  }


  async creerMotDePasseFinal(token: string, newPassword: string): Promise<{ message: string }> {
    const magicToken = await this.em.findOne(MagicLinkToken, { token })
    if (!magicToken) throw new UnauthorizedException("Lien invalide ou déjà utilisé")

    const user = await this.userRepository.findOne({ email: magicToken.email })

    user!.password = await argon2.hash(newPassword)
    await this.em.removeAndFlush(magicToken)

    await this.em.persistAndFlush(user!)

    return { message: "Mot de passe créé avec succès ✅" }
  }


  async reinitialiserMotDePasseFinal(token: string, newPassword: string): Promise<{ message: string }> {
    const magicToken = await this.em.findOne(MagicLinkToken, { token })
    if (!magicToken) throw new UnauthorizedException("Lien invalide ou déjà utilisé")

    const user = await this.userRepository.findOne({ email: magicToken.email })

    // Vérifier si le nouveau mot de passe est identique à l'ancien
    const passwordIsSame = await argon2.verify(user!.password!, newPassword)
    if (passwordIsSame) {
      throw new BadRequestException("same password")
    }

    user!.password = await argon2.hash(newPassword)
    await this.em.removeAndFlush(magicToken)

    await this.em.persistAndFlush(user!)

    return { message: "Mot de passe réinitialisé avec succès ✅" }
  }


  async cleanupExpiredTokens(): Promise<void> {
    try {
      const result = await this.em.nativeDelete(MagicLinkToken, {
        expiresAt: { $lt: new Date() },
      })
      console.log(`${result} tokens expirés nettoyés avec succès`)
    } catch (error) {
      console.error("Erreur lors du nettoyage des tokens expirés:", error)
    }
  }
}
