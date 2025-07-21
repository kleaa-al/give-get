"use client"

import { useState, useEffect } from "react"
import { Settings, Edit, UserIcon } from "lucide-react"
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-wrapper"
import { EditProfileForm } from "@/components/edit-profile-form"
import { SettingsScreen } from "@/components/settings-screen"
import { PostCard } from "@/components/post-card"

interface UserProfile {
  name: string
  email: string
  city: string
  phone: string
  profileDescription: string
  profilePhotoURL: string
}

export function ProfileScreen() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userRequests, setUserRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"posts" | "requests">("posts")
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    // Fetch user profile
    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile)
      }
      setLoading(false)
    }

    fetchProfile()

    // Listen to user's posts
    const postsQuery = query(collection(db, "posts"), where("userId", "==", user.uid))
    const unsubscribePosts = onSnapshot(
      postsQuery,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setUserPosts(posts)
      },
      (error) => {
        console.error("Error fetching posts:", error)
        setError("Failed to load posts.")
      },
    )

    // Listen to user's requests
    const requestsQuery = query(collection(db, "requests"), where("userId", "==", user.uid))
    const unsubscribeRequests = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setUserRequests(requests)
      },
      (error) => {
        console.error("Error fetching requests:", error)
        setError("Failed to load requests.")
      },
    )

    return () => {
      unsubscribePosts()
      unsubscribeRequests()
    }
  }, [user])

  if (showEditProfile) {
    return <EditProfileForm profile={profile} onBack={() => setShowEditProfile(false)} onUpdate={setProfile} />
  }

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen pb-20 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00]"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex items-center justify-between bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        <button onClick={() => setShowSettings(true)} className="p-3 -mr-3 active:bg-gray-100 rounded-full">
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {profile?.profilePhotoURL ? (
                <img
                  src={profile.profilePhotoURL || "/placeholder.svg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
              {profile?.city && <p className="text-gray-600 text-lg">{profile.city}</p>}
            </div>
          </div>

          {profile?.profileDescription && (
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">{profile.profileDescription}</p>
          )}

          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center space-x-2 px-4 py-3 border-2 border-[#FF7A00] text-[#FF7A00] rounded-2xl hover:bg-orange-50 active:scale-95 transition-all"
          >
            <Edit className="w-5 h-5" />
            <span className="font-semibold">Edit Profile</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-gray-100">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-4 px-4 text-center font-semibold text-lg relative ${
              activeTab === "posts" ? "text-[#FF7A00]" : "text-gray-600"
            }`}
          >
            My Posts ({userPosts.length})
            {activeTab === "posts" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7A00] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-4 px-4 text-center font-semibold text-lg relative ${
              activeTab === "requests" ? "text-[#FF7A00]" : "text-gray-600"
            }`}
          >
            My Requests ({userRequests.length})
            {activeTab === "requests" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7A00] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error ? (
            <div className="text-red-500 text-center py-4">Error: {error}</div>
          ) : activeTab === "posts" ? (
            userPosts.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">Share something you don't need anymore!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )
          ) : userRequests.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-600">Ask for something you need!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userRequests.map((request) => (
                <PostCard key={request.id} post={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
