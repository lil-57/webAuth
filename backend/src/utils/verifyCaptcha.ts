import axios from "axios"

export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) throw new Error("Clé secrète reCAPTCHA manquante")

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret,
        response: token,
      },
    })

    const { success, score, action } = response.data

    // Pour reCAPTCHA v2, on vérifie juste le succès
    if (success && !score) {
      return true
    }

    // Pour reCAPTCHA v3, on vérifie le score (doit être > 0.5)
    if (success && score !== undefined) {
      console.log(`reCAPTCHA v3 - Action: ${action}, Score: ${score}`)
      return score > 0.5
    }

    return false
  } catch (error) {
    console.error("Erreur lors de la vérification reCAPTCHA:", error)
    return false
  }
}
