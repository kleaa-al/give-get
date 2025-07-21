"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { auth, firestore } from "../config/firebase"

const SettingsScreen = () => {
  const navigation = useNavigation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showReauth, setShowReauth] = useState(false)
  const [reauthPassword, setReauthPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [reauthLoading, setReauthLoading] = useState(false)
  const [reauthError, setReauthError] = useState("")

  const handleLogout = async () => {
    try {
      await auth().signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleDeleteAccount = async () => {
    const user = auth().currentUser
    if (!user) return

    setLoading(true)
    try {
      // Delete user's posts
      const postsSnapshot = await firestore().collection("posts").where("userId", "==", user.uid).get()

      const batch = firestore().batch()
      postsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      // Delete user's requests
      const requestsSnapshot = await firestore().collection("requests").where("userId", "==", user.uid).get()

      requestsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      // Delete user document
      batch.delete(firestore().collection("users").doc(user.uid))

      await batch.commit()

      // Delete auth user
      await user.delete()
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        setShowDeleteConfirm(false)
        setShowReauth(true)
      } else {
        console.error("Error deleting account:", error)
        Alert.alert("Error", "Failed to delete account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReauthenticate = async () => {
    const user = auth().currentUser
    if (!user?.email) return

    setReauthLoading(true)
    setReauthError("")

    try {
      const credential = auth.EmailAuthProvider.credential(user.email, reauthPassword)
      await user.reauthenticateWithCredential(credential)

      setShowReauth(false)
      await handleDeleteAccount()
    } catch (error: any) {
      setReauthError("Wrong password – please try again.")
    } finally {
      setReauthLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* How it works */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="help-outline" size={24} color="#FF7A00" />
            <Text style={styles.sectionTitle}>How it works</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.bulletPoint}>• Post items you don't need anymore to give them away for free</Text>
            <Text style={styles.bulletPoint}>• Request items you need from the community</Text>
            <Text style={styles.bulletPoint}>• Connect with others through phone contact</Text>
            <Text style={styles.bulletPoint}>• Help reduce waste and build stronger communities</Text>
          </View>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="shield" size={24} color="#FF7A00" />
            <Text style={styles.sectionTitle}>Community Rules</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.bulletPoint}>• Be respectful and kind to all community members</Text>
            <Text style={styles.bulletPoint}>• Only post items that are in good condition</Text>
            <Text style={styles.bulletPoint}>• Provide accurate descriptions and photos</Text>
            <Text style={styles.bulletPoint}>• Respond promptly to interested parties</Text>
            <Text style={styles.bulletPoint}>• No selling or commercial activities</Text>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="description" size={24} color="#FF7A00" />
            <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.bulletPoint}>• Use the app at your own risk</Text>
            <Text style={styles.bulletPoint}>• We are not responsible for transactions between users</Text>
            <Text style={styles.bulletPoint}>• Users must comply with local laws and regulations</Text>
            <Text style={styles.bulletPoint}>• We reserve the right to remove inappropriate content</Text>
            <Text style={styles.bulletPoint}>• By using this app, you agree to these terms</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteConfirm(true)}>
            <Icon name="delete" size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account? This action cannot be undone and will remove all your posts
              and requests.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDeleteButton, loading && styles.disabledButton]}
                onPress={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalDeleteText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reauthentication Modal */}
      <Modal visible={showReauth} transparent animationType="fade" onRequestClose={() => setShowReauth(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm your password</Text>

            <TextInput
              style={styles.passwordInput}
              value={reauthPassword}
              onChangeText={setReauthPassword}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {reauthError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{reauthError}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowReauth(false)}
                disabled={reauthLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDeleteButton, (reauthLoading || !reauthPassword) && styles.disabledButton]}
                onPress={handleReauthenticate}
                disabled={reauthLoading || !reauthPassword}
              >
                {reauthLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalDeleteText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 12,
    marginLeft: -12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 12,
  },
  sectionContent: {
    marginLeft: 36,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 8,
  },
  actionsSection: {
    marginTop: 24,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 24,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalDeleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default SettingsScreen
