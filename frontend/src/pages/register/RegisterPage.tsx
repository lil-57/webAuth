"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import RegisterForm from "./RegisterForm"
import MagicLinkForm from "@/pages/magic-link/MagicLinkForm"
import MagicLinkNotice from "@/pages/magic-link/MagicLinkNotice"
import { useMagicLinkForm } from "@/pages/magic-link/useMagicLinkForm"

export default function RegisterPage() {
  const { magicLinkSent } = useMagicLinkForm("register")

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>Créez un compte pour accéder à toutes les fonctionnalités</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="password">Avec mot de passe</TabsTrigger>
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <RegisterForm />
            </TabsContent>

            <TabsContent value="magic-link">
              {magicLinkSent ? <MagicLinkNotice context="register" /> : <MagicLinkForm context="register" />}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
