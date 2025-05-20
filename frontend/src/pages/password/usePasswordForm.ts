"use client"

import { useState } from "react"
import { useForm } from "@/hooks/use-form"
import { useSearchParams } from "react-router-dom"
import type { PasswordFormValues } from "./PasswordInterface"
import { useNavigate } from "react-router-dom"

export function usePasswordForm() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get("mode") || "reset"
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const isCreateMode = mode === "create"

  const { values, handleChange, handleSubmit, isSubmitting } = useForm<PasswordFormValues>({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validate: (vals) => {
      const errors: Partial<Record<keyof PasswordFormValues, string>> = {}
      const password = vals.newPassword

      if (!password) {
        errors.newPassword = "Mot de passe requis"
      } else if (password.length < 8) {
        errors.newPassword = "Au moins 8 caractères requis"
      } else if (!/[A-Z]/.test(password)) {
        errors.newPassword = "Au moins une majuscule requise"
      } else if (!/[a-z]/.test(password)) {
        errors.newPassword = "Au moins une minuscule requise"
      } else if (!/[0-9]/.test(password)) {
        errors.newPassword = "Au moins un chiffre requis"
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        errors.newPassword = "Au moins un caractère spécial requis"
      }

      if (vals.confirmNewPassword !== vals.newPassword) {
        errors.confirmNewPassword = "Les mots de passe ne correspondent pas"
      }

      return errors
    },

    onSubmit: async (vals) => {
      setError("")

      try {
        const endpoint = isCreateMode ? "create-password" : "reset-password"

        const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newPassword: vals.newPassword }),
        })

        if (!res.ok) {
          const data = await res.json()
          if (data.message === "same_password") {
            setError("Le nouveau mot de passe ne peut pas être identique à l'ancien.")
            return
          }
          throw new Error(data.message || "Erreur inconnue")
        }

        setSuccess(true)
        setTimeout(() => navigate("/"), 2000)
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue")
      }
    },
  })

  const newPasswordValid = 
    values.newPassword.length >= 8 &&
    /[A-Z]/.test(values.newPassword) &&
    /[a-z]/.test(values.newPassword) &&
    /[0-9]/.test(values.newPassword) &&
    /[^A-Za-z0-9]/.test(values.newPassword)

  const confirmNewPasswordValid = values.confirmNewPassword === values.newPassword && values.confirmNewPassword !== ""

  return {
    values,
    error,
    handleChange,
    handleSubmit,
    isSubmitting,
    success,
    validationStatus: {
      newPasswordValid,
      confirmNewPasswordValid,
    },
    isFormValid: newPasswordValid && confirmNewPasswordValid,
    isCreateMode,
  }
}