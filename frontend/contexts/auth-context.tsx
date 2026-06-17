"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

type User = {
  id: string
  email: string
  telefone: string | null
  trader_id: string | null
  ja_registrado: boolean
  ja_pagou: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string) => Promise<void>
  register: (email: string) => Promise<void>
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(() => {
    api.auth
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (!token) {
      setLoading(false)
      return
    }

    api.auth
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("auth-token")
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string) => {
    const data = await api.auth.login(email)
    localStorage.setItem("auth-token", data.token)
    setUser(data.user)
    router.push("/")
  }

  const register = async (email: string) => {
    const data = await api.auth.register(email)
    localStorage.setItem("auth-token", data.token)
    setUser(data.user)
    router.push("/")
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
