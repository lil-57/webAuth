"use client"

import { useSearchParams } from "react-router-dom"
import LoginForm from "./LoginForm"
import MagicLinkForm from "../magic-link/MagicLinkForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { useState } from "react"




export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const emailChanged = searchParams.get("emailChanged") === "success"
  const [tab, setTab] = useState("password")

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>Accédez à votre espace personnel</CardDescription>
        </CardHeader>

        <CardContent>
          {emailChanged && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Votre adresse email a bien été modifiée ✅
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={tab} onValueChange={setTab} className="w-full">


            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="password">Mot de passe</TabsTrigger>
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <LoginForm />
            </TabsContent>

            <TabsContent value="magic-link">
              <MagicLinkForm context="login" />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </CardFooter>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Mot de passe oublié ?{" "}
            <button
              type="button"
              onClick={() => setTab("magic-link")}
              className="text-primary hover:underline ml-1"
            >
              Connectez-vous via Magic Link
            </button>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}
