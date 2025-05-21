"use client"

import { useEffect, useState } from "react"
import { useForm } from "@/hooks/use-form"
import { emailRegex } from "@/utils/regexEmail"
import { sendMagicLinkInscription, sendMagicLinkLogin } from "@/utils/sendMagicLink"
import type { MagicLinkFormValues } from "./MagicLinkInterface"
import Cookies from "js-cookie"
import { fetchWithBaseUrl } from "@/utils/fetchWithBaseUrl"

export function useMagicLinkForm(context: "login" | "register") {
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [showEmailError, setShowEmailError] = useState(false)
  const [emailExists, setEmailExists] = useState(true)
  const [isEmailChecking, setIsEmailChecking] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [accountLocked, setAccountLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)

  const [captchaResetKey, setCaptchaResetKey] = useState(0)

  const { values, handleChange, handleSubmit, isSubmitting } = useForm<MagicLinkFormValues>({
    initialValues: { email: "" },
    validate: (vals) => {
      const errors: Partial<Record<keyof MagicLinkFormValues, string>> = {}
      if (!vals.email) errors.email = "L'email est requis"
      else if (!emailRegex.test(vals.email)) errors.email = "Format d'email invalide"
      return errors
    },
    onSubmit: async (vals) => {
      if (context === "register" && emailExists) return
      if (context === "login" && !emailExists) return

      try {
        if (context === "register") {
          await sendMagicLinkInscription(vals)
        } else {
          await sendMagicLinkLogin(vals)
        }
        setMagicLinkSent(true)
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erreur d'envoi du lien"
        setError(errorMessage)

        if (errorMessage.includes("Compte bloqué")) {
          setAccountLocked(true)

          const minutesMatch = errorMessage.match(/(\d+) minute/)
          if (minutesMatch) {
            const minutes = parseInt(minutesMatch[1])
            const until = Date.now() + minutes * 60 * 1000

            Cookies.set("blockedEmail", values.email, { expires: 1 })
            Cookies.set("blockedUntil", until.toString(), { expires: 1 })

            startLockTimer(minutes * 60)
          }
        }
      }
    },
  })

  const startLockTimer = (seconds: number) => {
    setLockTimeRemaining(seconds)
    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setAccountLocked(false)
          setError(null)
          Cookies.remove("blockedEmail")
          Cookies.remove("blockedUntil")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Lecture des cookies si la page est rechargée
  useEffect(() => {
    if (!values.email) {
      setAccountLocked(false);
      setError(null);
      return;
    }

    const blockedEmail = Cookies.get("blockedEmail");
    const blockedUntil = Cookies.get("blockedUntil");
    const now = Date.now();

    //Si l'email est bloqué ET le blocage est encore actif
    if (blockedEmail === values.email && blockedUntil && now < Number(blockedUntil)) {
      const remaining = Math.floor((Number(blockedUntil) - now) / 1000);
      setAccountLocked(true);
      setError("Compte temporairement bloqué");
      startLockTimer(remaining);
    }
    //Si email différent mais cookies encore valides, on NE les supprime PAS
    else if (values.email !== blockedEmail) {
      // juste masquer l’état visuellement sans supprimer les cookies
      setAccountLocked(false);
      setError(null);
    }
    //Si le blocage est expiré, on nettoie
    else if (blockedUntil && now >= Number(blockedUntil)) {
      setAccountLocked(false);
      setError(null);
      Cookies.remove("blockedEmail");
      Cookies.remove("blockedUntil");
    }
  }, [values.email]);

  
  // debounce email
  useEffect(() => {
    setShowEmailError(false)
    setEmailExists(true)
    setIsEmailChecking(false)

    if (!values.email) return

    setIsEmailChecking(true)
    const handler = setTimeout(async () => {
      setShowEmailError(true)
      if (emailRegex.test(values.email)) {
        try {
          const res = await fetchWithBaseUrl(`/users/check-email?email=${encodeURIComponent(values.email)}`)//encodeURIComponent pour éviter les caractères spéciaux dans l'url
          if (res.ok) {
            const { exists } = await res.json()
            setEmailExists(exists)
          }
        } catch (err) {
          console.error("Erreur de vérification email:", err)
        } finally {
          setIsEmailChecking(false)
        }
      } else {
        setIsEmailChecking(false)
      }
    }, 1000)

    return () => {
      clearTimeout(handler)
      setIsEmailChecking(false)
    }
  }, [values.email])

  function resetMagicLinkSent() {
    setMagicLinkSent(false)
  }

  const formatRemainingTime = () => {
    const minutes = Math.floor(lockTimeRemaining / 60)
    const seconds = lockTimeRemaining % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const submitMagicLink = async (captchaToken: string) => {
    try {
      if (context === "register") {
        await sendMagicLinkInscription(values)
      } else {
        await sendMagicLinkLogin(values)
      }
      setMagicLinkSent(true)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur d'envoi du lien"
      setError(errorMessage)

      // Réinitialiser le captcha (même logique que login)
      setCaptchaResetKey(prev => prev + 1)

      if (errorMessage.includes("Compte bloqué")) {
        setAccountLocked(true)

        const minutesMatch = errorMessage.match(/(\d+) minute/)
        if (minutesMatch) {
          const minutes = parseInt(minutesMatch[1])
          const until = Date.now() + minutes * 60 * 1000

          Cookies.set("blockedEmail", values.email, { expires: 1 })
          Cookies.set("blockedUntil", until.toString(), { expires: 1 })

          startLockTimer(minutes * 60)
        }
      }
    }
  }


  return {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    showEmailError,
    emailValid: emailRegex.test(values.email),
    emailExists,
    magicLinkSent,
    resetMagicLinkSent,
    isEmailChecking,
    error,
    accountLocked,
    lockTimeRemaining,
    formatRemainingTime,
    submitMagicLink,
    captchaResetKey,
  }
}
