import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"

const CreateScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Post</Text>
        <Text style={styles.subtitle}>What would you like to do?</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("PostProduct" as never)}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Icon name="inventory" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Post Product (Give)</Text>
              <Text style={styles.optionDescription}>Share something you don't need anymore</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("PostRequest" as never)}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Icon name="search" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Post Request (Get)</Text>
              <Text style={styles.optionDescription}>Ask for something you need</Text>
            </View>
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#FF7A00",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 16,
    color: "#6B7280",
  },
})

export default CreateScreen
