import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialIcons"

import HomeScreen from "../screens/HomeScreen"
import CreateScreen from "../screens/CreateScreen"
import ProfileScreen from "../screens/ProfileScreen"
import PostProductScreen from "../screens/PostProductScreen"
import PostRequestScreen from "../screens/PostRequestScreen"
import EditProfileScreen from "../screens/EditProfileScreen"
import SettingsScreen from "../screens/SettingsScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const CreateStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CreateMain" component={CreateScreen} />
    <Stack.Screen name="PostProduct" component={PostProductScreen} />
    <Stack.Screen name="PostRequest" component={PostRequestScreen} />
  </Stack.Navigator>
)

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
)

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: "#FF7A00",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="add-circle" size={32} color="#FF7A00" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
