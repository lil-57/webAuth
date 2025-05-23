"use client"

import type React from "react"
import { useMagicLinkForm } from "./useMagicLinkForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import MagicLinkNotice from "./MagicLinkNotice"
import type { PropsMagicLink } from "./MagicLinkInterface"
import { AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useCaptcha } from "@/hooks/useCaptcha"
import { useIsMobile } from "@/hooks/useIsMobile"

export default function MagicLinkForm({ context }: PropsMagicLink) {
  const {
    values,
    handleChange,
    isSubmitting,
    showEmailError,
    emailValid,
    emailExists,
    magicLinkSent,
    isEmailChecking,
    accountLocked,
    formatRemainingTime,
    captchaResetKey,
    submitMagicLink,
  } = useMagicLinkForm(context)

  const [captchaError, setCaptchaError] = useState<string | null>(null)

    const isMobile = useIsMobile()
    const isV3 = isMobile

  const { recaptchaRef, captchaToken, isCaptchaValid, onChange, onExpired, executeV3 } = useCaptcha(
    "6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B",
  )

  // Charger reCAPTCHA v3 si nécessaire
  useEffect(() => {
    if (isV3) {
      const script = document.createElement("script")
      script.src = `https://www.google.com/recaptcha/api.js?render=6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B`
      script.async = true
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [isV3])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let tokenToUse = captchaToken

    // Si c'est v3, exécuter le captcha au moment du submit
    if (isV3) {
      tokenToUse = await executeV3("magic_link")
      if (!tokenToUse) {
        setCaptchaError("Erreur de validation. Veuillez réessayer.")
        return
      }
    } else if (!captchaToken) {
      setCaptchaError("Veuillez valider le captcha.")
      return
    }

    setCaptchaError("")
    // À ce stade, tokenToUse ne peut pas être null grâce aux vérifications ci-dessus
    await submitMagicLink(tokenToUse as string)
  }

  // Si déjà envoyé, on affiche juste le message
  if (magicLinkSent) {
    return <MagicLinkNotice context={context} />
  }

  // Calcul de la désactivation du bouton
  // Sur desktop: désactivé si le captcha n'est pas validé
  // Sur mobile: pas besoin de valider le captcha avant de cliquer
  const isButtonDisabled =
    isSubmitting ||
    isEmailChecking ||
    !emailValid ||
    (context === "login" && !emailExists) ||
    (context === "register" && emailExists) ||
    accountLocked ||
    (!isV3 && !isCaptchaValid)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="exemple@email.com"
          value={values.email}
          onChange={handleChange}
        />

        {accountLocked && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 sm:p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-800 font-medium">Compte temporairement bloqué</p>
            </div>
            <p className="text-amber-700 mt-1">Temps restant: {formatRemainingTime()}</p>
          </div>
        )}

        {isEmailChecking && <p className="text-sm text-muted-foreground">Vérification en cours...</p>}
        {showEmailError && !emailValid && <p className="text-sm text-destructive">Format d'email invalide</p>}
        {context === "login" && showEmailError && emailValid && !emailExists && (
          <p className="text-sm text-destructive">L'email est inconnu</p>
        )}
        {context === "register" && showEmailError && emailValid && emailExists && (
          <p className="text-sm text-destructive">Cet email est déjà utilisé</p>
        )}
      </div>

      <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">Connexion sans mot de passe</p>
          <p className="text-xs text-muted-foreground">
            Nous vous enverrons un lien magique par email pour vous connecter instantanément
          </p>
        </div>
      </div>

      {/* Afficher reCAPTCHA v2 seulement sur desktop */}
      {!isV3 && (
        <div className="w-full overflow-x-auto py-2 -mx-4 px-4">
          <div className="flex justify-center min-w-0">
            <div className="transform scale-[0.5] origin-center xs:scale-[0.6] sm:scale-[0.8] md:scale-100 shrink-0">
              <ReCAPTCHA
                sitekey="6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B"
                key={captchaResetKey}
                ref={recaptchaRef}
                onChange={onChange}
                onExpired={onExpired}
                size="normal"
                theme="light"
              />
            </div>
          </div>
        </div>
      )}

      {/* Message pour v3 sur mobile */}
      {isV3 && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Protection reCAPTCHA activée</p>
        </div>
      )}

      {captchaError && <p className="text-sm text-red-600 mt-1 text-center">{captchaError}</p>}

      <Button type="submit" className="w-full" disabled={isButtonDisabled}>
        {isSubmitting ? "Envoi en cours..." : "Recevoir un lien magique"}
      </Button>
    </form>
  )
}
