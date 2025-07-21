"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, UserIcon, Link } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-wrapper"

interface UserProfile {
  name: string
  email: string
  city: string
  phone: string
  profileDescription: string
  profilePhotoURL: string
}

interface EditProfileFormProps {
  profile: UserProfile | null
  onBack: () => void
  onUpdate: (profile: UserProfile) => void
}

export function EditProfileForm({ profile, onBack, onUpdate }: EditProfileFormProps) {
  const { user } = useAuth()
  const [name, setName] = useState(profile?.name || "")
  const [city, setCity] = useState(profile?.city || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [profileDescription, setProfileDescription] = useState(profile?.profileDescription || "")
  const [profilePhotoURL, setProfilePhotoURL] = useState(profile?.profilePhotoURL || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageError, setImageError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!name.trim()) {
      setError("Name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const updatedProfile = {
        name: name.trim(),
        email: profile?.email || "",
        city: city.trim(),
        phone: phone.trim(),
        profileDescription: profileDescription.trim(),
        profilePhotoURL: profilePhotoURL.trim(),
      }

      await updateDoc(doc(db, "users", user.uid), updatedProfile)
      console.log("Profile updated successfully")

      onUpdate(updatedProfile)
      onBack()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again.")
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
        <h1 className="text-xl font-semibold text-gray-900 ml-4">Edit Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Photo Preview */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-4">
              {profilePhotoURL && !imageError ? (
                <img
                  src={profilePhotoURL || "/placeholder.svg"}
                  alt="Profile"
                  className="w-32 h-32 object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
          </div>

          {/* Profile Photo URL */}
          <div>
            <label htmlFor="profilePhotoURL" className="block text-sm font-medium text-gray-700 mb-3">
              Profile Photo Link (Optional)
            </label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="profilePhotoURL"
                type="url"
                value={profilePhotoURL}
                onChange={(e) => {
                  setProfilePhotoURL(e.target.value)
                  setImageError(false)
                }}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
                placeholder="Paste your profile photo link here..."
                disabled={loading}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Paste a link to your profile photo (from Google Photos, Dropbox, etc.)
            </p>

            {/* Image Error */}
            {profilePhotoURL && imageError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm">
                  Unable to load image from this link. Please check the URL and try again.
                </p>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg"
              placeholder="Enter your full name"
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
              Bio
            </label>
            <textarea
              id="description"
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg resize-none"
              placeholder="Tell others about yourself..."
              rows={3}
              maxLength={200}
              disabled={loading}
            />
            <div className="text-right text-sm text-gray-500 mt-1">{profileDescription.length}/200</div>
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
              disabled={loading || !name.trim()}
              className="flex-1 px-6 py-4 bg-[#FF7A00] text-white rounded-2xl font-semibold text-lg active:scale-95 transition-transform disabled:opacity-50 shadow-lg"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
