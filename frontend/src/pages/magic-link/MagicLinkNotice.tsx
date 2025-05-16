"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useMagicLinkForm } from "./useMagicLinkForm"
import type { PropsMagicLink } from "./MagicLinkInterface"

export default function MagicLinkNotice({ context }: PropsMagicLink) {
  const { resetMagicLinkSent } = useMagicLinkForm(context)

  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-600">
          Un lien de connexion a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.
        </AlertDescription>
      </Alert>
      <div className="bg-muted/50 p-4 rounded-lg border border-border">
        <p className="text-sm text-center">
          Vous n'avez pas reçu le lien ? Vérifiez vos spams ou
          <Button variant="link" className="p-0 h-auto ml-1" onClick={resetMagicLinkSent}>
            essayez à nouveau
          </Button>
        </p>
      </div>
    </div>
  )
}
