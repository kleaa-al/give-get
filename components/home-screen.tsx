"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { PostCard } from "@/components/post-card"
import { Search } from "lucide-react"

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

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<"give" | "get">("give")
  const [posts, setPosts] = useState<Post[]>([])
  const [requests, setRequests] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen to posts collection
    const postsQuery = query(collection(db, "posts"), orderBy("dateCreated", "desc"))
    const unsubscribePosts = onSnapshot(
      postsQuery,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[]
        setPosts(postsData)
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setError("Unable to load posts – check your Firestore rules.")
        setLoading(false)
      },
    )

    // Listen to requests collection
    const requestsQuery = query(collection(db, "requests"), orderBy("dateCreated", "desc"))
    const unsubscribeRequests = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const requestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[]
        setRequests(requestsData)
      },
      (err) => {
        console.error(err)
        setError("Unable to load requests – check your Firestore rules.")
        setLoading(false)
      },
    )

    return () => {
      unsubscribePosts()
      unsubscribeRequests()
    }
  }, [])

  const currentData = activeTab === "give" ? posts : requests
  const filteredData = currentData.filter(
    (item) =>
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent text-lg bg-gray-50"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("give")}
            className={`flex-1 py-4 px-4 text-center font-semibold text-lg relative ${
              activeTab === "give" ? "text-[#FF7A00]" : "text-gray-600"
            }`}
          >
            Give
            {activeTab === "give" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7A00] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("get")}
            className={`flex-1 py-4 px-4 text-center font-semibold text-lg relative ${
              activeTab === "get" ? "text-[#FF7A00]" : "text-gray-600"
            }`}
          >
            Get
            {activeTab === "get" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7A00] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No items found" : `No ${activeTab === "give" ? "donations" : "requests"} yet`}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : `Be the first to ${activeTab === "give" ? "share something" : "make a request"}!`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
