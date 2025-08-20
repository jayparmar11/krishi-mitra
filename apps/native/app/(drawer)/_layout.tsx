import { Container } from '@/components/container';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authClient } from '@/lib/auth-client';
import { useColorScheme } from '@/lib/use-color-scheme';
import { client, queryClient } from '@/utils/orpc';
import { Slot, Tabs, useRouter } from 'expo-router';
import Drawer from 'expo-router/drawer';
import { useQuery } from '@tanstack/react-query';
import {
  Cloud,
  Chrome as Home,
  MessageCircle,
  TrendingUp,
  LogOut,
  Globe,
  Plus,
  Clock
} from 'lucide-react-native';
import { Text, TouchableOpacity, View, Image, ScrollView, ActivityIndicator } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { data: session } = authClient.useSession();

  // Fetch user's chat sessions
  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: () =>
      client.chat.getSessions({
        page: 1,
        limit: 10,
        includeArchived: false
      })
  });
  if (sessionsQuery.data) 
  console.log("🚀 ~ TabLayout ~ sessionsQuery:", sessionsQuery.data.sessions)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <>
      <Drawer
        screenOptions={{}}
        drawerContent={() => (
          <Container className="flex-1 pt-safe pb-safe bg-background">


            {/* Chat Sessions Section */}
            <View className="flex-1 p-4">
              {/* Start New Chat Button */}
              <TouchableOpacity
                onPress={() => router.push('/chat/new')}
                className="flex-row items-center justify-center bg-primary py-3 px-4 rounded-xl mb-6"
              >
                <Plus size={20} color="#FFFFFF" strokeWidth={2} />
                <Text className="text-white font-semibold ml-2">Start New Chat</Text>
              </TouchableOpacity>

              {/* Recent Chats */}
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Recent Chats
                </Text>

                {sessionsQuery.isLoading ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="small" color="#2A9D8F" />
                    <Text className="mt-2 text-gray-500">Loading chats...</Text>
                  </View>
                ) : sessionsQuery.error ? (
                  <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500 text-center">Failed to load chats</Text>
                    <TouchableOpacity
                      onPress={() => sessionsQuery.refetch()}
                      className="mt-2 bg-gray-100 px-3 py-1 rounded"
                    >
                      <Text className="text-gray-700">Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {sessionsQuery.data?.sessions?.length === 0 ? (
                      <View className="flex-1 justify-center items-center py-8">
                        <MessageCircle size={32} color="#9CA3AF" strokeWidth={1} />
                        <Text className="text-gray-500 text-center mt-2">
                          No chats yet.{'\n'}Start your first conversation!
                        </Text>
                      </View>
                    ) : (
                      sessionsQuery.data?.sessions?.map((chatSession: any) => (
                        <TouchableOpacity
                          key={chatSession._id}
                          onPress={() => router.push(`/chat/${chatSession._id}` as any)}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-3"
                        >
                          <Text
                            className="font-medium text-gray-900 dark:text-white mb-1"
                            numberOfLines={1}
                          >
                            {chatSession.title}
                          </Text>
                          <View className="flex-row items-center">
                            <Clock size={12} color="#9CA3AF" />
                            <Text className="text-xs text-gray-500 ml-1">
                              {formatDate(chatSession.updatedAt)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                )}
              </View>
            </View>

                        {/* User Profile Section */}
            <View className="p-4 border-b border-gray-200">
              <TouchableOpacity className="flex-row items-center gap-4 mb-4 bg-slate-100 dark:bg-gray-800 py-4 px-2 rounded-xl">
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
                  <Text className="font-semibold text-lg text-gray-900 dark:text-white">
                    {session?.user?.name || 'User'}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {session?.user?.email || 'user@email.com'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    authClient.signOut();
                    queryClient.invalidateQueries();
                    router.replace('/(auth)/login');
                  }}
                  className="p-2 bg-red-500/20 rounded-full"
                >
                  <LogOut size={24} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
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
                  <Text className="text-sm font-semibold ml-1 text-black">En</Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </Drawer>
    </>
  );
}
