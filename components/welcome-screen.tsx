"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"

export function WelcomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "login" | "register">("welcome")

  if (currentScreen === "login") {
    return <LoginScreen onBack={() => setCurrentScreen("welcome")} onRegister={() => setCurrentScreen("register")} />
  }

  if (currentScreen === "register") {
    return <RegisterScreen onBack={() => setCurrentScreen("welcome")} onLogin={() => setCurrentScreen("login")} />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 safe-area">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="/logo.jpeg" alt="Give & Get Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">Give & Get</h1>
            <p className="text-gray-600 text-lg">Share what you don't need, find what you do</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentScreen("login")}
            className="w-full bg-[#FF7A00] text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-[#e66a00] transition-colors shadow-lg active:scale-95"
          >
            Log In
          </button>
          <button
            onClick={() => setCurrentScreen("register")}
            className="w-full border-2 border-[#FF7A00] text-[#FF7A00] py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-[#FF7A00] hover:text-white transition-colors active:scale-95"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}
