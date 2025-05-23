import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  BadRequestException,
  Get,
  Query,
  Patch,
  NotFoundException,
} from "@nestjs/common"
import { Request, Response } from "express"

import { AuthService } from "./auth.service"
import { JwtAuthGuard } from "./jwt-auth.guard"

import { CreateUserDto } from "./dto/create-user.dto"
import { LoginDto } from "./dto/login.dto"
import { RequestWithUser } from "./types/request-with-user"

import { EntityManager, EntityRepository } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { User } from "../user/user.entity"
import { MailService } from "../emails/email.service"
import { MagicLinkToken } from "../emails/email.token.entity"
import { CookieOptions } from "express"
import { verifyCaptcha } from "../utils/verifyCaptcha"

import { ConfigService } from "@nestjs/config"

const COOKIE_OPTS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) { }

  @Post("register")
  async register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { captchaToken, ...rest } = dto

      const isHuman = await verifyCaptcha(captchaToken)
    if (!isHuman) {
      throw new BadRequestException("Captcha invalide")
    }

    const { access_token, refresh_token } = await this.authService.createUser(dto)

    // on pose les deux tokens en cookies
    res.cookie("access_token", access_token, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 })
    res.cookie("refresh_token", refresh_token, { ...COOKIE_OPTS, maxAge: 7 * 24 * 3600 * 1000 })

    return { message: "Inscription réussie" }
  }


  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { captchaToken, ...rest } = dto

    const isHuman = await verifyCaptcha(captchaToken)
    if (!isHuman) {
      throw new BadRequestException("Captcha invalide")
    }
    
    const { access_token, refresh_token } = await this.authService.login(dto)

    res.cookie("access_token", access_token, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 })
    res.cookie("refresh_token", refresh_token, { ...COOKIE_OPTS, maxAge: 7 * 24 * 3600 * 1000 })

    return { message: "Connexion réussie" }
  }


  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(204)
  async logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {

    await this.authService.logout(req.user.id)

    res.clearCookie("access_token")
    res.clearCookie("refresh_token")
    res.clearCookie("email_for_password")
    res.clearCookie("token_for_password")


    return { message: "Déconnexion réussie" }
  }

  //ici req pour lire les cookies et res pour les écrire
  @Post("refresh")
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies["refresh_token"]
    if (!token) {
      throw new BadRequestException("Refresh token manquant")
    }

    const { access_token, refresh_token } = await this.authService.refreshToken(token)

    res.cookie("access_token", access_token, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 })
    res.cookie("refresh_token", refresh_token, { ...COOKIE_OPTS, maxAge: 7 * 24 * 3600 * 1000 })

    return { message: "Tokens rafraîchis" }
  }


  @Get("create-password-link")
  async createPasswordLink(@Query("token") token: string, @Res() res: Response) {

    const frontendUrl = this.configService.get<string>("FRONTEND_URL");

    try {
      const magicToken = await this.em.findOne(MagicLinkToken, { token })

      

      if (!magicToken || magicToken.expiresAt < new Date()) {
        if (magicToken) await this.em.removeAndFlush(magicToken)
        return res.redirect(`${frontendUrl}/error-link`)
      }

      const email = magicToken.email

      res.cookie("email_for_password", email, {
        ...COOKIE_OPTS,
        maxAge: 15 * 60 * 1000,
 
      })

      res.cookie("token_for_password", token, {
        ...COOKIE_OPTS,
        maxAge: 15 * 60 * 1000,
      })

      return res.redirect(`${frontendUrl}/password?mode=create`)
    } catch (error) {
      return res.redirect(`${frontendUrl}/error-link`)
    }
  }


  @Get("reset-password-link")
  async resetPasswordLink(@Query('token') token: string, @Res() res: Response) {

    const frontendUrl = this.configService.get<string>("FRONTEND_URL");
    try {
      const magicToken = await this.em.findOne(MagicLinkToken, { token })

      if (!magicToken || magicToken.expiresAt < new Date()) {
        if (magicToken) await this.em.removeAndFlush(magicToken)
        return res.redirect(`${frontendUrl}/error-link`)
      }

      const email = magicToken.email

      res.cookie("email_for_password", email, {
        ...COOKIE_OPTS,
        maxAge: 15 * 60 * 1000,
  
      })

      res.cookie("token_for_password", token, {
        ...COOKIE_OPTS,
        maxAge: 15 * 60 * 1000,
        
      })

      return res.redirect(`${frontendUrl}/password?mode=reset`)
    } catch (error) {
      return res.redirect(`${frontendUrl}/error-link`)
    }
  }


  @Patch("create-password")
  async createPassword(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies["token_for_password"]
    const newPassword = req.body.newPassword

    if (!token) {
      throw new BadRequestException("Token manquant")
    }

    await this.authService.creerMotDePasseFinal(token, newPassword)

    // Nettoyage des cookies temporaires
    res.clearCookie("email_for_password")
    res.clearCookie("token_for_password")

    return { message: "Mot de passe créé avec succès ✅" }
  }


  @Patch("reset-password")
  async resetPassword(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies["token_for_password"]
    const newPassword = req.body.newPassword

    if (!token) {
      throw new BadRequestException("Token manquant")
    }

    await this.authService.reinitialiserMotDePasseFinal(token, newPassword)

    // Nettoyage des cookies temporaires
    res.clearCookie("email_for_password")
    res.clearCookie("token_for_password")

    return { message: "Mot de passe réinitialisé avec succès ✅" }
  }



  @Get("magic-auth-link")
  async magicAuthLink(@Query('token') token: string, @Res() res: Response) {

    const frontendUrl = this.configService.get<string>("FRONTEND_URL");

    try {
      const magicToken = await this.em.findOne(MagicLinkToken, { token })

      if (!magicToken || magicToken.expiresAt < new Date()) {
        if (magicToken) await this.em.removeAndFlush(magicToken)
        return res.redirect(`${frontendUrl}/error-link`)
      }

      const email = magicToken.email

      let user = await this.em.findOne(User, { email })
      if (!user) {
        user = new User()
        user.email = email
        await this.em.persistAndFlush(user)
      }

      //Ici, on peut supprimer le token (car c'est un lien de login immédiat)
      await this.em.removeAndFlush(magicToken)

      const { access_token, refresh_token } = await this.authService.loginWithEmail(user.email)

      res.cookie("access_token", access_token, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 })
      res.cookie("refresh_token", refresh_token, { ...COOKIE_OPTS, maxAge: 7 * 24 * 3600 * 1000 })

      return res.redirect(`${frontendUrl}/`)
    } catch (error) {
      return res.redirect(`${frontendUrl}/error-link`)
    }
  }


  @Get("check-token")
  async checkToken(@Query('token') token: string, @Query('mode') mode) {
    const magic = await this.em.findOne(MagicLinkToken, { token })

    if (!magic) throw new BadRequestException("Token invalide")

    return { valid: true, mode }
  }


  @Get("confirm-email-change")
  async confirmEmailChange(
    @Query('token') token: string,
    @Query('oldEmail') oldEmail: string,
    @Res() res: Response
  ) {
    const frontendUrl = this.configService.get<string>("FRONTEND_URL");
    try {
      const magicToken = await this.em.findOne(MagicLinkToken, { token })

      if (!magicToken || magicToken.expiresAt < new Date()) {
        if (magicToken) await this.em.removeAndFlush(magicToken)
        return res.redirect(`${frontendUrl}/error-link`)
      }

      const email = magicToken.email

      const user = await this.userRepository.findOne({ email: oldEmail })

      if (!user) {
        return res.redirect(`${frontendUrl}/error-link`)
      }

      user.email = email
      await this.em.removeAndFlush(magicToken) //suppression après usage
      await this.em.persistAndFlush(user)//ajout de l'email en base

      res.clearCookie("access_token")
      res.clearCookie("refresh_token")

      return res.redirect(`${frontendUrl}/login?emailChanged=success`)
    } catch {
      return res.redirect(`${frontendUrl}/error-link`)
    }
  }
}
