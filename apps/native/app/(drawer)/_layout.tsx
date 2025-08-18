import { Container } from '@/components/container';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authClient } from '@/lib/auth-client';
import { useColorScheme } from '@/lib/use-color-scheme';
import { queryClient } from '@/utils/orpc';
import { Slot, Tabs, useRouter } from 'expo-router';
import Drawer from 'expo-router/drawer';
import {
  Cloud,
  Chrome as Home,
  MessageCircle,
  TrendingUp,
  LogOut,
  Globe
} from 'lucide-react-native';
import { Text, TouchableOpacity, View, Image } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { data: session } = authClient.useSession();

  return (
    <>
      <Drawer
        screenOptions={{}}
        drawerContent={() => (
          <Container className="flex-1 pb-safe justify-end p-4 bg-white">
            <TouchableOpacity className="flex-row items-center gap-4 mb-4 bg-slate-100 py-4 px-2 rounded-xl">
              {session?.user?.image ? (
                <Image
                  source={{
                    uri: session?.user?.image || ''
                  }}
                  className="w-12 h-12 rounded-full bg-gray-200"
                />
              ) : (
                <>
                  <View className="w-12 h-12 justify-center items-center rounded-full bg-slate-200">
                    <Text className="text-sm font-semibold text-slate-500 ml-1">
                      {session?.user?.name?.charAt(0)?.toUpperCase()}
                      {session?.user?.name?.split(' ')?.[1]?.charAt(0)?.toUpperCase() ||
                        session?.user?.name?.charAt(1)?.toUpperCase()}
                    </Text>
                  </View>
                </>
              )}
              <View className="flex-1">
                <Text className="font-semibold text-lg text-gray-900">
                  {session?.user?.name || 'User'}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {session?.user?.email || 'user@email.com'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  authClient.signOut();
                  queryClient.invalidateQueries();
                  router.replace('/(auth)/login');
                }}
                className="p-2"
              >
                <LogOut size={24} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          </Container>
        )}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'Home',
            headerRight: () => (
              <View className="justify-center items-center flex flex-row gap-2">
                <TouchableOpacity>
                  <ThemeToggle />
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center px-3 me-4 py-2 bg-teal-100 rounded-full">
                  <Globe size={20} color="#264653" />
                  <Text className="text-sm font-semibold text-primary ml-1">En</Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </Drawer>
    </>
  );
}
