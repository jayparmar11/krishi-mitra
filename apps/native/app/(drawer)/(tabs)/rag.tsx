import { fetch as expoFetch } from 'expo/fetch';
import { Bot, Mic, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, Linking } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { AutoScrollFlatList } from 'react-native-autoscroll-flatlist';

// Utility function to generate API URLs from ai.tsx
const generateAPIUrl = (relativePath: string) => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error('EXPO_PUBLIC_SERVER_URL environment variable is not defined');
  }

  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return serverUrl.concat(path);
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: 'user' | 'assistant'; content: string }>
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const flatListRef = useRef<any>(null);

  // start with empty conversation; show showcase UI when messages is empty
  useEffect(() => {
    setMessages([]);
  }, []);

  const examplePrompts = [
    'Which seeds work best for monsoon planting in Gujarat?',
    'How to prevent common pests in tomato crops?',
    'What is the current market price trend for wheat?'
  ];

  const handleExamplePrompt = (prompt: string) => {
    if (mutation.isPending) return;
    // setInput(prompt);
    // trigger immediately
    mutation.mutate({ query: prompt });
  };

  const queryClient = useQueryClient();

  const postRag = async (query: string) => {
    const res = (await expoFetch(generateAPIUrl('/rag'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })) as unknown as Response;

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} ${text}`);
    }

    const json = await res.json();
    return json?.response ?? json;
  };

  const extractAssistantText = (data: any): string => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      const first = data[0];
      if (typeof first === 'string') return first;
      if (first.output && String(first.output).trim()) return String(first.output);
      if (first.text && String(first.text).trim()) return String(first.text);
      if (first.response) return extractAssistantText(first.response);
      // fallback: join any string fields
      const texts = data.map((d) => extractAssistantText(d)).filter(Boolean);
      return texts.join('\n\n');
    }
    if (typeof data === 'object') {
      if (data.output && String(data.output).trim()) return String(data.output);
      if (data.text && String(data.text).trim()) return String(data.text);
      if (data.response) return extractAssistantText(data.response);
      if (data.message?.content) return String(data.message.content);
      if (data.choices && Array.isArray(data.choices) && data.choices.length) {
        const c = data.choices[0];
        return extractAssistantText(c.text ?? c.message?.content ?? c.output ?? c);
      }
      // last resort: find first string value in object
      for (const k of Object.keys(data)) {
        const v = (data as any)[k];
        if (typeof v === 'string' && v.trim()) return v;
      }
      return '';
    }
    return String(data);
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

    return (
      <Text className="text-base leading-6 text-primary">Thinking{dots}</Text>
    );
  };

  const mutation = useMutation({
    mutationFn: ({ query }: { query: string }) => postRag(query),
    onMutate: async (variables) => {
      setError(null);
      const optimisticMessage = {
        id: `u-${Date.now()}-${Math.random()}`,
        role: 'user' as const,
        content: variables.query
      };
      setMessages((m) => [...m, optimisticMessage]);
      return { optimisticMessage };
    },
    onSuccess: (data, variables, context: any) => {
      const content = extractAssistantText(data);
      const assistantMessage = {
        id: `a-${Date.now()}-${Math.random()}`,
        role: 'assistant' as const,
        content: content || 'Sorry, I could not parse the response.'
      };
      setMessages((m) => [...m, assistantMessage]);
      setTimeout(() => flatListRef.current?.scrollToEnd?.(), 100);
    },
    onError: (err: any, variables, context) => {
      setError(err instanceof Error ? err : new Error(String(err)));
    },
    onSettled: () => {
      // future: invalidate queries if needed
    }
  });

  const sendQuery = () => {
    const trimmed = input.trim();
    if (!trimmed || mutation.isPending) return;
    setInput('');
    mutation.mutate({ query: trimmed });
  };

  if (error) {
    return (
      <View className="flex-1 bg-[#FCFDFD]">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-lg font-bold text-red-700 text-center mb-2">
            Error: {error.message}
          </Text>
          <Text className="text-base text-gray-600 text-center">
            Please check your connection and try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView behavior="padding" className="flex-1 pb-safe" keyboardVerticalOffset={100}>
        <AutoScrollFlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item: message }) => (
            <View
              key={message.id}
              className={`mb-4 flex-row ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
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
                    : 'bg-white border border-gray-200 rounded-bl-md'
                }`}
              >
                {message.role === 'user' ? (
                  <Text className="text-base leading-6 text-white">{message.content}</Text>
                ) : (
                  <Markdown
                    onLinkPress={(url: string | undefined) => {
                      if (!url) return;
                      Linking.openURL(url);
                    }}
                    style={{ body: { color: '#0f766e', fontSize: 16, lineHeight: 22 } }}
                  >
                    {message.content}
                  </Markdown>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20 px-6">
              <Text className="text-2xl font-semibold text-primary mb-3 text-center">Krishi Mitra — Your AI Friend 😃</Text>
              <Text className="text-base text-gray-600 text-center mb-6">Ask agriculture-specific questions and get grounded answers with sources.</Text>
              <View className="w-full">
                {examplePrompts.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => handleExamplePrompt(p)}
                    className="bg-white border border-gray-200 rounded-xl py-3 px-4 mb-3"
                  >
                    <Text className="text-base text-primary">{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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

        {mutation.isPending && (
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

        <View className="bg-slate-100 dark:bg-slate-900 border-t border-l border-r border-gray-200 rounded-t-xl">
          <View className="flex-row items-end rounded-full py-4 px-4">
            <TextInput
              className="flex-1 text-base text-primary  max-h-24 pt-1 pb-1 pr-2"
              value={input}
              onChangeText={(text) => setInput(text)}
              placeholder="Type or speak your question..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <View className="flex-row items-center h-10">
              <TouchableOpacity className="p-2">
                <Mic size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                className={`w-9 h-9 rounded-full justify-center items-center ml-1 ${
                  input.trim() ? 'bg-brand-main' : 'bg-gray-400'
                }`}
                onPress={() => sendQuery()}
                disabled={!input.trim() || mutation.isPending}
              >
                <Send size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
