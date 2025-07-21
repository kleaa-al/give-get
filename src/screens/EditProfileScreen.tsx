"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { auth, firestore } from "../config/firebase"

interface UserProfile {
  name: string
  email: string
  city: string
  phone: string
  profileDescription: string
  profilePhotoURL: string
}

const EditProfileScreen = () => {
  const navigation = useNavigation()
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [profileDescription, setProfileDescription] = useState("")
  const [profilePhotoURL, setProfilePhotoURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth().currentUser
      if (!user) return

      try {
        const userDoc = await firestore().collection("users").doc(user.uid).get()
        if (userDoc.exists) {
          const profile = userDoc.data() as UserProfile
          setName(profile.name || "")
          setCity(profile.city || "")
          setPhone(profile.phone || "")
          setProfileDescription(profile.profileDescription || "")
          setProfilePhotoURL(profile.profilePhotoURL || "")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async () => {
    const user = auth().currentUser
    if (!user) return

    if (!name.trim()) {
      Alert.alert("Error", "Name is required")
      return
    }

    setLoading(true)
    try {
      const updatedProfile = {
        name: name.trim(),
        city: city.trim(),
        phone: phone.trim(),
        profileDescription: profileDescription.trim(),
        profilePhotoURL: profilePhotoURL.trim(),
      }

      await firestore().collection("users").doc(user.uid).update(updatedProfile)

      Alert.alert("Success", "Profile updated successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error: any) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A00" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Profile Photo Preview */}
          <View style={styles.photoSection}>
            <View style={styles.avatarContainer}>
              {profilePhotoURL && !imageError ? (
                <Image
                  source={{ uri: profilePhotoURL }}
                  style={styles.avatar}
                  onLoad={() => setImageError(false)}
                  onError={() => setImageError(true)}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size={64} color="#6B7280" />
                </View>
              )}
            </View>
          </View>

          {/* Profile Photo URL */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile Photo Link (Optional)</Text>
            <View style={styles.urlInputContainer}>
              <Icon name="link" size={20} color="#6B7280" style={styles.urlIcon} />
              <TextInput
                style={styles.urlInput}
                value={profilePhotoURL}
                onChangeText={(text) => {
                  setProfilePhotoURL(text)
                  setImageError(false)
                }}
                placeholder="Paste your profile photo link here..."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.helperText}>
              Paste a link to your profile photo (from Google Photos, Dropbox, etc.)
            </Text>

            {profilePhotoURL && imageError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Unable to load image from this link. Please check the URL and try again.
                </Text>
              </View>
            )}
          </View>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />
          </View>

          {/* City */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
              autoCapitalize="words"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Bio */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.textArea}
              value={profileDescription}
              onChangeText={setProfileDescription}
              placeholder="Tell others about yourself..."
              multiline
              numberOfLines={3}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{profileDescription.length}/200</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading || !name.trim()}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Save</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    padding: 24,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    minHeight: 100,
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  urlInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  urlIcon: {
    marginLeft: 16,
  },
  urlInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#FF7A00",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default EditProfileScreen
