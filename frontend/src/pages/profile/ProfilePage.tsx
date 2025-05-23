"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import ProfileForm from "./ProfileForm"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchWithBaseUrl } from "@/utils/fetchWithBaseUrl"

export default function ProfilePage() {
  const { refreshUser, user } = useAuth()
  const [searchParams] = useSearchParams();
  const emailChanged = searchParams.get('emailChanged');

  const [resetLinkSent, setResetLinkSent] = useState(false)
  const [createLinkSent, setCreateLinkSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
   const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const hasMagicLinkOnly = user ? !user.hasPassword : false

  useEffect(() => {
    if (emailChanged === "success") {
      setStatusMessage({
        text: "Votre adresse email a été modifiée avec succès.",
        type: "success",
      })
      window.history.replaceState(null, "", "/profile")
    }
  }, [emailChanged])

  const handleResetPassword = async () => {
    if (!user?.email) return

    try {
      setIsLoading(true)
      const res = await fetchWithBaseUrl("/emails/send-reinitialisation-password-link", {
        method: "PATCH",
        body: JSON.stringify({ email: user.email }),
      })

      if (!res.ok) throw new Error("Erreur d'envoi")

      setResetLinkSent(true)
    } catch (err) {
      console.error("Erreur lors de l'envoi du lien :", err)
      alert("Une erreur est survenue lors de l'envoi du lien de réinitialisation.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePassword = async () => {
    if (!user?.email) return

    try {
      setIsLoading(true)
      const res = await fetchWithBaseUrl("/emails/send-create-password-link", {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
      })

      if (!res.ok) throw new Error("Erreur d'envoi")

      setCreateLinkSent(true)

      // Lancer un polling toutes les 5s pendant 2 minutes max
      const interval = setInterval(async () => {
        await refreshUser()
        if (user?.hasPassword) {
          clearInterval(interval)
        }
      }, 5000)

      setTimeout(() => clearInterval(interval), 2 * 60 * 1000)
    } catch (err) {
      console.error("Erreur lors de l'envoi du lien :", err)
      alert("Une erreur est survenue lors de l'envoi du lien de création de mot de passe.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="container mx-auto py-6 sm:py-10 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Mon Profil</h1>

      {statusMessage && (
        <Alert
          className={`mb-4 ${statusMessage.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="flex items-center">
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            )}
                 <AlertDescription className={statusMessage.type === "success" ? "text-green-600" : "text-red-600"}>
              {statusMessage.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full max-w-3xl">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="profile" className="flex-1">
            Informations personnelles
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1">
            {hasMagicLinkOnly ? "Créer un mot de passe" : "Changer de mot de passe"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="password">
          {hasMagicLinkOnly ? (
            <Card>
              <CardHeader>
                 <CardTitle className="text-lg sm:text-xl">Créer un mot de passe</CardTitle>
                <CardDescription>
                  Ajoutez un mot de passe à votre compte pour vous connecter sans Magic Link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                  Actuellement, vous utilisez l'authentification par Magic Link. En créant un mot de passe, vous pourrez
                  également vous connecter avec votre email et mot de passe, tout en conservant la possibilité
                  d'utiliser les Magic Links.
                </p>

                  <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Un email sera envoyé à {user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Cliquez sur le lien dans l'email pour créer votre mot de passe
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center gap-2">
                {createLinkSent ? (
                  <p className="text-sm text-green-600 text-center sm:text-left">
                    ✅ Lien de création de mot de passe envoyé à <strong>{user?.email}</strong>
                  </p>
                ) : (
                  <Button onClick={handleCreatePassword} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? "Envoi en cours..." : "Recevoir un lien de création de mot de passe"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Changer de mot de passe</CardTitle>
                <CardDescription>Demandez un lien par email pour modifier votre mot de passe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-muted-foreground text-sm">
                  Pour des raisons de sécurité, la modification de mot de passe se fait uniquement par email. Cliquez
                  sur le bouton ci-dessous pour recevoir un lien de réinitialisation.
                </p>

                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Un email sera envoyé à {user?.email}</p>
                    <p className="text-xs text-muted-foreground">Vérifiez votre boîte de réception et vos spams</p>
                  </div>
                </div>
              </CardContent>
                <CardFooter className="flex flex-col sm:flex-row items-center gap-2">
                {resetLinkSent ? (
                <p className="text-sm text-green-600 text-center sm:text-left">
                    ✅ Lien de réinitialisation envoyé à <strong>{user?.email}</strong>
                  </p>
                ) : (


                  <Button onClick={handleResetPassword} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? "Envoi en cours..." : "Recevoir un lien de réinitialisation"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
