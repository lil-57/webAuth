"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import { getPasswordStrength } from "../password/getPasswordStrength"
import type { PropsRegister } from "./RegisterInterface"

export default function RegisterFields({
  values,
  onChange,
  showErrors,
  validationStatus,
  isEmailChecking,
}: PropsRegister) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false)

  const strength = getPasswordStrength(values.password)

  // Critères de validation du mot de passe
  const hasMinLength = values.password.length >= 8
  const hasUpperCase = /[A-Z]/.test(values.password)
  const hasLowerCase = /[a-z]/.test(values.password)
  const hasNumber = /[0-9]/.test(values.password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(values.password)

  // Afficher les critères dès que l'utilisateur commence à taper
  useEffect(() => {
    if (values.password.length > 0) {
      setShowPasswordCriteria(true)
    }
  }, [values.password])

  return (
    <>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" placeholder="Prénom" value={values.firstName} onChange={onChange} />
          {!showErrors.firstName && values.firstName && (
            <p className="text-sm text-muted-foreground">Vérification en cours...</p>
          )}
          {showErrors.firstName && !validationStatus.firstNameValid && (
            <p className="text-sm text-destructive">Le prénom est requis</p>
          )}
          {showErrors.firstName && !validationStatus.firstNameFormatValid && (
            <p className="text-sm text-destructive">Le format du prénom est invalide</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" placeholder="Nom" value={values.lastName} onChange={onChange} />
          {!showErrors.lastName && values.lastName && (
            <p className="text-sm text-muted-foreground">Vérification en cours...</p>
          )}
          {showErrors.lastName && !validationStatus.lastNameValid && (
            <p className="text-sm text-destructive">Le nom est requis</p>
          )}
          {showErrors.lastName && !validationStatus.lastNameFormatValid && (
            <p className="text-sm text-destructive">Le format du nom est invalide</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="exemple@email.com"
          value={values.email}
          onChange={onChange}
        />
        {isEmailChecking && <p className="text-sm text-muted-foreground">Vérification en cours...</p>}
        {showErrors.email && !validationStatus.emailValid && (
          <p className="text-sm text-destructive">Le format est invalide</p>
        )}
        {showErrors.email && validationStatus.emailValid && validationStatus.emailExists && (
          <p className="text-sm text-destructive">L'email est déjà utilisé</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Votre mot de passe"
            value={values.password}
            onChange={onChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Critères de mot de passe */}
        {showPasswordCriteria && (
          <div className="mt-2 space-y-1 text-sm">
            <p className="font-medium text-muted-foreground mb-1">Votre mot de passe doit contenir :</p>
            <div className="flex items-center gap-2">
              {hasMinLength ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
              <span className={hasMinLength ? "text-green-600" : "text-muted-foreground"}>Au moins 8 caractères</span>
            </div>
            <div className="flex items-center gap-2">
              {hasUpperCase ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
              <span className={hasUpperCase ? "text-green-600" : "text-muted-foreground"}>Au moins une majuscule</span>
            </div>
            <div className="flex items-center gap-2">
              {hasLowerCase ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
              <span className={hasLowerCase ? "text-green-600" : "text-muted-foreground"}>Au moins une minuscule</span>
            </div>
            <div className="flex items-center gap-2">
              {hasNumber ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
              <span className={hasNumber ? "text-green-600" : "text-muted-foreground"}>Au moins un chiffre</span>
            </div>
            <div className="flex items-center gap-2">
              {hasSpecialChar ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <X size={16} className="text-red-500" />
              )}
              <span className={hasSpecialChar ? "text-green-600" : "text-muted-foreground"}>
                Au moins un caractère spécial
              </span>
            </div>
          </div>
        )}

        {/* Barre de force */}
        {values.password && (
          <div className="h-2 mt-2 bg-gray-200 rounded">
            <div
               className={`h-2 rounded transition-all duration-300 ${
                strength <= 1
                  ? "w-1/5 bg-red-500"
                  : strength === 2
                    ? "w-2/5 bg-orange-500"
                    : strength === 3
                      ? "w-3/5 bg-yellow-500"
                      : strength === 4
                        ? "w-4/5 bg-green-500"
                        : "w-full bg-emerald-600"
                }`}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmez votre mot de passe"
            value={values.confirmPassword}
            onChange={onChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Confirmation du mot de passe */}
        {values.confirmPassword && (
          <div className="flex items-center gap-2 mt-1">
            {values.confirmPassword === values.password ? (
              <>
                <Check size={16} className="text-green-500" />
                <span className="text-green-600 text-sm">Les mots de passe correspondent</span>
              </>
            ) : (
              <>
                <X size={16} className="text-red-500" />
                <span className="text-red-500 text-sm">Les mots de passe ne correspondent pas</span>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
