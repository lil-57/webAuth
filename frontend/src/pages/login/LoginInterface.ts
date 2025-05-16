import type React from "react"
export interface LoginFormValues {
  email: string
  password: string
}

export interface PropsLogin {
  values: LoginFormValues
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showPassword: boolean
  togglePassword: () => void
  showEmailError: boolean
  showPasswordError: boolean
  emailValid: boolean
  passwordValid: boolean
}
