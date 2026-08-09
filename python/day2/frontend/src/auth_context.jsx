import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [email, setEmail] = useState(() => localStorage.getItem("email"))

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }, [token])

  useEffect(() => {
    if (email) {
      localStorage.setItem("email", email)
    } else {
      localStorage.removeItem("email")
    }
  }, [email])

  const login = (newToken, newEmail) => {
    setToken(newToken)
    setEmail(newEmail)
  }

  const logout = () => {
    setToken(null)
    setEmail(null)
  }

  return (
    <AuthContext.Provider value={{ token, email, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}