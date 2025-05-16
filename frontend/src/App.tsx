import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Navbar from "./components/navbar"
import HomePage from "./pages/home/Home"
import LoginPage from "./pages/login/LoginPage"
import RegisterPage from "./pages/register/RegisterPage"
import ProfilePage from "./pages/profile/ProfilePage"
import ProtectedRoute from "./components/protected-route"
import MagicRedirectPage from "@/pages/magic-token/Token"
import PasswordPage from "./pages/password/PasswordPage"
import ErrorLinkPage from "./pages/error/ErrorLinkPage"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/magic/:token" element={<MagicRedirectPage />} />
              <Route path="/password" element={<PasswordPage />} />
              <Route path="/error-link" element={<ErrorLinkPage />} />


              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
