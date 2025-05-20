"use client"

import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/utils/api"

export default function MagicRedirectPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      navigate("/login")
      return
    }

    const handleMagicLogin = async () => {
      try {
        // Appel à l'API pour valider et consommer le token
        await api.post("/auth/magic-login", { token })

        const res = await api.get("/users/me")
        setUser(res.data)
        setIsAuthenticated(true)

        navigate("/")
      } catch (err) {
        console.error("Erreur de connexion via Magic Link :", err)
        navigate("/login")
      }
    }

    handleMagicLogin()
  }, [searchParams, navigate, setUser, setIsAuthenticated])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground text-sm">Connexion en cours...</p>
    </div>
  )
}
