import { Bot, Send } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView
} from 'react-native';
import { client } from '@/utils/orpc';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewChatScreen() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: (data: { firstMessage?: string }) => client.chat.createSession(data),
    onSuccess: (data) => {
      // Invalidate sessions list in drawer
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      // Navigate to the new session with the first message to send
      router.replace({
        pathname: `/chat/[sessionId]`,
        params: {
          sessionId: data.session._id,
          firstMessage: input
        }
      });
    },
    onError: (error: any) => {
      console.error('Failed to create session:', error);
      // Show user-friendly error
      Alert.alert('Error', 'Failed to start chat. Please try again.');
    }
  });

  const startChat = () => {
    const trimmed = input.trim();
    if (!trimmed || createSessionMutation.isPending) return;

    createSessionMutation.mutate({
      firstMessage: trimmed
    });
  };

  const examplePrompts = [
    'Which seeds work best for monsoon planting in Gujarat?',
    'How to prevent common pests in tomato crops?',
    'What is the current market price trend for wheat?',
    'Best fertilizers for organic farming?'
  ];

  const handleExamplePrompt = (prompt: string) => {
    if (createSessionMutation.isPending) return;
    setInput(prompt);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-[#FCFDFD]"
      keyboardVerticalOffset={100}
    >
      <ScrollView className="flex-1">
        <View className="flex-1 py-20 justify-center items-center px-6">
          <View className="w-16 h-16 bg-teal-100 rounded-full justify-center items-center mb-6">
            <Bot size={32} color="#2A9D8F" strokeWidth={2} />
          </View>

          <Text className="text-3xl font-bold text-primary mb-3 text-center">Start New Chat</Text>

          <Text className="text-lg text-gray-600 text-center mb-8">
            Ask any agriculture-related question to get started
          </Text>

          {/* Example Prompts */}
          <View className="w-full mb-8">
            <Text className="text-base font-semibold text-gray-700 mb-4">Try asking about:</Text>
            {examplePrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleExamplePrompt(prompt)}
                disabled={createSessionMutation.isPending}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 mb-3"
              >
                <Text className="text-base text-primary">{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Input Section */}
      <View className="bg-white border-t border-gray-200">
        <View className="flex-row items-end rounded-full py-4 px-4">
          <TextInput
            className="flex-1 text-base text-primary max-h-24 pt-3 pb-3 px-4 bg-gray-50 rounded-full"
            value={input}
            onChangeText={setInput}
            placeholder="Type your question here..."
            placeholderTextColor="#9CA3AF"
            multiline
            editable={!createSessionMutation.isPending}
          />
          <TouchableOpacity
            className={`w-12 h-12 rounded-full justify-center items-center ml-3 ${
              input.trim() && !createSessionMutation.isPending ? 'bg-brand-main' : 'bg-gray-400'
            }`}
            onPress={startChat}
            disabled={!input.trim() || createSessionMutation.isPending}
          >
            {createSessionMutation.isPending ? (
              <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={20} color="#FFFFFF" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
