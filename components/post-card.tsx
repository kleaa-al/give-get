"use client"

import { useState } from "react"
import { MapPin, Phone, Calendar } from "lucide-react"
import Image from "next/image"

interface Post {
  id: string
  userId: string
  photoURL?: string
  description: string
  city?: string
  phone?: string
  dateCreated: any
  type: "give" | "get"
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const truncatedDescription =
    post.description.length > 80 ? post.description.substring(0, 80) + "..." : post.description

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString()
  }

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-95 transition-transform"
        onClick={() => setShowDetails(true)}
      >
        {post.photoURL && (
          <div className="aspect-video relative">
            <Image
              src={post.photoURL || "/placeholder.svg?height=200&width=300"}
              alt="Item photo"
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  post.type === "give" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {post.type === "give" ? "Available" : "Requested"}
              </span>
            </div>
          </div>
        )}

        <div className="p-4">
          <p className="text-gray-900 font-medium mb-3 text-lg leading-relaxed">{truncatedDescription}</p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {post.city && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {post.city}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.dateCreated)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto animate-slide-up">
            {post.photoURL && (
              <div className="aspect-video relative">
                <Image
                  src={post.photoURL || "/placeholder.svg?height=300&width=400"}
                  alt="Item photo"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    post.type === "give" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {post.type === "give" ? "Item Available" : "Item Requested"}
                </span>
                {!post.photoURL && (
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-8 h-8 text-gray-400 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>

              <p className="text-gray-900 mb-6 text-lg leading-relaxed">{post.description}</p>

              <div className="space-y-3 mb-6">
                {post.city && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-[#FF7A00]" />
                    <span className="text-lg">{post.city}</span>
                  </div>
                )}

                {post.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-[#FF7A00]" />
                    <span className="text-lg">{post.phone}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-[#FF7A00]" />
                  <span className="text-lg">Posted {formatDate(post.dateCreated)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold text-lg active:scale-95 transition-transform"
                >
                  Close
                </button>
                {post.phone && (
                  <button
                    onClick={() => window.open(`tel:${post.phone}`)}
                    className="flex-1 px-6 py-4 bg-[#FF7A00] text-white rounded-2xl font-semibold text-lg active:scale-95 transition-transform shadow-lg"
                  >
                    Call
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
