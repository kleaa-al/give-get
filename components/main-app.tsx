"use client"

import { useState } from "react"
import { HomeScreen } from "@/components/home-screen"
import { CreateScreen } from "@/components/create-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export function MainApp() {
  const [activeScreen, setActiveScreen] = useState<"home" | "create" | "profile">("home")

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return <HomeScreen />
      case "create":
        return <CreateScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area">
      {renderScreen()}
      <BottomNavigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
    </div>
  )
}
