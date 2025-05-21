"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useForm } from "@/hooks/use-form"
import { emailRegex } from "@/utils/regexEmail"
import { nameRegex } from "@/utils/regexNom"
import { useCaptcha } from "@/hooks/useCaptcha"
import { fetchWithBaseUrl } from "@/utils/fetchWithBaseUrl"

let currentCaptchaToken: string | null = null

interface ProfileFormValues {
  firstName: string
  lastName: string
  email: string
}

export default function useProfileForm() {
  const { user, updateProfile, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [showEmailWarning, setShowEmailWarning] = useState(false)
  const [isEmailChanged, setIsEmailChanged] = useState(false)
  const [originalEmail, setOriginalEmail] = useState(user?.email || "")
  const [isEmailChecking, setIsEmailChecking] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [showErrors, setShowErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
  })

  const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm<ProfileFormValues>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
    validate: (vals) => {
      const errors: Partial<Record<keyof ProfileFormValues, string>> = {}

      if (!vals.firstName.trim()) {
        errors.firstName = "Le prénom est requis"
      } else if (!nameRegex.test(vals.firstName)) {
        errors.firstName = "Format de prénom invalide"
      }

      if (!vals.lastName.trim()) {
        errors.lastName = "Le nom est requis"
      } else if (!nameRegex.test(vals.lastName)) {
        errors.lastName = "Format de nom invalide"
      }

      if (!vals.email.trim()) {
        errors.email = "L'email est requis"
      } else if (!emailRegex.test(vals.email)) {
        errors.email = "Format d'email invalide"
      }

      return errors
    },
    onSubmit: async (vals) => {

      if (!currentCaptchaToken) {
        throw new Error("Captcha token is missing")
      }
      await submitProfileValidation(currentCaptchaToken)

      if (!isEditing) return

      if (!vals.firstName.trim() || !vals.lastName.trim()) {
        setProfileError("Le prénom et le nom sont requis pour modifier votre profil.")
        return
      }

      if (vals.email !== originalEmail) {
        setIsEmailChanged(true)
        setShowEmailWarning(true)
        return
      }

      try {
        await updateProfile(vals, currentCaptchaToken)
        setProfileSuccess("Profil mis à jour avec succès")
        setProfileError(null)
        setIsEditing(false)
      } catch (err) {
        setProfileError("Une erreur est survenue lors de la mise à jour du profil")
        setProfileSuccess(null)
      }
    },
  })

  useEffect(() => {
    if (!isEditing || !values.firstName) return
    const h = setTimeout(() => setShowErrors((s) => ({ ...s, firstName: true })), 1000)
    return () => clearTimeout(h)
  }, [values.firstName, isEditing])

  useEffect(() => {
    if (!isEditing || !values.lastName) return
    const h = setTimeout(() => setShowErrors((s) => ({ ...s, lastName: true })), 1000)
    return () => clearTimeout(h)
  }, [values.lastName, isEditing])

  useEffect(() => {
    if (!isEditing || !values.email || values.email === originalEmail) return

    setShowErrors((s) => ({ ...s, email: false }))
    setEmailExists(false)
    setIsEmailChecking(true)

    const h = setTimeout(async () => {
      setShowErrors((s) => ({ ...s, email: true }))

      if (emailRegex.test(values.email)) {
        try {
          const res = await fetchWithBaseUrl(`/users/check-email?email=${encodeURIComponent(values.email)}`)
          if (res.ok) {
            const { exists } = await res.json()
            setEmailExists(exists && values.email !== originalEmail)
          }
        } catch (err) {
          console.error("Erreur de vérification email:", err)
        } finally {
          setIsEmailChecking(false)
        }
      } else {
        setIsEmailChecking(false)
      }
    }, 1000)

    return () => {
      clearTimeout(h)
      setIsEmailChecking(false)
    }
  }, [values.email, isEditing, originalEmail])

  const handleEditToggle = () => {
    if (isEditing) {
      setValues({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
      })
      setIsEditing(false)
      setShowEmailWarning(false)
      setIsEmailChanged(false)
    } else {
      setIsEditing(true)
      setProfileError(null)
      setProfileSuccess(null)
      setOriginalEmail(user?.email || "")
    }
  }

  const confirmEmailChange = async () => {
    try {
      await fetchWithBaseUrl("/emails/confirm-email-change", {
        method: "POST",
        body: JSON.stringify({ oldEmail: originalEmail, newEmail: values.email }),
      })

      setProfileSuccess(
        "Un email de confirmation a été envoyé à votre nouvelle adresse. Vous avez 15 minutes pour confirmer ce changement.",
      )
      setProfileError(null)
      setIsEditing(false)
      setShowEmailWarning(false)
      setIsEmailChanged(false)

      setTimeout(async () => {
        try {
          const updatedUser = await refreshUser()
          if (updatedUser && updatedUser.email === originalEmail) {
            setProfileError("Le changement d'email n'a pas été confirmé. Votre ancienne adresse a été conservée.")
          }
        } catch (err) {
          console.error("Erreur lors de la vérification de confirmation d'email:", err)
        }
      }, 15 * 60 * 1000)
    } catch (err) {
      setProfileError("Une erreur est survenue lors de l'envoi de l'email de confirmation")
      setProfileSuccess(null)
    }
  }

const cancelEmailChange = async () => {
  
  const refreshed = await refreshUser()
  if (refreshed) {
    setValues({
      firstName: refreshed.firstName,
      lastName: refreshed.lastName,
      email: refreshed.email,
    })
    setOriginalEmail(refreshed.email)
  }

  // Réinitialiser les états liés à la tentative de changement d’email
  setShowEmailWarning(false)
  setIsEmailChanged(false)
}



  const [captchaResetKey, setCaptchaResetKey] = useState(0)

  const {
    recaptchaRef,
    setCaptchaToken,
    setIsCaptchaValid,
  } = useCaptcha("6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B")

  const submitProfileValidation = async (captchaToken: string) => {
    currentCaptchaToken = captchaToken

    if (!isEditing) return

    if (!values.firstName.trim() || !values.lastName.trim()) {
      setProfileError("Le prénom et le nom sont requis pour modifier votre profil.")
      return
    }

    if (values.email !== originalEmail) {
      setIsEmailChanged(true)
      setShowEmailWarning(true)
      return
    }

    try {
      await updateProfile(values, captchaToken)
      setProfileSuccess("Profil mis à jour avec succès")
      setProfileError(null)
      setIsEditing(false)
    } catch (error: any) {
      if (error.response?.data?.message) {
  console.log("Détail de l'erreur backend :", error.response.data.message)
}

      console.error("Erreur de mise à jour du profil:", error.response?.data || error.message || error)
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
      setIsCaptchaValid(false)
      setCaptchaResetKey((prev) => prev + 1)
      setProfileError("Impossible de mettre à jour votre profil")
      setProfileSuccess(null)
    }
  }

  return {
    user,
    values,
    errors,
    isEditing,
    isSubmitting,
    profileSuccess,
    profileError,
    showEmailWarning,
    isEmailChanged,
    isEmailChecking,
    emailExists,
    showErrors,
    validationStatus: {
      firstNameValid: Boolean(values.firstName),
      firstNameFormatValid: nameRegex.test(values.firstName),
      lastNameValid: Boolean(values.lastName),
      lastNameFormatValid: nameRegex.test(values.lastName),
      emailValid: emailRegex.test(values.email),
      emailExists,
    },
    handleChange,
    handleEditToggle,
    handleSubmit,
    confirmEmailChange,
    cancelEmailChange,
    submitProfileValidation,
    captchaResetKey,
  }
}
