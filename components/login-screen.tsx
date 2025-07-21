"use client"

import type React from "react"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

interface LoginScreenProps {
  onBack: () => void
  onRegister: () => void
}

export function LoginScreen({ onBack, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col safe-area">
      <div className="flex items-center p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-3 -ml-3 active:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 ml-4">Log In</h1>
      </div>

      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
                  placeholder="Enter your password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7A00] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#e66a00] transition-colors disabled:opacity-50 shadow-lg active:scale-95"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="text-center pt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <button type="button" onClick={onRegister} className="text-[#FF7A00] font-semibold">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
