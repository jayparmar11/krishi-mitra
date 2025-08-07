import { Container } from "@/components/container";
import { Tabs } from "expo-router";
import {
  Cloud,
  Chrome as Home,
  MessageCircle,
  TrendingUp,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2A9D8F",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "AI Assistant",
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: "Weather",
            tabBarIcon: ({ size, color }) => (
              <Cloud size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            title: "Market",
            tabBarIcon: ({ size, color }) => (
              <TrendingUp size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
