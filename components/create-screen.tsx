"use client"

import { useState } from "react"
import { Package, Search } from "lucide-react"
import { PostProductForm } from "@/components/post-product-form"
import { PostRequestForm } from "@/components/post-request-form"

export function CreateScreen() {
  const [selectedType, setSelectedType] = useState<"product" | "request" | null>(null)

  if (selectedType === "product") {
    return <PostProductForm onBack={() => setSelectedType(null)} />
  }

  if (selectedType === "request") {
    return <PostRequestForm onBack={() => setSelectedType(null)} />
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
        <p className="text-gray-600 mt-1">What would you like to do?</p>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          <button
            onClick={() => setSelectedType("product")}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-[#FF7A00] hover:bg-orange-50 transition-all group active:scale-95"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#FF7A00] rounded-2xl flex items-center justify-center group-hover:bg-[#e66a00] transition-colors">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Post Product (Give)</h3>
                <p className="text-gray-600">Share something you don't need anymore</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedType("request")}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-[#FF7A00] hover:bg-orange-50 transition-all group active:scale-95"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#FF7A00] rounded-2xl flex items-center justify-center group-hover:bg-[#e66a00] transition-colors">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Post Request (Get)</h3>
                <p className="text-gray-600">Ask for something you need</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
