import { Body, Controller, Get, Param, Delete, Patch, Query, Header, Post } from "@nestjs/common"

import { UserService } from "./user.service"

import { UseGuards, Req } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { RequestWithUser } from "src/auth/types/request-with-user"

import { UserResponseDto } from "./dto/user-response.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { Roles } from "src/auth/roles.decorator"
import { RolesGuard } from "src/auth/roles.guard"

import { BadRequestException } from "@nestjs/common"
import { verifyCaptcha } from "src/utils/verifyCaptcha"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('check-email')
  @Header('Cache-Control', 'no-store, max-age=0')
  async checkEmail(@Query('email') email: string) {
    const exists = await this.userService.emailExists(email);
    return { exists };
  }

  @Post('check-email-confirmed')
  @Header('Cache-Control', 'no-store, max-age=0')
  async checkEmailConfirmed(@Body() data: { email: string }) {
    const user = await this.userService.findByEmail(data.email);
    return { confirmed: user.length > 0 };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me') 
  getMe(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me') 
  deleteMyAccount(@Req() req: RequestWithUser) {
    return this.userService.deleteUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get()  
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id') 
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")  
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto, ) {
    const { captchaToken, ...rest } = updateUserDto

    const isHuman = await verifyCaptcha(captchaToken)
    if (!isHuman) {
      throw new BadRequestException("Captcha invalide")
    }
    return this.userService.updateUser(req.user.id, updateUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me/password") 
  changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.id, changePasswordDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id') 
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
