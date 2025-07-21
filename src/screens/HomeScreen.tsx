"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { firestore } from "../config/firebase"
import PostCard from "../components/PostCard"

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

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<"give" | "get">("give")
  const [posts, setPosts] = useState<Post[]>([])
  const [requests, setRequests] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribePosts = firestore()
      .collection("posts")
      .orderBy("dateCreated", "desc")
      .onSnapshot(
        (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[]
          setPosts(postsData)
          setLoading(false)
        },
        (error) => {
          console.error("Error fetching posts:", error)
          setLoading(false)
        },
      )

    const unsubscribeRequests = firestore()
      .collection("requests")
      .orderBy("dateCreated", "desc")
      .onSnapshot(
        (snapshot) => {
          const requestsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[]
          setRequests(requestsData)
        },
        (error) => {
          console.error("Error fetching requests:", error)
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="search" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No items found" : `No ${activeTab === "give" ? "donations" : "requests"} yet`}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try adjusting your search terms"
          : `Be the first to ${activeTab === "give" ? "share something" : "make a request"}!`}
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "give" && styles.activeTab]}
            onPress={() => setActiveTab("give")}
          >
            <Text style={[styles.tabText, activeTab === "give" && styles.activeTabText]}>Give</Text>
            {activeTab === "give" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "get" && styles.activeTab]}
            onPress={() => setActiveTab("get")}
          >
            <Text style={[styles.tabText, activeTab === "get" && styles.activeTabText]}>Get</Text>
            {activeTab === "get" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF7A00" />
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  tabContainer: {
    flexDirection: "row",
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
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default HomeScreen
