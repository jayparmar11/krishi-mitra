import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ArrowLeft, Send, Mic, Camera, Bot } from "lucide-react-native";
import { router } from "expo-router";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";

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
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! How can I help you today? You can ask me about weather, soil, pests, or market prices.",
      },
    ],
  });

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (error) {
    console.log("🚀 ~ ChatScreen ~ error:", error);
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
          <Text style={styles.errorSubText}>
            Please check your connection and try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#264653" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.role === "user"
                  ? styles.userMessageContainer
                  : styles.aiMessageContainer,
              ]}
            >
              {message.role !== "user" && (
                <View style={styles.aiAvatar}>
                  <Bot size={16} color="#2A9D8F" strokeWidth={2} />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.role === "user"
                    ? styles.userMessage
                    : styles.aiMessage,
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
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={input}
              // Replace onChangeText with the corrected onChange handler
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
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Mic size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Camera size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  input.trim()
                    ? styles.sendButtonActive
                    : styles.sendButtonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={!input.trim()}
              >
                <Send size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFDFD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#264653",
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F9F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#264653",
    maxHeight: 100,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 8,
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  actionButton: {
    padding: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
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
