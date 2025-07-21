"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { auth, firestore } from "../config/firebase"
import PostCard from "../components/PostCard"

interface UserProfile {
  name: string
  email: string
  city: string
  phone: string
  profileDescription: string
  profilePhotoURL: string
}

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userRequests, setUserRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"posts" | "requests">("posts")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth().currentUser
    if (!user) return

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const userDoc = await firestore().collection("users").doc(user.uid).get()
        if (userDoc.exists) {
          setProfile(userDoc.data() as UserProfile)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setLoading(false)
      }
    }

    fetchProfile()

    // Listen to user's posts
    const unsubscribePosts = firestore()
      .collection("posts")
      .where("userId", "==", user.uid)
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setUserPosts(posts)
      })

    // Listen to user's requests
    const unsubscribeRequests = firestore()
      .collection("requests")
      .where("userId", "==", user.uid)
      .onSnapshot((snapshot) => {
        const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setUserRequests(requests)
      })

    return () => {
      unsubscribePosts()
      unsubscribeRequests()
    }
  }, [])

  const renderEmptyState = (type: string) => (
    <View style={styles.emptyState}>
      <Icon name="person" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No {type} yet</Text>
      <Text style={styles.emptySubtitle}>
        {type === "posts" ? "Share something you don't need anymore!" : "Ask for something you need!"}
      </Text>
    </View>
  )

  if (loading) {
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings" as never)}>
          <Icon name="settings" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              {profile?.profilePhotoURL ? (
                <Image source={{ uri: profile.profilePhotoURL }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size={40} color="#6B7280" />
                </View>
              )}
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{profile?.name}</Text>
              {profile?.city && <Text style={styles.profileCity}>{profile.city}</Text>}
            </View>
          </View>

          {profile?.profileDescription && <Text style={styles.profileDescription}>{profile.profileDescription}</Text>}

          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfile" as never)}>
            <Icon name="edit" size={20} color="#FF7A00" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>
              My Posts ({userPosts.length})
            </Text>
            {activeTab === "posts" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "requests" && styles.activeTab]}
            onPress={() => setActiveTab("requests")}
          >
            <Text style={[styles.tabText, activeTab === "requests" && styles.activeTabText]}>
              My Requests ({userRequests.length})
            </Text>
            {activeTab === "requests" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.tabContent}>
          {activeTab === "posts" ? (
            userPosts.length === 0 ? (
              renderEmptyState("posts")
            ) : (
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )
          ) : userRequests.length === 0 ? (
            renderEmptyState("requests")
          ) : (
            <FlatList
              data={userRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PostCard post={item} />}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  settingsButton: {
    padding: 12,
    marginRight: -12,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  profileCity: {
    fontSize: 18,
    color: "#6B7280",
  },
  profileDescription: {
    fontSize: 18,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#FF7A00",
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#FF7A00",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {},
  tabText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FF7A00",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#FF7A00",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tabContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
})

export default ProfileScreen
