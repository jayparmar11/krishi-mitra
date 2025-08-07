import { Container } from "@/components/container";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { Bot, Mic, Send } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Utility function to generate API URLs from ai.tsx
const generateAPIUrl = (relativePath: string) => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error(
      "EXPO_PUBLIC_SERVER_URL environment variable is not defined"
    );
  }

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  console.log(serverUrl.concat(path));
  return serverUrl.concat(path);
};

export default function ChatScreen() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/ai"),
    onError: (error) => console.error(error, "AI Chat Error"),
    // Initial message from the original chat.tsx
    initialMessages: [],
  });

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd?.({ animated: true });
      flatListRef.current?.scrollToIndex?.({ index: messages.length - 1 });
    }
  }, [messages]);

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
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item: message }) => (
            <View
              className={`mb-4 flex-row ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role !== "user" && (
                <View className="w-8 h-8 rounded-full bg-teal-50 justify-center items-center mr-2 mt-1">
                  <Bot size={16} color="#2A9D8F" strokeWidth={2} />
                </View>
              )}
              <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary rounded-br-md"
                    : "bg-white border border-gray-200 rounded-bl-md"
                }`}
              >
                <Text
                  className={`text-base leading-6 ${
                    message.role === "user" ? "text-white" : "text-primary"
                  }`}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-lg font-semibold text-primary mb-2">
                Welcome to Krishi Mitra!
              </Text>
              <Text className="text-base text-gray-600 text-center mb-4">
                Ask me anything about agriculture, seeds, weather, or market.
                For example:
              </Text>
              <Text className="text-base text-gray-500 italic text-center">
                "How do I choose the best seeds for my farm?"
              </Text>
            </View>
          }
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 10,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        />
        <View className="px-5 py-2 bg-white border-t border-gray-200">
          <View className="flex-row items-end bg-gray-50 rounded-full px-3 py-2 border border-gray-200">
            <TextInput
              className="flex-1 text-base text-primary max-h-24 pt-1 pb-1 pr-2"
              value={input}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    value: e.nativeEvent.text,
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement>)
              }
              placeholder="Type or speak your question..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <View className="flex-row items-center h-10">
              <TouchableOpacity className="p-2">
                <Mic size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              {/* <TouchableOpacity className="p-2">
                <Camera size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity> */}
              <TouchableOpacity
                className={`w-9 h-9 rounded-full justify-center items-center ml-1 ${
                  input.trim() ? "bg-brand-main" : "bg-gray-400"
                }`}
                onPress={() => handleSubmit()}
                disabled={!input.trim()}
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
