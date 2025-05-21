import type { MagicLinkFormValues } from "@/pages/magic-link/MagicLinkInterface"
import { fetchWithBaseUrl } from "./fetchWithBaseUrl"

export async function sendMagicLinkInscription(data: MagicLinkFormValues) {
  const res = await fetchWithBaseUrl("/emails/send-magic-link-inscription", {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Échec de l’envoi du lien magique")
  }

  return res.json()
}

export async function sendMagicLinkLogin(data: MagicLinkFormValues) {
  const res = await fetchWithBaseUrl("/emails/send-magic-link-login", {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Échec de l’envoi du lien magique")
  }

  return res.json()
}
