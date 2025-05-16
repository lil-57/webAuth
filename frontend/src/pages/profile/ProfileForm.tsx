"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useRef } from "react"
import useProfileForm from "./useProfileForm"
import ProfileFields from "./ProfileFields"
import { useCaptcha } from "@/hooks/useCaptcha"
import ReCAPTCHA from "react-google-recaptcha"
import { useState } from "react"


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



  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const {
    recaptchaRef,
    captchaToken,
    isCaptchaValid,
    onChange,
    onExpired,
  } = useCaptcha("6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!captchaToken) return

    setCaptchaError("");
    await submitProfileValidation(captchaToken)
  }

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




              {captchaError && (
                <p className="text-sm text-red-600 mt-1">{captchaError}</p>
              )}

              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={confirmEmailChange} className="bg-amber-600 hover:bg-amber-700" disabled={!isCaptchaValid}>
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

          <div className="flex gap-2 pt-4">
            {!isEditing && (
              <Button type="button" onClick={handleEditToggle}>
                Modifier
              </Button>
            )}
            {isEditing && (
              <>

                <div className="w-full justify-center flex p-2 relative overflow-visible flex-col items-center ">
                  <ReCAPTCHA
                    sitekey="6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B"
                    key={captchaResetKey}
                    ref={recaptchaRef}
                    onChange={onChange}
                    onExpired={onExpired}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={isSubmitting || (validationStatus.emailExists && values.email !== user?.email) || !isCaptchaValid}
                >
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
