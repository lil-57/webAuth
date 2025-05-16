export interface PasswordFormValues {
  newPassword: string
  confirmNewPassword: string
}

export interface PropsPasswordFields {
  values: PasswordFormValues
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  validationStatus: {
    newPasswordValid: boolean
    confirmNewPasswordValid: boolean
  }
}
