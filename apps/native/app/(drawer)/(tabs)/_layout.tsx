import { tailwindCSSColors } from '@/utils/tailwindTheme';
import { authClient } from '@/lib/auth-client';
import { Tabs, useRouter } from 'expo-router';
import {
  Building,
  Cloud,
  Handshake,
  Chrome as Home,
  MessageCircle,
  TrendingUp
} from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

export default function TabLayout() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2A9D8F',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB'
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600'
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerTitle: 'Home',
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} strokeWidth={2} />
          }}
        />
        <Tabs.Screen
          name="chat/new"
          options={{
            title: 'AI Chat',
            headerTitle: 'AI Chat',
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={size} color={color} strokeWidth={2} />
            )
          }}
        />
        <Tabs.Screen
          name="rag"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="chat/[sessionId]"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="chat/index"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="news/[id]"
          options={{
            href:null,
            tabBarStyle: { display: 'none' },
          }}
        />
        
        <Tabs.Screen
          name="news/data"
          options={{
            href:null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: 'Weather',
            headerTitle: 'Weather',
            tabBarIcon: ({ size, color }) => <Cloud size={size} color={color} strokeWidth={2} />
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            title: 'Market',
            headerTitle: 'Market',
            tabBarIcon: ({ size, color }) => (
              <TrendingUp size={size} color={color} strokeWidth={2} />
            )
          }}
        />
        <Tabs.Screen
          name="schemes"
          options={{
            title: 'Schemes',
            headerTitle: 'Schemes',
            tabBarIcon: ({ size, color }) => <Handshake size={size} color={color} strokeWidth={2} />
          }}
        />
      </Tabs>
    </>
  );
}
