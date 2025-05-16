"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useSearchParams } from "react-router-dom"
import { AlertCircle } from "lucide-react"

export default function ErrorLinkPage() {
  const [searchParams] = useSearchParams()
  const errorType = searchParams.get("type") || "expired"
  const action = searchParams.get("action") || "general"

  const getErrorMessage = () => {
    switch (errorType) {
      case "expired":
        return "Le lien que vous avez utilisé a expiré."
      case "invalid":
        return "Le lien que vous avez utilisé est invalide."
      case "already-used":
        return "Ce lien a déjà été utilisé."
      default:
        return "Une erreur est survenue avec le lien que vous avez utilisé."
    }
  }

  const getActionText = () => {
    if (action === "email-change") {
      return "Retourner à mon profil"
    }

    switch (errorType) {
      case "expired":
      case "already-used":
        return "Demander un nouveau lien"
      case "invalid":
        return "Retourner à l'accueil"
      default:
        return "Retourner à l'accueil"
    }
  }

  const getActionLink = () => {
    if (action === "email-change") {
      return "/profile"
    }

    switch (errorType) {
      case "expired":
      case "already-used":
        return "/login"
      case "invalid":
        return "/"
      default:
        return "/"
    }
  }

  const getContextMessage = () => {
    if (action === "email-change") {
      return "La modification de votre adresse email a échoué. Veuillez réessayer depuis votre profil."
    }
    return "Les liens envoyés par email sont valables pendant 15 minutes pour des raisons de sécurité. Si votre lien a expiré, vous pouvez en demander un nouveau."
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-5 w-5" />
            <CardTitle className="text-destructive">Lien invalide ou expiré</CardTitle>
          </div>
          <CardDescription>{getErrorMessage()}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{getContextMessage()}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild>
            <Link to={getActionLink()}>{getActionText()}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
