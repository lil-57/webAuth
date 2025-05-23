"use client"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ModeToggle } from "./mode-toggle"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="border-b relative z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo à gauche */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Mon Application
          </Link>
        </div>

        {/* Zone droite */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Navigation desktop */}
          <nav className="hidden md:flex gap-2 lg:gap-4">
            <Link to="/" className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent">
              Accueil
            </Link>
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent"
              >
                Mon Profil
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent"
                >
                  Inscription
                </Link>
              </>
            )}
          </nav>

          <ModeToggle />

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 sm:gap-4">
              <span className="text-sm">Bonjour, {user?.firstName}</span>
              <Button variant="outline" onClick={handleLogout} size="sm" className="md:size-default">
                Déconnexion
              </Button>
            </div>
          )}

          {/* Bouton hamburger pour mobile */}
          <button className="md:hidden p-2 rounded-md hover:bg-accent" onClick={toggleMenu} aria-label="Menu principal">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-50">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className="text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent w-full block"
              onClick={closeMenu}
            >
              Accueil
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent w-full block"
                  onClick={closeMenu}
                >
                  Mon Profil
                </Link>
                <div className="pt-2 border-t">
                  <div className="mb-2 text-sm text-muted-foreground">Connecté en tant que {user?.firstName}</div>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent w-full block"
                  onClick={closeMenu}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent w-full block"
                  onClick={closeMenu}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
