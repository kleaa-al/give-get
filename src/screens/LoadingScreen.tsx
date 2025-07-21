import { View, ActivityIndicator, Text, StyleSheet } from "react-native"

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>G&G</Text>
      </View>
      <ActivityIndicator size="large" color="#FF7A00" style={styles.spinner} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#FF7A00",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  spinner: {
    marginTop: 16,
  },
})

export default LoadingScreen
