import { Bot, MessageCircle, Plus, Clock } from 'lucide-react-native';
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { client } from '@/utils/orpc';
import { useQuery } from '@tanstack/react-query';

export default function ChatHomeScreen() {
  const router = useRouter();

  // Fetch user's chat sessions
  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: () => client.chat.getSessions({
      page: 1,
      limit: 10,
      includeArchived: false
    })
  });

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
    <View className="flex-1 bg-[#FCFDFD]">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-6 pt-12">
        <View className="flex-row items-center mb-2">
          <View className="w-12 h-12 bg-teal-100 rounded-full justify-center items-center mr-4">
            <Bot size={24} color="#2A9D8F" strokeWidth={2} />
          </View>
          <View>
            <Text className="text-2xl font-bold text-primary">Krishi Mitra</Text>
            <Text className="text-gray-600">Your AI Agricultural Assistant</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-6">
        {/* Start New Chat Button */}
        <TouchableOpacity
          onPress={() => router.push('/chat/new')}
          className="flex-row items-center justify-center bg-primary py-4 px-6 rounded-xl mb-6 shadow-sm"
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
          <Text className="text-white font-semibold text-lg ml-2">Start New Chat</Text>
        </TouchableOpacity>

        {/* Recent Chats Section */}
        <View className="flex-1">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Recent Conversations
          </Text>
          
          {sessionsQuery.isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#2A9D8F" />
              <Text className="mt-4 text-gray-500">Loading your chats...</Text>
            </View>
          ) : sessionsQuery.error ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-red-500 text-center text-lg mb-4">
                Failed to load chats
              </Text>
              <TouchableOpacity
                onPress={() => sessionsQuery.refetch()}
                className="bg-gray-100 px-4 py-2 rounded-lg"
              >
                <Text className="text-gray-700 font-medium">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {sessionsQuery.data?.sessions?.length === 0 ? (
                <View className="flex-1 justify-center items-center py-12">
                  <MessageCircle size={48} color="#9CA3AF" strokeWidth={1} />
                  <Text className="text-gray-500 text-center mt-4 text-lg">
                    No conversations yet
                  </Text>
                  <Text className="text-gray-400 text-center mt-2">
                    Start your first chat to get agricultural advice!
                  </Text>
                </View>
              ) : (
                sessionsQuery.data?.sessions?.map((chatSession) => (
                  <TouchableOpacity
                    key={chatSession._id}
                    onPress={() => router.push(`/chat/${chatSession._id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm"
                  >
                    <Text 
                      className="font-semibold text-gray-900 mb-2 text-lg"
                      numberOfLines={2}
                    >
                      {chatSession.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Clock size={14} color="#9CA3AF" />
                      <Text className="text-sm text-gray-500 ml-2">
                        {formatDate(chatSession.updatedAt)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>

        {/* Quick Actions */}
        {sessionsQuery.data?.sessions?.length === 0 && (
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Ask about:
            </Text>
            {[
              'Best crops for this season',
              'Pest control methods',
              'Market prices today',
              'Weather forecast impact'
            ].map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push('/chat/new')}
                className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 mb-2"
              >
                <Text className="text-gray-700">{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
