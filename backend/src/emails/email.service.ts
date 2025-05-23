
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  async sendMagicLinkInscription(to: string, url: string) {
    return this.transporter.sendMail({
      from: `"WebAuth" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Inscription à ton compte",
      html: this.generateEmailHtml(url, 'Créer mon compte', 'Finalisez votre inscription'),
    });
  }

  async sendMagicLinkLogin(to: string, url: string) {
    return this.transporter.sendMail({
      from: `"WebAuth" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Connexion à ton compte",
      html: this.generateEmailHtml(url, 'Connexion', 'Finalisez votre connexion'),
    });
  }

  async sendMagicLinkReinitialisation(to: string, url: string) {
    return this.transporter.sendMail({
      from: `"WebAuth" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Réinitialisation de votre mot de passe",
      html: this.generateEmailHtml(url, 'Réinitialiser', 'Finalisez votre réinitialisation de mot de passe'),
    });
  }

  async sendMagicLinkCreatePassword(to: string, url: string) {
    return this.transporter.sendMail({
      from: `"WebAuth" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Création de votre mot de passe",
      html: this.generateEmailHtml(url, 'Créer mon mot de passe', 'Créez votre mot de passe'),
    });
  }

  async sendEmailChangeConfirmation(to: string, url: string) {
    return this.transporter.sendMail({
      from: `"WebAuth" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Confirmation de changement d'adresse email",
      html: this.generateEmailHtml(url, "Confirmer le changement d'email", "Confirmation de changement d'email"),
    });
  }

  private generateEmailHtml(url: string, buttonText: string, title: string) {
    return `
      <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif; color: #111827;">
        <div style="max-width: 480px; margin: auto; background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center; color: #1f2937;">${title}</h2>
          <p style="margin-bottom: 16px; font-size: 15px;">Bonjour,<br /><br />Veuillez cliquer sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              ${buttonText}
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">Ce lien est valide pour une durée limitée. Si vous n'avez pas fait cette demande, ignorez ce message.</p>
          <p style="margin-top: 32px; font-size: 13px; color: #9ca3af;">— L'équipe support</p>
        </div>
      </div>
    `;
  }
}
