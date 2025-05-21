"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import { getPasswordStrength } from "./getPasswordStrength"
import type { PropsPasswordFields } from "./PasswordInterface"

export default function PasswordFields({ values, onChange }: PropsPasswordFields) {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false)

  const strength = getPasswordStrength(values.newPassword)

  // Critères de validation du mot de passe
  const hasMinLength = values.newPassword.length >= 8
  const hasUpperCase = /[A-Z]/.test(values.newPassword)
  const hasLowerCase = /[a-z]/.test(values.newPassword)
  const hasNumber = /[0-9]/.test(values.newPassword)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(values.newPassword)

  // Afficher les critères dès que l'utilisateur commence à taper
  useEffect(() => {
    if (values.newPassword.length > 0) {
      setShowPasswordCriteria(true)
    }
  }, [values.newPassword])

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={values.newPassword}
            onChange={onChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center"
          >
            {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
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
        {values.newPassword && (
          <div className="h-2 mt-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded transition-all duration-300 ${strength <= 1
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

      {/* Champ confirmation */}
      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type={showConfirmNewPassword ? "text" : "password"}
            value={values.confirmNewPassword}
            onChange={onChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center"
          >
            {showConfirmNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Erreur confirmation */}
        {values.confirmNewPassword && (
          <div className="flex items-center gap-2 mt-1">
            {values.confirmNewPassword === values.newPassword ? (
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
