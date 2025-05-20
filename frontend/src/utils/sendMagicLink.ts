import type { MagicLinkFormValues } from "@/pages/magic-link/MagicLinkInterface"

export async function sendMagicLinkInscription(data: MagicLinkFormValues) {
  const res = await fetch("http://localhost:3000/emails/send-magic-link-inscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Échec de l’envoi du lien magique")
  }

  return res.json()
}

export async function sendMagicLinkLogin(data: MagicLinkFormValues) {
  const res = await fetch("http://localhost:3000/emails/send-magic-link-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Échec de l’envoi du lien magique")
  }

  return res.json()
}
