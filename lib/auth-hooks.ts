"use client"

import { useContext } from "react"
import { AuthContext } from "@/lib/auth-provider"

export function useAuthState() {
  const auth = useContext(AuthContext)
  return {
    user: auth.user,
    loading: auth.loading,
  }
}
