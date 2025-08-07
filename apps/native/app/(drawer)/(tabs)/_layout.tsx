import { authClient } from "@/lib/auth-client";
import { Tabs, useRouter } from "expo-router";
import {
  Building,
  Cloud,
  Handshake,
  Chrome as Home,
  MessageCircle,
  TrendingUp
} from "lucide-react-native";

export default function TabLayout() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

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
            headerTitle: "Home",
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "AI Assistant",
            headerTitle: "AI Assistant",
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: "Weather",
            headerTitle: "Weather",
            tabBarIcon: ({ size, color }) => (
              <Cloud size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            title: "Market",
            headerTitle: "Market",
            tabBarIcon: ({ size, color }) => (
              <TrendingUp size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="schemes"
          options={{
            title: "Schemes",
            headerTitle: "Schemes",
            tabBarIcon: ({ size, color }) => (
              <Handshake size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
