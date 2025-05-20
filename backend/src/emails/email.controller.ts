import { Body, Controller, Post, Patch, BadRequestException } from "@nestjs/common"
import  { MailService } from "./email.service"
import  { AuthService } from "../auth/auth.service"

@Controller("emails")
export class EmailController {
  constructor(
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  @Post('send-magic-link-inscription')
  async sendMagicLinkInscription(@Body('email') email: string) {
    const token = await this.authService.generateMagicLinkToken(email);
    const url = `http://localhost:3000/auth/magic-auth-link?token=${token}`;
    return this.mailService.sendMagicLinkInscription(email, url);
  }

  @Post('send-magic-link-login')
  async sendMagicLinkLogin(@Body('email') email: string) {
    const token = await this.authService.generateMagicLinkToken(email);
    const url = `http://localhost:3000/auth/magic-auth-link?token=${token}`;
    return this.mailService.sendMagicLinkLogin(email, url);
  }

  @Patch('send-reinitialisation-password-link')
  async sendMagicLinkReinitialisation(@Body('email') email: string) {
    const token = await this.authService.generateMagicLinkToken(email);
    const url = `http://localhost:3000/auth/reset-password-link?token=${token}`;
    return this.mailService.sendMagicLinkReinitialisation(email, url);
  }

  @Post('send-create-password-link')
  async sendCreatePasswordLink(@Body('email') email: string) {
    const token = await this.authService.generateMagicLinkToken(email);
    const url = `http://localhost:3000/auth/create-password-link?token=${token}`;
    return this.mailService.sendMagicLinkCreatePassword(email, url);
  }

  @Post('confirm-email-change')
  async confirmEmailChange(@Body() data: { oldEmail: string, newEmail: string }) {
    try {
      const token = await this.authService.generateMagicLinkToken(data.newEmail);
      const url = `http://localhost:3000/auth/confirm-email-change?token=${token}&oldEmail=${encodeURIComponent(data.oldEmail)}`;
      await this.mailService.sendEmailChangeConfirmation(data.newEmail, url);
      return { message: 'Email de confirmation envoyé ✅' };
    } catch (error) {
      throw new BadRequestException('Erreur lors de l\'envoi de l\'email de confirmation');
    }
  }
}
