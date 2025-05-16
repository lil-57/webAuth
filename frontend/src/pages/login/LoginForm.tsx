"use client"

import { useState } from "react"
import { useLoginForm } from "./useLoginForm"
import LoginFields from "./LoginFields"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha";
import { useCaptcha } from "@/hooks/useCaptcha"

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

  const isFormValid = emailValid && passwordValid

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
    await submitLogin(captchaToken)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {accountLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
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

      <Button type="submit" className="w-full" disabled={isSubmitting || !isFormValid || accountLocked || !isCaptchaValid}>
        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  )
}
