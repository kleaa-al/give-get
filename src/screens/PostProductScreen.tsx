"use client"

import { useState } from "react"
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
import { launchImageLibrary } from "react-native-image-picker"
import Icon from "react-native-vector-icons/MaterialIcons"
import { auth, firestore, storage } from "../config/firebase"

const PostProductScreen = () => {
  const navigation = useNavigation()
  const [description, setDescription] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [imageUri, setImageUri] = useState("")
  const [loading, setLoading] = useState(false)

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 600,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setImageUri(response.assets[0].uri || "")
        }
      },
    )
  }

  const uploadImage = async (uri: string): Promise<string> => {
    const user = auth().currentUser
    if (!user) throw new Error("User not authenticated")

    const filename = `posts/${user.uid}_${Date.now()}.jpg`
    const reference = storage().ref(filename)

    await reference.putFile(uri)
    return await reference.getDownloadURL()
  }

  const handleSubmit = async () => {
    const user = auth().currentUser
    if (!user) {
      Alert.alert("Error", "You must be logged in to post")
      return
    }

    if (!description.trim()) {
      Alert.alert("Error", "Description is required")
      return
    }

    setLoading(true)
    try {
      let uploadedPhotoURL = photoURL

      if (imageUri) {
        uploadedPhotoURL = await uploadImage(imageUri)
      }

      const postData = {
        userId: user.uid,
        photoURL: uploadedPhotoURL,
        description: description.trim(),
        city: city.trim(),
        phone: phone.trim(),
        dateCreated: firestore.FieldValue.serverTimestamp(),
        type: "give" as const,
      }

      await firestore().collection("posts").add(postData)

      Alert.alert("Success", "Post created successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error: any) {
      console.error("Error creating post:", error)
      Alert.alert("Error", "Failed to create post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Product</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Photo Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Photo (Optional)</Text>

            {imageUri ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageUri("")}>
                  <Icon name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                <Icon name="add-a-photo" size={32} color="#6B7280" />
                <Text style={styles.imagePickerText}>Add Photo</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.helperText}>Add a photo to help others see what you're offering</Text>
          </View>

          {/* Photo URL Alternative */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Or paste photo link</Text>
            <View style={styles.urlInputContainer}>
              <Icon name="link" size={20} color="#6B7280" style={styles.urlIcon} />
              <TextInput
                style={styles.urlInput}
                value={photoURL}
                onChangeText={setPhotoURL}
                placeholder="Paste your image link here..."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.helperText}>Paste a link to your photo (from Google Photos, Dropbox, etc.)</Text>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the item you're giving away..."
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{description.length}/500</Text>
          </View>

          {/* City */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
              maxLength={50}
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
              maxLength={20}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading || !description.trim()}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Post</Text>}
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
  form: {
    padding: 24,
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
    minHeight: 120,
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
  imagePicker: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  imagePickerText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  imagePreview: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
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

export default PostProductScreen
