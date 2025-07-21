import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

const WelcomeScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Give & Get</Text>
            <Text style={styles.subtitle}>Share what you don't need, find what you do</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login" as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register" as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 64,
  },
  logoContainer: {
    width: 128,
    height: 128,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
  },
  loginButton: {
    backgroundColor: "#FF7A00",
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
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  registerButton: {
    borderWidth: 2,
    borderColor: "#FF7A00",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  registerButtonText: {
    color: "#FF7A00",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
})

export default WelcomeScreen
