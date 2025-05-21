"use client"

import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { fetchWithBaseUrl } from "@/utils/fetchWithBaseUrl"

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
        await fetchWithBaseUrl("/auth/magic-login", {
          method: "POST",
          body: JSON.stringify({ token }),
        })


        const res = await fetchWithBaseUrl("/users/me")
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération de l'utilisateur")
        }
        const data = await res.json()
        setUser(data)
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
