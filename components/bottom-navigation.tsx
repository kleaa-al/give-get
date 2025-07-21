"use client"

import { Home, Plus, User } from "lucide-react"

interface BottomNavigationProps {
  activeScreen: "home" | "create" | "profile"
  onScreenChange: (screen: "home" | "create" | "profile") => void
}

export function BottomNavigation({ activeScreen, onScreenChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex">
        <button
          onClick={() => onScreenChange("home")}
          className={`flex-1 flex flex-col items-center py-3 ${
            activeScreen === "home" ? "text-[#FF7A00]" : "text-gray-600"
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>

        <button onClick={() => onScreenChange("create")} className="flex-1 flex flex-col items-center py-3">
          <div className="w-10 h-10 bg-[#FF7A00] rounded-full flex items-center justify-center mb-1 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-600">Create</span>
        </button>

        <button
          onClick={() => onScreenChange("profile")}
          className={`flex-1 flex flex-col items-center py-3 ${
            activeScreen === "profile" ? "text-[#FF7A00]" : "text-gray-600"
          }`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  )
}
