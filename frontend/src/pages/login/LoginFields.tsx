"use client"

import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PropsLogin } from "./LoginInterface"

export default function LoginFields({
  values,
  handleChange,
  showPassword,
  togglePassword,
  showEmailError,
  showPasswordError,
  emailValid,
  passwordValid,
}: PropsLogin) {
  return (
    <>
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
        {!showEmailError && values.email && <p className="text-sm text-muted-foreground">Vérification en cours...</p>}
        {showEmailError && !emailValid && (
          <p className="text-sm text-destructive">{values.email ? "Format d'email invalide" : "L'email est requis"}</p>
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
            onChange={handleChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {!showPasswordError && values.password && (
          <p className="text-sm text-muted-foreground">Vérification en cours...</p>
        )}
        {showPasswordError && !passwordValid && (
          <p className="text-sm text-destructive">
            {values.password ? "Au moins 8 caractères requis" : "Le mot de passe est requis"}
          </p>
        )}
      </div>
    </>
  )
}
