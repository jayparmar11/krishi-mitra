import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import {
  MessageCircle,
  Cloud,
  TrendingUp,
  Building,
  Mic,
  Globe,
} from "lucide-react-native";
import newsItems, { NewsItem } from "./news/data";

const FeatureCard = ({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
}) => (
  <TouchableOpacity
    className={`w-[48%] rounded-2xl p-5 mb-4 items-center shadow-sm border border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-800`}
    onPress={onPress}
  >
    <View className="w-14 h-14 rounded-full bg-teal-50 justify-center items-center mb-3">
      {icon}
    </View>
    <Text className="text-base font-bold text-primary text-center mb-1">
      {title}
    </Text>
    <Text className="text-xs text-gray-500 text-center leading-4">
      {subtitle}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-blue-50 dark:bg-black">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="pt-7 pb-2">
          <Text className="text-2xl font-bold text-primary text-center mb-1">
            Welcome to Krishi Mitra
          </Text>
          <Text className="text-base text-gray-500 text-center">
            Your AI-powered agriculture advisor
          </Text>
        </View>
        <View className="flex-row flex-wrap justify-between pt-5">
          <FeatureCard
            title="Ask Me Anything"
            subtitle="Crop advice, finance, policies"
            icon={<MessageCircle size={32} color="#2A9D8F" strokeWidth={2} />}
            onPress={() => router.push("/rag")}
          />
          <FeatureCard
            title="Weather"
            subtitle="Ludhiana: 28°C, Clear Sky"
            icon={<Cloud size={32} color="#2A9D8F" strokeWidth={2} />}
            onPress={() => router.push("/weather")}
          />
          <FeatureCard
            title="Govt. Schemes"
            subtitle="Find subsidies and support"
            icon={<Building size={32} color="#2A9D8F" strokeWidth={2} />}
            onPress={() => {}}
          />
        </View>
        <View className="pt-6">
          <Text className="text-lg font-bold text-primary mb-3">Updates & News</Text>
          <View className="gap-4 pb-8">
            {newsItems.map((item: NewsItem) => (
              <TouchableOpacity
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                onPress={() =>
                  router.push({
                    pathname: "(drawer)/(tabs)/news/[id]",
                    params: { id: item.id },
                  } as any)
                }
              >
                <Text className="text-sm font-semibold text-primary">{item.title}</Text>
                <Text className="text-xs text-gray-500 mt-1">{item.date}</Text>
                <Text className="text-xs text-gray-600 dark:text-gray-300 mt-2">{item.excerpt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
