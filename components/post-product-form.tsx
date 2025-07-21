"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Link } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-wrapper"
import Image from "next/image"

interface PostProductFormProps {
  onBack: () => void
}

export function PostProductForm({ onBack }: PostProductFormProps) {
  const { user } = useAuth()
  const [description, setDescription] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageError, setImageError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to post")
      return
    }

    if (!description.trim()) {
      setError("Description is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Creating post...")

      const postData = {
        userId: user.uid,
        photoURL: photoURL.trim(),
        description: description.trim(),
        city: city.trim(),
        phone: phone.trim(),
        dateCreated: serverTimestamp(),
        type: "give" as const,
      }

      console.log("Post data:", postData)

      const docRef = await addDoc(collection(db, "posts"), postData)
      console.log("Post created successfully with ID:", docRef.id)

      // Reset form and navigate back
      setDescription("")
      setCity("")
      setPhone("")
      setPhotoURL("")
      setImageError(false)
      onBack()
    } catch (error: any) {
      console.error("Error creating post:", error)
      setError(`Failed to create post: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex items-center bg-white border-b border-gray-100 px-4 py-4">
        <button onClick={onBack} className="p-3 -ml-3 active:bg-gray-100 rounded-full" disabled={loading}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 ml-4">Post Product</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo URL */}
          <div>
            <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-3">
              Photo Link (Optional)
            </label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="photoURL"
                type="url"
                value={photoURL}
                onChange={(e) => {
                  setPhotoURL(e.target.value)
                  setImageError(false)
                }}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
                placeholder="Paste your image link here..."
                disabled={loading}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Paste a link to your photo (from Google Photos, Dropbox, etc.)</p>

            {/* Image Preview */}
            {photoURL && !imageError && (
              <div className="mt-4">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src={photoURL || "/placeholder.svg?height=200&width=300"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>
              </div>
            )}

            {/* Image Error */}
            {photoURL && imageError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm">
                  Unable to load image from this link. Please check the URL and try again.
                </p>
              </div>
            )}
          </div>

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
              placeholder="Describe the item you're giving away..."
              rows={4}
              maxLength={500}
              disabled={loading}
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">{description.length}/500</div>
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
              maxLength={50}
              disabled={loading}
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
              maxLength={20}
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && <div className="text-red-600 text-sm bg-red-50 p-4 rounded-2xl border border-red-200">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold text-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !description.trim()}
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
