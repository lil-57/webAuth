import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Bienvenue sur notre application</CardTitle>
          <CardDescription>Une application sécurisée avec authentification complète</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Cette page d'accueil est volontairement laissée vide comme demandé. Utilisez la barre de navigation pour
            explorer l'application.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
