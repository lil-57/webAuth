"use client"

import { useRef, useState, useEffect } from "react"
import type ReCAPTCHA from "react-google-recaptcha"

// Détection mobile
const isMobile = () => {
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

export function useCaptcha(siteKey: string) {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [isV3, setIsV3] = useState(false)

  useEffect(() => {
    setIsV3(isMobile())
  }, [])

  const onChange = (token: string | null) => {
    setCaptchaToken(token)
    setIsCaptchaValid(!!token)
  }

  const onExpired = () => {
    setCaptchaToken(null)
    setIsCaptchaValid(false)
  }

  // Pour v3, on exécute le captcha automatiquement
  const executeV3 = async (action = "submit") => {
    if (isV3 && window.grecaptcha) {
      try {
        const token = await window.grecaptcha.execute(siteKey, { action })
        setCaptchaToken(token)
        setIsCaptchaValid(true)
        return token
      } catch (error) {
        console.error("Erreur reCAPTCHA v3:", error)
        setCaptchaToken(null)
        setIsCaptchaValid(false)
        return null
      }
    }
    return null
  }

  return {
    recaptchaRef,
    captchaToken,
    isCaptchaValid,
    setCaptchaToken,
    setIsCaptchaValid,
    onChange,
    onExpired,
    isV3,
    executeV3,
  }
}
