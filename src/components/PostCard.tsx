"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, Linking, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

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

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showDetails, setShowDetails] = useState(false)

  const truncatedDescription =
    post.description.length > 80 ? post.description.substring(0, 80) + "..." : post.description

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString()
  }

  const handleCall = () => {
    if (post.phone) {
      Linking.openURL(`tel:${post.phone}`).catch(() => {
        Alert.alert("Error", "Unable to make phone call")
      })
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setShowDetails(true)} activeOpacity={0.8}>
        {post.photoURL && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: post.photoURL }} style={styles.image} />
            <View style={styles.badge}>
              <Text style={[styles.badgeText, post.type === "give" ? styles.giveBadge : styles.getBadge]}>
                {post.type === "give" ? "Available" : "Requested"}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.description}>{truncatedDescription}</Text>

          <View style={styles.footer}>
            <View style={styles.info}>
              {post.city && (
                <View style={styles.infoItem}>
                  <Icon name="location-on" size={16} color="#6B7280" />
                  <Text style={styles.infoText}>{post.city}</Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <Icon name="calendar-today" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{formatDate(post.dateCreated)}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={showDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modal}>
          {post.photoURL && (
            <View style={styles.modalImageContainer}>
              <Image source={{ uri: post.photoURL }} style={styles.modalImage} />
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowDetails(false)}>
                <Icon name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalBadge, post.type === "give" ? styles.giveModalBadge : styles.getModalBadge]}>
                <Text style={styles.modalBadgeText}>{post.type === "give" ? "Item Available" : "Item Requested"}</Text>
              </View>
              {!post.photoURL && (
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowDetails(false)}>
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.modalDescription}>{post.description}</Text>

            <View style={styles.modalInfo}>
              {post.city && (
                <View style={styles.modalInfoItem}>
                  <Icon name="location-on" size={20} color="#FF7A00" />
                  <Text style={styles.modalInfoText}>{post.city}</Text>
                </View>
              )}

              {post.phone && (
                <View style={styles.modalInfoItem}>
                  <Icon name="phone" size={20} color="#FF7A00" />
                  <Text style={styles.modalInfoText}>{post.phone}</Text>
                </View>
              )}

              <View style={styles.modalInfoItem}>
                <Icon name="calendar-today" size={20} color="#FF7A00" />
                <Text style={styles.modalInfoText}>Posted {formatDate(post.dateCreated)}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowDetails(false)}>
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
              {post.phone && (
                <TouchableOpacity style={styles.modalCallBtn} onPress={handleCall}>
                  <Text style={styles.modalCallBtnText}>Call</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 16 / 9,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  giveBadge: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  getBadge: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  modal: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalImageContainer: {
    position: "relative",
    aspectRatio: 16 / 9,
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  giveModalBadge: {
    backgroundColor: "#D1FAE5",
  },
  getModalBadge: {
    backgroundColor: "#DBEAFE",
  },
  modalBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  modalDescription: {
    fontSize: 18,
    color: "#111827",
    lineHeight: 24,
    marginBottom: 24,
  },
  modalInfo: {
    marginBottom: 24,
  },
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalInfoText: {
    fontSize: 18,
    color: "#6B7280",
    marginLeft: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCloseBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    alignItems: "center",
  },
  modalCloseBtnText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  modalCallBtn: {
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
  modalCallBtnText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default PostCard
