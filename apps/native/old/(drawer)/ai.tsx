import { useRef, useEffect, useState, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { Ionicons } from "@expo/vector-icons";
import { Container } from "@/components/container";

// Utility function to generate API URLs
const generateAPIUrl = (relativePath: string) => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error(
      "EXPO_PUBLIC_SERVER_URL environment variable is not defined"
    );
  }

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return serverUrl.concat(path);
};

const MessageItem = memo(({ message }: { message: { role: string; content: string } }) => (
  <View
    style={[
      styles.messageContainer,
      message.role === "user"
        ? styles.userMessageContainer
        : styles.aiMessageContainer,
    ]}
  >
    <View
      style={[
        styles.messageBubble,
        message.role === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          message.role === "user"
            ? styles.userMessageText
            : styles.aiMessageText,
        ]}
      >
        {message.content}
      </Text>
    </View>
  </View>
));

export default function AIScreen() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/ai"),
    onError: (error) => console.error(error, "AI Chat Error"),
  });

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = () => {
    if (input.trim()) {
      handleSubmit();
    }
  };

  if (error) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-600 text-center text-lg mb-4">
            Error: {error.message}
          </Text>
          <Text className="text-gray-500 text-center">
            Please check your connection and try again.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem message={item} />}
        contentContainerStyle={styles.messagesContent}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={(text) =>
            handleInputChange({ target: { value: text } } as any)
          }
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            input.trim() ? styles.sendButtonActive : styles.sendButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFDFD",
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  aiMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: "#2A9D8F",
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  aiMessageText: {
    color: "#264653",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#264653",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#2A9D8F",
  },
  sendButtonDisabled: {
    backgroundColor: "#A3A3A3",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B91C1C",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
  },
});
