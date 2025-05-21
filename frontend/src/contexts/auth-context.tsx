"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

import { User } from "@/types/user"
import { AuthContextType } from "@/types/authContext"
import { RegisterData } from "@/types/register"
import { UpdateProfileData } from "@/types/updateProfile"
import { AuthProviderProps } from "@/types/authProvider"
import { fetchWithBaseUrl } from "@/utils/fetchWithBaseUrl"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetchWithBaseUrl("/users/me", {
        })

        if (!response.ok) {
          throw new Error("Non authentifié")
        }

        const userData = await response.json()
        setUser(userData)
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
      const loginResponse = await fetchWithBaseUrl("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, captchaToken }),
      })

      if (!loginResponse.ok) {
        throw loginResponse;
      }


      const userResponse = await fetchWithBaseUrl("/users/me")

      if (!userResponse.ok) {
        throw new Error("Impossible de récupérer les informations utilisateur")
      }

      const userData = await userResponse.json()
      setUser(userData)
      setIsAuthenticated(true)

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      })
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
      })
      throw error
    }
  }

  const register = async (userData: RegisterData, captchaToken: string) => {
    try {
      const registerResponse = await fetchWithBaseUrl("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...userData, captchaToken }),
      })

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json()
        throw new Error(errorData.message || "Erreur d'inscription")
      }

      const userResponse = await fetchWithBaseUrl("/users/me")

      if (!userResponse.ok) {
        throw new Error("Impossible de récupérer les informations utilisateur")
      }

      const userInfo = await userResponse.json()
      setUser(userInfo)
      setIsAuthenticated(true)

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      })
    } catch (error: any) {
      console.error("Register error:", error)
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Impossible de créer votre compte",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetchWithBaseUrl("/auth/logout", {
        method: "POST",
      })
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
      const response = await fetchWithBaseUrl("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ ...data, captchaToken }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur de mise à jour du profil")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)

      toast({
        title: "Profil mis à jour",
        description: "Votre profil a été mis à jour avec succès",
      })

      return updatedUser
    } catch (error: any) {
      console.error("Update profile error:", error)
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: error.message || "Impossible de mettre à jour votre profil",
      })
      throw error
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await fetchWithBaseUrl("/users/me/password", {
        method: "PATCH",
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur de modification du mot de passe")
      }

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès",
      })
    } catch (error: any) {
      console.error("Change password error:", error)
      toast({
        variant: "destructive",
        title: "Erreur de modification",
        description: error.message || "Impossible de modifier votre mot de passe",
      })
      throw error
    }
  }

  const refreshUser = async (): Promise<User | null> => {
    try {
      const response = await fetchWithBaseUrl("/users/me")

      if (!response.ok) {
        throw new Error("Impossible de récupérer les informations utilisateur")
      }

      const userData = await response.json()
      setUser(userData)
      return userData
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
