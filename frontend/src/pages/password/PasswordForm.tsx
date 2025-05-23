import { usePasswordForm } from "./usePasswordForm"
import PasswordFields from "./PasswordFields"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

export default function PasswordForm() {
  const {
    values,
    error,
    handleChange,
    handleSubmit,
    isSubmitting,
    success,
    validationStatus,
    isFormValid,
    isCreateMode,
  } = usePasswordForm()

  
  const { refreshUser } = useAuth()

  // Rafraîchir l'utilisateur après succès pour mettre à jour le profil sans reload
  useEffect(() => {
    if (success) {
      refreshUser()
    }
  }, [success, refreshUser])

  if (success) {
    return (
      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
        <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
        <p className="text-green-700 font-medium">
          {isCreateMode ? "Mot de passe créé avec succès ✅" : "Mot de passe modifié avec succès ✅"}
        </p>
        <p className="text-green-600 text-sm mt-1">Redirection vers le site...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
         <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {isCreateMode ? "Créer votre mot de passe" : "Réinitialiser votre mot de passe"}
        </h2>

         <PasswordFields values={values} onChange={handleChange} validationStatus={validationStatus} />

        <Button type="submit" className="w-full" disabled={isSubmitting || !isFormValid}>
          {isSubmitting
            ? isCreateMode
              ? "Création en cours..."
              : "Réinitialisation en cours..."
            : isCreateMode
              ? "Créer mon mot de passe"
              : "Réinitialiser mon mot de passe"}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  )
}
