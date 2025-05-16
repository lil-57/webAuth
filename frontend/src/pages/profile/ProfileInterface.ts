import type React from "react"
export interface PropsProfile {
  values: {
    firstName: string
    lastName: string
    email: string
  }
  errors: Partial<Record<"firstName" | "lastName" | "email", string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isEditing: boolean
  isEmailChecking: boolean
  emailExists: boolean
  showErrors: {
    firstName: boolean
    lastName: boolean
    email: boolean
  }
  validationStatus: {
    firstNameValid: boolean
    firstNameFormatValid: boolean
    lastNameValid: boolean
    lastNameFormatValid: boolean
    emailValid: boolean
    emailExists: boolean
  }
}
