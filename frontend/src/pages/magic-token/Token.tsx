"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { fetchWithBaseUrl } from "@/utils/fetchWithBaseUrl"

export default function MagicRedirectPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser, setIsAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get("token")

    const handleMagicLogin = async () => {
      if (!token) {
        setIsLoading(false)
        return navigate("/error-link?type=invalid")
      }

      try {
        const res = await fetchWithBaseUrl("/auth/magic-login", {
          method: "POST",
          body: JSON.stringify({ token }),
        })

        if (!res.ok) {
          const data = await res.json()
          if (data.message?.includes("expiré")) {
            return navigate("/error-link?type=expired")
          }
          if (data.message?.includes("déjà utilisé")) {
            return navigate("/error-link?type=already-used")
          }
          return navigate("/error-link?type=invalid")
        }

        const meRes = await fetchWithBaseUrl("/users/me")
        if (!meRes.ok) throw new Error("Échec récupération utilisateur")
        const user = await meRes.json()
        setUser(user)
        setIsAuthenticated(true)

        // Rediriger vers la page d'accueil avec une URL propre
        navigate("/", { replace: true })
      } catch (err) {
        console.error("Erreur Magic Link :", err)
        navigate("/error-link?type=invalid")
      } finally {
        setIsLoading(false)
      }
    }

    handleMagicLogin()
  }, [location.search, navigate, setUser, setIsAuthenticated])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return null
}
