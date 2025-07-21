"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-wrapper"

interface PostRequestFormProps {
  onBack: () => void
}

export function PostRequestForm({ onBack }: PostRequestFormProps) {
  const { user } = useAuth()
  const [description, setDescription] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      await addDoc(collection(db, "requests"), {
        userId: user.uid,
        description,
        city,
        phone,
        dateCreated: serverTimestamp(),
        type: "get",
      })

      onBack()
    } catch (error: any) {
      setError("Failed to post request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex items-center bg-white border-b border-gray-100 px-4 py-4">
        <button onClick={onBack} className="p-3 -ml-3 active:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 ml-4">Post Request</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg resize-none"
              placeholder="Describe what you're looking for..."
              rows={4}
              required
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-3">
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
              placeholder="Enter your city"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
              placeholder="Enter your phone number"
            />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-4 rounded-2xl border border-red-200">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold text-lg active:scale-95 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-[#FF7A00] text-white rounded-2xl font-semibold text-lg active:scale-95 transition-transform disabled:opacity-50 shadow-lg"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
