import { View, Text, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Markdown from "react-native-markdown-display";
import newsItems from "./data";

export default function NewsDetail() {
  const params = useLocalSearchParams();
  const id = String(params.id || "");
  const post = newsItems.find((n) => n.id === id);

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 py-6 bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-primary mb-2">{post.title}</Text>
      <Text className="text-xs text-gray-500 mb-4">{post.date}</Text>
      <Markdown style={{ body: { color: '#111' } }}>{post.markdown}</Markdown>
    </ScrollView>
  );
}
