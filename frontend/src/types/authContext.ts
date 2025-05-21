import { UpdateProfileData } from "./updateProfile"
import { RegisterData } from "./register"
import { User } from "./user"

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, captchaToken: string) => Promise<void>
  register: (userData: RegisterData, captchaToken: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData, captchaToken: string) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>

  setUser: (user: User | null) => void
  setIsAuthenticated: (auth: boolean) => void
  refreshUser: () => Promise<User | null>
}