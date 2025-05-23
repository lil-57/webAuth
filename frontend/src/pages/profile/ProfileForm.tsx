"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import useProfileForm from "./useProfileForm"
import ProfileFields from "./ProfileFields"
import { useCaptcha } from "@/hooks/useCaptcha"
import ReCAPTCHA from "react-google-recaptcha"
import { useIsMobile } from "@/hooks/useIsMobile"

export default function ProfileForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const {
    user,
    values,
    errors,
    isEditing,
    isSubmitting,
    profileSuccess,
    profileError,
    showEmailWarning,
    isEmailChanged,
    isEmailChecking,
    emailExists,
    showErrors,
    validationStatus,
    handleChange,
    handleEditToggle,
    confirmEmailChange,
    cancelEmailChange,
    submitProfileValidation,
    captchaResetKey,
  } = useProfileForm()

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
      tokenToUse = await executeV3("profile_update")
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
    await submitProfileValidation(tokenToUse as string)
  }

  // Calcul de la désactivation du bouton
  // Sur desktop: désactivé si le captcha n'est pas validé
  // Sur mobile: pas besoin de valider le captcha avant de cliquer
  const isButtonDisabled =
    isSubmitting || (validationStatus.emailExists && values.email !== user?.email) || (!isV3 && !isCaptchaValid)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>Consultez ou modifiez vos informations personnelles</CardDescription>
      </CardHeader>

      <CardContent>
        {profileSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">{profileSuccess}</AlertDescription>
          </Alert>
        )}

        {profileError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{profileError}</AlertDescription>
          </Alert>
        )}

        {showEmailWarning && isEmailChanged && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <div className="flex flex-col gap-2">
              <AlertDescription className="text-amber-700">
                <span className="font-medium">Attention :</span> Si vous modifiez votre adresse email, vous recevrez un
                email de confirmation à la nouvelle adresse. Vous aurez 15 minutes pour confirmer ce changement, sinon
                votre adresse email sera restaurée.
              </AlertDescription>

              {captchaError && <p className="text-sm text-red-600 mt-1">{captchaError}</p>}

              <div className="flex flex-wrap gap-2 mt-2">
                <Button size="sm" onClick={confirmEmailChange} className="bg-amber-600 hover:bg-amber-700">
                  Confirmer le changement
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEmailChange}>
                  Annuler
                </Button>
              </div>
            </div>
          </Alert>
        )}

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <ProfileFields
            values={values}
            errors={errors}
            onChange={handleChange}
            isEditing={isEditing}
            isEmailChecking={isEmailChecking}
            emailExists={emailExists}
            showErrors={showErrors}
            validationStatus={validationStatus}
          />

          <div className="flex flex-wrap gap-2 pt-4">
            {!isEditing && (
              <Button type="button" onClick={handleEditToggle}>
                Modifier
              </Button>
            )}
            {isEditing && (
              <>
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
                  <div className="w-full text-center text-sm text-muted-foreground mb-2">
                    <p>Protection reCAPTCHA activée</p>
                  </div>
                )}

                <Button type="button" onClick={() => formRef.current?.requestSubmit()} disabled={isButtonDisabled}>
                  {isSubmitting ? "Mise à jour..." : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={handleEditToggle}>
                  Annuler
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
