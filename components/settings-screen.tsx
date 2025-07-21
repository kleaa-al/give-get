"use client"

import { useState } from "react"
import { ArrowLeft, LogOut, Trash2, HelpCircle, FileText, Shield } from "lucide-react"
import { signOut, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-wrapper"

interface SettingsScreenProps {
  onBack: () => void
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { user } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showReauth, setShowReauth] = useState(false)
  const [reauthPassword, setReauthPassword] = useState("")
  const [reauthError, setReauthError] = useState("")
  const [reauthLoading, setReauthLoading] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Delete user's posts
      const postsQuery = query(collection(db, "posts"), where("userId", "==", user.uid))
      const postsSnapshot = await getDocs(postsQuery)
      for (const doc of postsSnapshot.docs) {
        await deleteDoc(doc.ref)
      }

      // Delete user's requests
      const requestsQuery = query(collection(db, "requests"), where("userId", "==", user.uid))
      const requestsSnapshot = await getDocs(requestsQuery)
      for (const doc of requestsSnapshot.docs) {
        await deleteDoc(doc.ref)
      }

      // Delete user document
      await deleteDoc(doc(db, "users", user.uid))

      // (2) finally try to delete the Auth user
      await user.delete()
    } catch (err: any) {
      // If Firebase tells us the login is too old, ask for the password
      if (err.code === "auth/requires-recent-login") {
        setShowDeleteConfirm(false)
        setShowReauth(true)
      } else {
        console.error("Error deleting account:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReauthenticate = async () => {
    if (!user?.email) return
    setReauthLoading(true)
    setReauthError("")
    try {
      const cred = EmailAuthProvider.credential(user.email, reauthPassword)
      await reauthenticateWithCredential(user, cred)
      // after a successful re-login call delete again:
      await handleDeleteAccount()
      setShowReauth(false)
    } catch (err: any) {
      setReauthError("Wrong password – please try again.")
    } finally {
      setReauthLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex items-center bg-white border-b border-gray-100 px-4 py-4">
        <button onClick={onBack} className="p-3 -ml-3 active:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 ml-4">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* How it works */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="w-6 h-6 text-[#FF7A00]" />
              <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>• Post items you don't need anymore to give them away for free</p>
              <p>• Request items you need from the community</p>
              <p>• Connect with others through phone contact</p>
              <p>• Help reduce waste and build stronger communities</p>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-[#FF7A00]" />
              <h3 className="text-lg font-semibold text-gray-900">Community Rules</h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>• Be respectful and kind to all community members</p>
              <p>• Only post items that are in good condition</p>
              <p>• Provide accurate descriptions and photos</p>
              <p>• Respond promptly to interested parties</p>
              <p>• No selling or commercial activities</p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-[#FF7A00]" />
              <h3 className="text-lg font-semibold text-gray-900">Terms and Conditions</h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>• Use the app at your own risk</p>
              <p>• We are not responsible for transactions between users</p>
              <p>• Users must comply with local laws and regulations</p>
              <p>• We reserve the right to remove inappropriate content</p>
              <p>• By using this app, you agree to these terms</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Log Out</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 active:scale-95 transition-all shadow-lg"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-semibold">Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will remove all your posts
              and requests.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-2xl font-semibold active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showReauth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm your password</h3>

            <input
              type="password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4"
            />

            {reauthError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl mb-4">{reauthError}</div>}

            <div className="flex gap-3">
              <button
                onClick={() => setShowReauth(false)}
                disabled={reauthLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReauthenticate}
                disabled={reauthLoading || !reauthPassword}
                className="flex-1 px-4 py-2 bg-[#FF7A00] text-white rounded-lg disabled:opacity-50"
              >
                {reauthLoading ? "Verifying…" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
