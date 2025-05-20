import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"

export function useCaptcha(siteKey: string) {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)

  const onChange = (token: string | null) => {
    setCaptchaToken(token)
    setIsCaptchaValid(!!token)
  }

  const onExpired = () => {
    setCaptchaToken(null)
    setIsCaptchaValid(false)
  }

return {
  recaptchaRef,
  captchaToken,
  isCaptchaValid,
  setCaptchaToken,     
  setIsCaptchaValid,  
  onChange,
  onExpired,
}
}
