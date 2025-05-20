"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/utils/api"


interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  password?: string | null
  hasPassword: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface UpdateProfileData {
  firstName?: string
  lastName?: string
  email?: string
}

interface AuthContextType {
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

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/users/me")
        setUser(response.data)
        setIsAuthenticated(true)
      } catch (error) {
        console.log("User not authenticated")
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string, captchaToken: string) => {
    try {
      await api.post("/auth/login", { email, password, captchaToken })
      const response = await api.get("/users/me")
      setUser(response.data)
      setIsAuthenticated(true)
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
      })
      throw error
    }
  }

  const register = async (userData: RegisterData, captchaToken: string) => {
    try {
      await api.post("/auth/register", { ...userData, captchaToken })
      const response = await api.get("/users/me")
      setUser(response.data)
      setIsAuthenticated(true)
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      })
    } catch (error) {
      console.error("Register error:", error)
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Impossible de créer votre compte",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
      setUser(null)
      setIsAuthenticated(false)
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
      })
    }
  }

const updateProfile = async (data: UpdateProfileData, captchaToken: string) => {
  try {
    const response = await api.patch("/users/me", { ...data, captchaToken })
    setUser(response.data)
    toast({ title: "Profil mis à jour", description: "Votre profil a été mis à jour avec succès" })
  } catch (error) {
    console.error("Update profile error:", error)
    toast({
      variant: "destructive",
      title: "Erreur de mise à jour",
      description: "Impossible de mettre à jour votre profil",
    })
    throw error
  }
}


  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await api.patch("/users/me/password", { oldPassword, newPassword })
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès",
      })
    } catch (error) {
      console.error("Change password error:", error)
      toast({
        variant: "destructive",
        title: "Erreur de modification",
        description: "Impossible de modifier votre mot de passe",
      })
      throw error
    }
  }



const refreshUser = async (): Promise<User | null> => {
  try {
    const response = await api.get("/users/me")
    setUser(response.data)
    return response.data
  } catch (error) {
    console.error("Erreur lors du rafraîchissement de l'utilisateur :", error)
    return null
  }
}


  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    setUser,
    setIsAuthenticated,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
