import type React from "react"
export interface RegisterFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface PropsRegister {
  values: RegisterFormValues
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showErrors: {
    firstName: boolean
    lastName: boolean
    email: boolean
    password: boolean
    confirmPassword: boolean
  }
  validationStatus: {
    firstNameValid: boolean
    firstNameFormatValid: boolean
    lastNameValid: boolean
    lastNameFormatValid: boolean
    emailValid: boolean
    emailExists: boolean
    passwordValid: boolean
    confirmPasswordValid: boolean
  }
  isEmailChecking: boolean
}
