"use client"

import { useAuth } from "@/components/auth-wrapper"
import { WelcomeScreen } from "@/components/welcome-screen"
import { MainApp } from "@/components/main-app"

export function MobileApp() {
  const { user } = useAuth()

  if (!user) {
    return <WelcomeScreen />
  }

  return <MainApp />
}
