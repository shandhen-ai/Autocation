'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  email: string | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  email: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('autocation_auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      setIsAuthenticated(parsed.isAuthenticated)
      setEmail(parsed.email)
    }
  }, [])

  const login = (email: string) => {
    setIsAuthenticated(true)
    setEmail(email)
    localStorage.setItem('autocation_auth', JSON.stringify({ isAuthenticated: true, email }))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setEmail(null)
    localStorage.removeItem('autocation_auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
