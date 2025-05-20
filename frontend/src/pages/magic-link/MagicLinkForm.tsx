"use client"

import { useMagicLinkForm } from "./useMagicLinkForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import MagicLinkNotice from "./MagicLinkNotice"
import type { PropsMagicLink } from "./MagicLinkInterface"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useCaptcha } from "@/hooks/useCaptcha"

export default function MagicLinkForm({ context }: PropsMagicLink) {
  const {
    values,
    handleChange,
    handleSubmit,
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
    await submitMagicLink(captchaToken)
  }


  // Si déjà envoyé, on affiche juste le message
  if (magicLinkSent) {
    return <MagicLinkNotice context={context} />
  }

  


  const isButtonDisabled =
    isSubmitting ||
    isEmailChecking ||
    !emailValid ||
    (context === "login" && !emailExists) ||
    (context === "register" && emailExists) || accountLocked || !isCaptchaValid

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
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
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

      <div className="bg-muted/50 p-4 rounded-lg border border-border flex items-center gap-3">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">Connexion sans mot de passe</p>
          <p className="text-xs text-muted-foreground">
            Nous vous enverrons un lien magique par email pour vous connecter instantanément
          </p>
        </div>
      </div>


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

      <Button type="submit" className="w-full" disabled={isButtonDisabled}>
        {isSubmitting ? "Envoi en cours..." : "Recevoir un lien magique"}
      </Button>
    </form>

    
  )
}
