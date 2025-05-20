"use client"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo à gauche */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Mon Application
          </Link>
        </div>

        {/* Zone droite */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Accueil
            </Link>
            {isAuthenticated ? (
              <Link to="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                Mon Profil
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
                  Connexion
                </Link>
                <Link to="/register" className="text-sm font-medium transition-colors hover:text-primary">
                  Inscription
                </Link>
              </>
            )}
          </nav>

          <ModeToggle />

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">Bonjour, {user?.firstName}</span>
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
