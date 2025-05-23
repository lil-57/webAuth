"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLoginForm } from "./useLoginForm"
import LoginFields from "./LoginFields"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import { useCaptcha } from "@/hooks/useCaptcha"
import { useIsMobile } from "@/hooks/useIsMobile"

// Déclaration pour TypeScript
declare global {
  interface Window {
    grecaptcha: any
  }
}

export default function LoginForm() {
  const {
    values,
    handleChange,
    isSubmitting,
    error,
    showPassword,
    togglePassword,
    showEmailError,
    showPasswordError,
    emailValid,
    passwordValid,
    accountLocked,
    formatRemainingTime,
    submitLogin,
    captchaResetKey,
  } = useLoginForm()

  const isMobile = useIsMobile()
  const isV3 = isMobile

  const isFormValid = emailValid && passwordValid

  const [captchaError, setCaptchaError] = useState<string | null>(null)

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
      tokenToUse = await executeV3("login")
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
    await submitLogin(tokenToUse as string)
  }

  // Calcul de la désactivation du bouton
  // Sur desktop: désactivé si le captcha n'est pas validé
  // Sur mobile: pas besoin de valider le captcha avant de cliquer
  const isButtonDisabled = isSubmitting || !isFormValid || accountLocked || (!isV3 && !isCaptchaValid)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {accountLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 sm:p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <p className="text-amber-800 font-medium">Compte temporairement bloqué</p>
          </div>
          <p className="text-amber-700 mt-1">Temps restant: {formatRemainingTime()}</p>
        </div>
      )}

      <LoginFields
        values={values}
        handleChange={handleChange}
        showPassword={showPassword}
        togglePassword={togglePassword}
        showEmailError={showEmailError}
        showPasswordError={showPasswordError}
        emailValid={emailValid}
        passwordValid={passwordValid}
      />

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
        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  )
}
