import axios from 'axios'

export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) throw new Error("Clé secrète reCAPTCHA manquante")

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret,
        response: token,
      },
    }
  )

  return response.data.success
}
