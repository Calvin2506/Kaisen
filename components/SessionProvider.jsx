"use client"

import { SessionProvider as NextAuthProvider } from "next-auth/react"

export default function AuthSessionProvider({ children }) {
  return (
    <NextAuthProvider>
      {children}
    </NextAuthProvider>
  )
}