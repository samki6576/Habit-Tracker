"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"

import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  initialized: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  initialized: !!auth,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized] = useState<boolean>(!!auth)

  useEffect(() => {
    // Only set up the auth state listener if Firebase auth is initialized
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading, initialized }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
