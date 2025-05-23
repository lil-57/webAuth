"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRegisterForm } from "./useRegisterForm"
import RegisterFields from "./RegisterFields"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import { useCaptcha } from "@/hooks/useCaptcha"
import { useIsMobile } from "@/hooks/useIsMobile"

export default function RegisterForm() {
  const {
    values,
    handleChange,
    isSubmitting,
    error,
    isFormValid,
    showErrors,
    validationStatus,
    isEmailChecking,
    submitRegister,
    captchaResetKey,
  } = useRegisterForm()

    const isMobile = useIsMobile()
    const isV3 = isMobile

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
      tokenToUse = await executeV3("register")
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
    await submitRegister(tokenToUse as string)
  }

  // Calcul de la désactivation du bouton
  // Sur desktop: désactivé si le captcha n'est pas validé
  // Sur mobile: pas besoin de valider le captcha avant de cliquer
  const isButtonDisabled = isSubmitting || !isFormValid || (!isV3 && !isCaptchaValid)

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <RegisterFields
          values={values}
          onChange={handleChange}
          showErrors={showErrors}
          validationStatus={validationStatus}
          isEmailChecking={isEmailChecking}
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
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </form>
    </>
  )
}
