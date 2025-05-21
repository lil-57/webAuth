import { Injectable } from "@nestjs/common"
import { Resend } from "resend"

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY)

  async sendMagicLinkInscription(to: string, url: string) {
    return this.resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Inscription à ton compte",
      html: `
  <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif; color: #111827;">
    <div style="max-width: 480px; margin: auto; background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Title -->
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center; color: #1f2937;">
        Finalisez votre inscription
      </h2>

      <!-- Message -->
      <p style="margin-bottom: 16px; font-size: 15px;">
        Bonjour,<br /><br />
        Merci de votre intérêt pour notre service. Pour activer votre compte et finaliser votre inscription, veuillez cliquer sur le bouton ci-dessous :
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${url}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        ">
          Créer mon compte
        </a>
      </div>

      <!-- Footer -->
      <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
        Ce lien est valide pour une durée limitée. Si vous n'avez pas demandé la création d'un compte, vous pouvez ignorer ce message.
      </p>

      <p style="margin-top: 32px; font-size: 13px; color: #9ca3af;">
        — L'équipe support
      </p>
    </div>
  </div>
`,
    })
  }

  async sendMagicLinkLogin(to: string, url: string) {
    return this.resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Connexion à ton compte",
      html: `
  <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif; color: #111827;">
    <div style="max-width: 480px; margin: auto; background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

      <!-- Title -->
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center; color: #1f2937;">
        Finalisez votre connexion
      </h2>

      <!-- Message -->
      <p style="margin-bottom: 16px; font-size: 15px;">
        Bonjour,<br /><br />
        Merci de votre intérêt pour notre service. Pour vous connecter à votre compte, veuillez cliquer sur le bouton ci-dessous :
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${url}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        ">
          Connexion
        </a>
      </div>

      <!-- Footer -->
      <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
        Ce lien est valide pour une durée limitée. Si vous n'avez pas demandé la création d'un compte, vous pouvez ignorer ce message.
      </p>

      <p style="margin-top: 32px; font-size: 13px; color: #9ca3af;">
        — L'équipe support
      </p>
    </div>
  </div>
`,
    })
  }

  async sendMagicLinkReinitialisation(to: string, url: string) {
    return this.resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Réinitialisation de votre mot de passe",
      html: `
  <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif; color: #111827;">
    <div style="max-width: 480px; margin: auto; background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

      <!-- Title -->
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center; color: #1f2937;">
        Finalisez votre réinitialisation de mot de passe
      </h2>

      <!-- Message -->
      <p style="margin-bottom: 16px; font-size: 15px;">
        Bonjour,<br /><br />
        Merci de votre intérêt pour notre service. Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous :
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${url}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        ">
          Réinitialiser
        </a>
      </div>

      <!-- Footer -->
      <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
        Ce lien est valide pour une durée limitée. Si vous n'avez pas demandé la création d'un compte, vous pouvez ignorer ce message.
      </p>

      <p style="margin-top: 32px; font-size: 13px; color: #9ca3af;">
        — L'équipe support
      </p>
    </div>
  </div>
`,
    })
  }

  async sendMagicLinkCreatePassword(to: string, url: string) {
    return this.resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Création de votre mot de passe",
      html: `
  <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif; color: #111827;">
    <div style="max-width: 480px; margin: auto; background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

      <!-- Title -->
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center; color: #1f2937;">
        Créez votre mot de passe
      </h2>

      <!-- Message -->
      <p style="margin-bottom: 16px; font-size: 15px;">
        Bonjour,<br /><br />
        Vous avez demandé à créer un mot de passe pour votre compte. Pour définir votre mot de passe, veuillez cliquer sur le bouton ci-dessous :
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${url}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        ">
          Créer mon mot de passe
        </a>
      </div>

      <!-- Footer -->
      <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
        Ce lien est valide pour une durée de 15 minutes. Si vous n'avez pas demandé à créer un mot de passe, vous pouvez ignorer ce message.
      </p>

      <p style="margin-top: 32px; font-size: 13px; color: #9ca3af;">
        — L'équipe support
      </p>
    </div>
  </div>
`,
    })
  }

  async sendEmailChangeConfirmation(to: string, url: string) {
    return this.resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Confirmation de changement d'adresse email",
      html: `
<div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif; color: #111827;">
  <div style="max-width: 480px; margin: auto; background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

    <!-- Title -->
    <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center; color: #1f2937;">
      Confirmation de changement d'email
    </h2>

    <!-- Message -->
    <p style="margin-bottom: 16px; font-size: 15px;">
      Bonjour,<br /><br />
      Vous avez demandé à changer votre adresse email. Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :
    </p>

    <!-- Button -->
    <div style="text-align: center; margin: 24px 0;">
      <a href="${url}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #10b981;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
      ">
        Confirmer le changement d'email
      </a>
    </div>

    <!-- Footer -->
    <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
      Ce lien est valide pour une durée de 15 minutes. Si vous n'avez pas demandé ce changement, vous pouvez ignorer ce message.
    </p>

    <p style="margin-top: 32px; font-size: 13px; color: #9ca3af;">
      — L'équipe support
    </p>
  </div>
</div>
`,
    })
  }
}
