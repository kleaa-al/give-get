"use client"

import type React from "react"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

interface RegisterScreenProps {
  onBack: () => void
  onLogin: () => void
}

export function RegisterScreen({ onBack, onLogin }: RegisterScreenProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        city: "",
        phone: "",
        profileDescription: "",
        profilePhotoURL: "",
        createdAt: new Date().toISOString(),
      })
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already registered")
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters")
      } else {
        setError("Registration failed. Please try again.")
      }
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
        <h1 className="text-xl font-semibold text-gray-900 ml-4">Register</h1>
      </div>

      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
                  placeholder="Confirm your password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
            {loading ? "Creating account..." : "Register"}
          </button>

          <div className="text-center pt-4">
            <span className="text-gray-600">Already have an account? </span>
            <button type="button" onClick={onLogin} className="text-[#FF7A00] font-semibold">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
