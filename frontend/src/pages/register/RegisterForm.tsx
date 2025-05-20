"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import RegisterFields from "./RegisterFields"
import { useRegisterForm } from "./useRegisterForm"
import { useState } from "react"
import { useCaptcha } from "@/hooks/useCaptcha"
import ReCAPTCHA from "react-google-recaptcha"

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
      await submitRegister(captchaToken)
    }


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

      <div className="w-full justify-center flex p-2 relative overflow-visible flex-col items-center ">
        <ReCAPTCHA
          sitekey="6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B"
          key={captchaResetKey}
          ref={recaptchaRef}
          onChange={onChange}
          onExpired={onExpired}
        />
      </div>


      {captchaError && (
        <p className="text-sm text-red-600 mt-1">{captchaError}</p>
      )}

        

        <Button type="submit" className="w-full" disabled={isSubmitting || !isFormValid || !isCaptchaValid}>
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </form>
    </>
  )
}
