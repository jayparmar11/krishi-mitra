import { Bot, Send, RotateCcw } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { AutoScrollFlatList } from 'react-native-autoscroll-flatlist';
import { client } from '@/utils/orpc';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Message = {
  _id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  messageIndex: number;
  variantIndex: number;
  isActive: boolean;
  createdAt: string;
  isRetryable?: boolean;
  isOptimistic?: boolean;
};

export default function ChatSessionScreen() {
  const { sessionId, firstMessage } = useLocalSearchParams<{
    sessionId: string;
    firstMessage?: string;
  }>();
  const router = useRouter();
  const [input, setInput] = useState('');
  const flatListRef = useRef<any>(null);
  const hasAutoSentFirstMessage = useRef<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  // Fetch session and messages
  const sessionQuery = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => client.chat.getSession({ sessionId: sessionId! }),
    enabled: !!sessionId
  });

  // Send message mutation with optimistic updates
  const sendMessageMutation = useMutation({
    mutationFn: (data: {
      sessionId: string;
      content: string;
      role: 'user' | 'assistant' | 'system';
    }) => client.chat.sendMessage(data),
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['session', sessionId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['session', sessionId], (old: any) => {
        if (!old) {
          // If no session data yet, create minimal structure
          return {
            session: { _id: sessionId, title: 'New Chat' },
            messages: [{
              _id: `temp-${Date.now()}`,
              content: newMessage.content,
              role: newMessage.role,
              messageIndex: 0,
              variantIndex: 0,
              isActive: true,
              createdAt: new Date().toISOString(),
              isOptimistic: true
            }]
          };
        }
        
        const tempMessage: Message = {
          _id: `temp-${Date.now()}`,
          content: newMessage.content,
          role: newMessage.role,
          messageIndex: old.messages?.length || 0,
          variantIndex: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          isOptimistic: true
        };

        return {
          ...old,
          messages: [...(old.messages || []), tempMessage]
        };
      });

      // Return a context object with the snapshotted value
      return { previousData, userMessage: newMessage };
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic message with real data
      queryClient.setQueryData(['session', sessionId], (old: any) => {
        if (!old) return old;

        const messages = old.messages.map((msg: Message) => 
          msg.isOptimistic && msg.content === variables.content 
            ? { ...data.userMessage, isOptimistic: false }
            : msg
        );

        // Add AI response if it exists
        if (data.aiMessage) {
          messages.push(data.aiMessage);
        }

        return {
          ...old,
          messages
        };
      });
      
      setTimeout(() => flatListRef.current?.scrollToEnd?.(), 100);
    },
    onError: (error: any, variables, context) => {
      // Rollback optimistic update and let backend error handling take over
      if (context?.previousData) {
        queryClient.setQueryData(['session', sessionId], context.previousData);
      }
      
      // Force refetch to get the error message from backend
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    }
  });

  // Auto-send first message if provided from new chat flow
  useEffect(() => {
    if (firstMessage && !hasAutoSentFirstMessage.current[sessionId!] && sessionId && !sendMessageMutation.isPending) {
      hasAutoSentFirstMessage.current[sessionId] = true;
      sendMessageMutation.mutate({
        sessionId,
        content: firstMessage,
        role: 'user'
      });
      sessionQuery.refetch();
    }
  }, [firstMessage, sessionId, sendMessageMutation]);

  // Regenerate message mutation with optimistic updates
  const regenerateMutation = useMutation({
    mutationFn: (data: { sessionId: string; messageId: string }) =>
      client.chat.regenerateMessage(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] });
      return { previousData: queryClient.getQueryData(['session', sessionId]) };
    },
    onSuccess: (newMessage) => {
      // Refetch to get the updated messages with proper active/inactive states
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: any, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['session', sessionId], context.previousData);
      }
      
      // Force refetch to get the error message from backend
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    }
  });

  const retryMessage = (errorMessage: Message) => {
    // Remove error message and retry the original action
    queryClient.setQueryData(['session', sessionId], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        messages: old.messages.filter((msg: Message) => msg._id !== errorMessage._id)
      };
    });

    // You could store the original message content in the error message to retry
    // For now, we'll just remove the error and let user manually retry
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || sendMessageMutation.isPending || !sessionId) return;

    setInput('');
    sendMessageMutation.mutate({
      sessionId,
      content: trimmed,
      role: 'user'
    });
  };

  const regenerateMessage = (messageId: string) => {
    if (regenerateMutation.isPending || !sessionId) return;

    regenerateMutation.mutate({
      sessionId,
      messageId
    });
  };

  const ThinkingBubble = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      let i = 0;
      const id = setInterval(() => {
        i = (i + 1) % 4;
        setDots('.'.repeat(i));
      }, 400);
      return () => clearInterval(id);
    }, []);

    return <Text className="text-base leading-6 text-primary">Thinking{dots}</Text>;
  };

  // Show loading state while fetching session
  if (sessionQuery.isLoading) {
    return (
      <View className="flex-1 bg-[#FCFDFD] justify-center items-center">
        <ActivityIndicator size="large" color="#2A9D8F" />
        <Text className="mt-4 text-gray-600">Loading chat...</Text>
      </View>
    );
  }

  // Show error state
  if (sessionQuery.error) {
    return (
      <View className="flex-1 bg-[#FCFDFD] justify-center items-center p-6">
        <Text className="text-lg font-bold text-red-700 text-center mb-2">Error loading chat</Text>
        <Text className="text-base text-gray-600 text-center mb-4">
          {sessionQuery.error.message}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const session = sessionQuery.data?.session;
  console.log("🚀 ~ session:", session)
  const messages = sessionQuery.data?.messages || [];

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-[#FCFDFD]"
      keyboardVerticalOffset={100}
    >
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <Text className="text-lg font-semibold text-primary w-full" numberOfLines={1}>
          {session?.title || 'Chat'}
        </Text>
        <Text className="text-sm text-gray-500">{messages.length} messages</Text>
      </View>

      {/* Messages */}
      <AutoScrollFlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        keyExtractor={(item) => item._id}
        renderItem={({ item: message }) => (
          <View
            key={message._id}
            className={`mb-4 flex-row ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role !== 'user' && (
              <View className="w-8 h-8 absolute -top-3 z-10 -left-3 rounded-full bg-teal-100 justify-center items-center mr-2 mt-1">
                <Bot size={16} color="#2A9D8F" strokeWidth={2} />
              </View>
            )}
            <View
              className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-primary rounded-br-md'
                  : message.content.startsWith('❌')
                  ? 'bg-red-50 border border-red-200 rounded-bl-md'
                  : 'bg-white border border-gray-200 rounded-bl-md'
              }`}
            >
              {message.role === 'user' ? (
                <Text className="text-base leading-6 text-white" selectable>{message.content}</Text>
              ) : message.content.startsWith('❌') ? (
                <View>
                  <Text className="text-red-700 mb-2" selectable>{message.content}</Text>
                  <TouchableOpacity
                    onPress={() => regenerateMessage(message._id)}
                    disabled={regenerateMutation.isPending}
                    className="bg-red-500 px-3 py-1 rounded self-start"
                  >
                    <Text className="text-white text-sm font-medium">
                      {regenerateMutation.isPending ? 'Regenerating...' : 'Retry'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View>
                    <Markdown
                      style={{
                        body: { 
                          color: '#2A9D8F',
                          fontSize: 16,
                          lineHeight: 24,
                          fontFamily: 'System'
                        },
                        paragraph: { 
                          marginTop: 0,
                          marginBottom: 8
                        },
                        strong: {
                          fontWeight: 'bold'
                        },
                        em: {
                          fontStyle: 'italic'
                        },
                        code_inline: {
                          backgroundColor: '#f3f4f6',
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                          fontSize: 14,
                          fontFamily: 'monospace'
                        },
                        code_block: {
                          backgroundColor: '#f3f4f6',
                          padding: 12,
                          borderRadius: 8,
                          fontSize: 14,
                          fontFamily: 'monospace'
                        },
                        bullet_list: {
                          marginVertical: 8
                        },
                        ordered_list: {
                          marginVertical: 8
                        },
                        list_item: {
                          marginVertical: 2
                        }
                      }}
                      selectable
                    >
                      {message.content}
                    </Markdown>
                  </View>
                  {/* Regenerate button for AI messages */}
                  <TouchableOpacity
                    onPress={() => regenerateMessage(message._id)}
                    disabled={regenerateMutation.isPending}
                    className="mt-2 flex-row items-center"
                  >
                    <RotateCcw
                      size={14}
                      color={regenerateMutation.isPending ? '#9CA3AF' : '#6B7280'}
                    />
                    <Text
                      className={`ml-1 text-sm ${
                        regenerateMutation.isPending ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {regenerateMutation.isPending ? 'Regenerating...' : 'Regenerate'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20 px-6">
            <Bot size={48} color="#2A9D8F" strokeWidth={1.5} />
            <Text className="text-xl font-semibold text-primary mt-4 mb-2 text-center">
              Start the conversation
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Ask any agriculture-related question to get started.
            </Text>
          </View>
        }
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 10,
          flexGrow: 1,
          flexDirection: 'column-reverse'
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Thinking bubble when sending message */}
      {sendMessageMutation.isPending && (
        <View className="px-4 pb-2">
          <View className="mb-4 flex-row justify-start">
            <View className="w-8 h-8 absolute -top-3 z-10 -left-3 rounded-full bg-teal-100 justify-center items-center mr-2 mt-1">
              <Bot size={16} color="#2A9D8F" strokeWidth={2} />
            </View>
            <View className="max-w-[90%] pl-10 px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-md">
              <ThinkingBubble />
            </View>
          </View>
        </View>
      )}

      {/* Input Section */}
      <View className="bg-slate-100 dark:bg-gray-900 border-t border-slate-500/40 pb-safe">
        <View className="flex-row items-end rounded-full py-4 px-4">
          <TextInput
            className="flex-1 text-base text-primary max-h-24 pt-1 pb-1 pr-2"
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            multiline
            editable={!sendMessageMutation.isPending}
          />
          <TouchableOpacity
            className={`w-9 h-9 rounded-full justify-center items-center ml-1 ${
              input.trim() && !sendMessageMutation.isPending ? 'bg-brand-main' : 'bg-gray-400'
            }`}
            onPress={sendMessage}
            disabled={!input.trim() || sendMessageMutation.isPending}
          >
            <Send size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
