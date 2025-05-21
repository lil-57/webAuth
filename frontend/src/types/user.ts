export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  password?: string | null
  hasPassword: boolean
}