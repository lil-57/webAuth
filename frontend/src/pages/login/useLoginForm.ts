"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { emailRegex } from "@/utils/regexEmail"
import { useForm } from "@/hooks/use-form"
import Cookies from "js-cookie"
import type { LoginFormValues } from "./LoginInterface"
import { useCaptcha } from "@/hooks/useCaptcha"



let currentCaptchaToken: string | null = null

export function useLoginForm() {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [accountLocked, setAccountLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)
  const [lockTimer, setLockTimer] = useState<NodeJS.Timeout | null>(null)

  const [showEmailError, setShowEmailError] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)

  const [isEmailChecking, setIsEmailChecking] = useState(false)
  const [isPasswordChecking, setIsPasswordChecking] = useState(false)

  const { values, handleChange, handleSubmit, isSubmitting } = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: () => ({}),
    onSubmit: async (vals) => {
      if (!currentCaptchaToken) {
        throw new Error("Captcha token is missing")
      }
      await submitLogin(currentCaptchaToken)
    },
  })



  const startLockTimer = (seconds: number) => {
    setLockTimeRemaining(seconds)
    if (lockTimer) clearInterval(lockTimer)

    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setAccountLocked(false)
          setError(null)
          Cookies.remove("blockedEmail")
          Cookies.remove("blockedUntil")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setLockTimer(timer)
  }


useEffect(() => {
  if (!values.email) {
    setAccountLocked(false);
    setError(null);
    return;
  }

  const blockedEmail = Cookies.get("blockedEmail");
  const blockedUntil = Cookies.get("blockedUntil");
  const now = Date.now();

  // ⏳ Si l'email est bloqué ET le blocage est encore actif
  if (blockedEmail === values.email && blockedUntil && now < Number(blockedUntil)) {
    const remaining = Math.floor((Number(blockedUntil) - now) / 1000);
    setAccountLocked(true);
    setError("Compte temporairement bloqué");
    startLockTimer(remaining);
  }
  // ✅ Si email différent mais cookies encore valides, on NE les supprime PAS
  else if (values.email !== blockedEmail) {
    // juste masquer l’état visuellement sans supprimer les cookies
    setAccountLocked(false);
    setError(null);
  }
  // 🧼 Si le blocage est expiré, on nettoie
  else if (blockedUntil && now >= Number(blockedUntil)) {
    setAccountLocked(false);
    setError(null);
    Cookies.remove("blockedEmail");
    Cookies.remove("blockedUntil");
  }
}, [values.email]);


  useEffect(() => {
    return () => {
      if (lockTimer) clearInterval(lockTimer)
    }
  }, [lockTimer])

  const emailValid = emailRegex.test(values.email)
  const passwordValid = values.password.length >= 8


  // Vérification de l'email
  useEffect(() => {
    setShowEmailError(false)
    if (!values.email) return

    setIsEmailChecking(true)
    const timeout = setTimeout(() => {
      setIsEmailChecking(false)
      setShowEmailError(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
      setIsEmailChecking(false)
    }
  }, [values.email])

  // Vérification du mot de passe
  useEffect(() => {
    setShowPasswordError(false)
    if (!values.password) return

    setIsPasswordChecking(true)
    const timeout = setTimeout(() => {
      setIsPasswordChecking(false)
      setShowPasswordError(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
      setIsPasswordChecking(false)
    }
  }, [values.password])

  const togglePassword = () => setShowPassword((prev) => !prev)


  const formatRemainingTime = () => {
    const minutes = Math.floor(lockTimeRemaining / 60)
    const seconds = lockTimeRemaining % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }


  const [captchaResetKey, setCaptchaResetKey] = useState(0)

  const {
    recaptchaRef,
    setCaptchaToken,
    setIsCaptchaValid,
  } = useCaptcha("6LepeDsrAAAAADh7dus3QTC8qmiPfFkZ3oTFPz_B")

  const submitLogin = async (captchaToken: string) => {
    currentCaptchaToken = captchaToken

    try {
      await login(values.email, values.password, captchaToken)
      Cookies.remove("blockedEmail")
      Cookies.remove("blockedUntil")
      navigate("/")
    } catch (error: any) {
      let errorMessage = "Email ou mot de passe incorrect"

      if (error instanceof Response) {
        const errorData = await error.json().catch(() => null)
        if (errorData?.message) {
          errorMessage = errorData.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setError(errorMessage)

      // Réinitialiser le captcha
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
      setIsCaptchaValid(false)
      setCaptchaResetKey((prev) => prev + 1) //force le remount


      if (errorMessage.includes("Compte bloqué")) {
        setAccountLocked(true)

        const minutesMatch = errorMessage.match(/(\d+) minute/)
        if (minutesMatch) {
          const minutes = parseInt(minutesMatch[1])
          const until = Date.now() + minutes * 60 * 1000

          setLockTimeRemaining(minutes * 60)
          Cookies.set("blockedEmail", values.email, { expires: 1 })
          Cookies.set("blockedUntil", until.toString(), { expires: 1 })

          startLockTimer(minutes * 60)
        }
      }
    }
  }


  return {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
    showPassword,
    togglePassword,
    showEmailError,
    showPasswordError,
    emailValid,
    passwordValid,
    isEmailChecking,
    isPasswordChecking,
    accountLocked,
    lockTimeRemaining,
    formatRemainingTime,
    submitLogin,
    captchaResetKey
  }
}
