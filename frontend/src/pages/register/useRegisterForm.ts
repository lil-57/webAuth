"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useForm } from "@/hooks/use-form"
import { nameRegex } from "@/utils/regexNom"
import { emailRegex } from "@/utils/regexEmail"
import type { RegisterFormValues } from "./RegisterInterface"
import { useCaptcha } from "@/hooks/useCaptcha"
import Cookies from "js-cookie"
import { fetchWithBaseUrl } from "@/utils/fetchWithBaseUrl"

let currentCaptchaToken: string | null = null

export function useRegisterForm() {

  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [showErrors, setShowErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [emailExists, setEmailExists] = useState(false)
  const [isEmailChecking, setIsEmailChecking] = useState(false)

  const { values, handleChange, handleSubmit, isSubmitting } = useForm<RegisterFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (vals) => {
      const errors: Partial<Record<keyof RegisterFormValues, string>> = {}

      // Validation du prénom
      if (!vals.firstName.trim()) {
        errors.firstName = "Le prénom est requis"
      } else if (!nameRegex.test(vals.firstName)) {
        errors.firstName = "Format de prénom invalide"
      }

      // Validation du nom
      if (!vals.lastName.trim()) {
        errors.lastName = "Le nom est requis"
      } else if (!nameRegex.test(vals.lastName)) {
        errors.lastName = "Format de nom invalide"
      }

      // Validation de l'email
      if (!vals.email) {
        errors.email = "L'email est requis"
      } else if (!emailRegex.test(vals.email)) {
        errors.email = "Format d'email invalide"
      }

      // Validation du mot de passe
      if (!vals.password) {
        errors.password = "Le mot de passe est requis"
      } else if (vals.password.length < 8) {
        errors.password = "Au moins 8 caractères requis"
      } else if (!/[A-Z]/.test(vals.password)) {
        errors.password = "Au moins une majuscule requise"
      } else if (!/[a-z]/.test(vals.password)) {
        errors.password = "Au moins une minuscule requise"
      } else if (!/[0-9]/.test(vals.password)) {
        errors.password = "Au moins un chiffre requis"
      } else if (!/[^A-Za-z0-9]/.test(vals.password)) {
        errors.password = "Au moins un caractère spécial requis"
      }

      // Validation de la confirmation du mot de passe
      if (vals.password !== vals.confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas"
      }

      return errors
    },
    onSubmit: async (vals) => {
      if (!currentCaptchaToken) {
        setError("Veuillez valider le captcha")
      }
      await submitRegister(currentCaptchaToken)

    }
  })

  // Critères de validation du mot de passe
  const hasMinLength = values.password.length >= 8
  const hasUpperCase = /[A-Z]/.test(values.password)
  const hasLowerCase = /[a-z]/.test(values.password)
  const hasNumber = /[0-9]/.test(values.password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(values.password)
  const passwordCriteriaValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar

  const isValid = {
    firstNameValid: values.firstName.trim() !== "",
    firstNameFormatValid: nameRegex.test(values.firstName),
    lastNameValid: values.lastName.trim() !== "",
    lastNameFormatValid: nameRegex.test(values.lastName),
    emailValid: emailRegex.test(values.email),
    passwordValid: passwordCriteriaValid,
    confirmPasswordValid: values.password === values.confirmPassword && values.confirmPassword !== "",
  }

  const isFormValid =
    isValid.firstNameValid &&
    isValid.firstNameFormatValid &&
    isValid.lastNameValid &&
    isValid.lastNameFormatValid &&
    isValid.emailValid &&
    !emailExists &&
    isValid.passwordValid &&
    isValid.confirmPasswordValid

  // Debounce pour le prénom
  useEffect(() => {
    if (!values.firstName) return
    const h = setTimeout(() => setShowErrors((s) => ({ ...s, firstName: true })), 1000)
    return () => clearTimeout(h)
  }, [values.firstName])

  // Debounce pour le nom
  useEffect(() => {
    if (!values.lastName) return
    const h = setTimeout(() => setShowErrors((s) => ({ ...s, lastName: true })), 1000)
    return () => clearTimeout(h)
  }, [values.lastName])

  // Debounce pour l'email avec vérification d'existence
  useEffect(() => {
    //Réinitialiser l'état d'erreur de l'email
    setShowErrors((s) => ({ ...s, email: false }))
    setEmailExists(false)
    setIsEmailChecking(false)
    
    if (!values.email) return //si le champ est vide, on quitte la fonction

    setIsEmailChecking(true) //on indique que la vérification est en cours

    //lancement de la vérification après un délai
    const h = setTimeout(async () => {

      //si la saisie reprend avant la fin du délai, on relance ce bloc

      setShowErrors((s) => ({ ...s, email: true })) //Affiche l'erreur 

      //si l'email est valide, on lance la vérification côté serveur
      if (emailRegex.test(values.email)) {
        try {
      
          const res = await fetchWithBaseUrl(`/users/check-email?email=${encodeURIComponent(values.email)}`) //appel à l'API pour vérifier si l'email existe déjà
          if (res.ok) {
            const { exists } = await res.json()
            setEmailExists(exists)
          }
        } catch (err) {
          console.error("Erreur de vérification email:", err)
        } finally {
          setIsEmailChecking(false)//fin de la vérification
        }
      } else {
        //si l'email n'est pas valide, on ne lance pas de requête
        setIsEmailChecking(false)
      }
    }, 1000)

    // Nettoyage de l'effet pour éviter les fuites de mémoire
    return () => {
      clearTimeout(h)
      setIsEmailChecking(false)
    }
  }, [values.email])


  // Debounce pour le mot de passe
  useEffect(() => {
    if (!values.password) return
    const h = setTimeout(() => setShowErrors((s) => ({ ...s, password: true })), 1000)
    return () => clearTimeout(h)
  }, [values.password])

  // Debounce pour la confirmation du mot de passe
  useEffect(() => {
    if (!values.confirmPassword) return
    const h = setTimeout(() => setShowErrors((s) => ({ ...s, confirmPassword: true })), 500)
    return () => clearTimeout(h)
  }, [values.confirmPassword])

  const [captchaResetKey, setCaptchaResetKey] = useState(0)

  const {
    setCaptchaToken,
    setIsCaptchaValid,
  } = useCaptcha("6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B")

  const submitRegister = async (captchaToken: string | null) => {
    if (!captchaToken) {
      setError("Captcha invalide. Veuillez réessayer.")
      setCaptchaResetKey((prev) => prev + 1)
      setCaptchaToken(null)
      setIsCaptchaValid(false)
      return
    }

    try {
      const { confirmPassword, ...userData } = values
      await register(userData, captchaToken)
      Cookies.remove("blockedEmail")
      Cookies.remove("blockedUntil")
      navigate("/profile")
    } catch (err: any) {
      console.error("Erreur réelle :", err)

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Une erreur est survenue lors de l'inscription"

      setError(message)
      setCaptchaResetKey((prev) => prev + 1)
      setCaptchaToken(null)
      setIsCaptchaValid(false)
    }
  }

  return {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
    isFormValid,
    showErrors,
    validationStatus: {
      ...isValid,
      emailExists,
    },
    isEmailChecking,
    submitRegister,
    captchaResetKey
  }
}
