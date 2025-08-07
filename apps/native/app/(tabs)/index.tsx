import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Cloud, TrendingUp, Building, Mic, Globe } from 'lucide-react-native';

const FeatureCard = ({ title, subtitle, icon, onPress, backgroundColor = '#FFFFFF' }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
}) => (
  <TouchableOpacity
    className={`w-[48%] bg-white rounded-2xl p-5 mb-4 items-center shadow-sm border border-gray-200 ${backgroundColor !== '#FFFFFF' ? '' : ''}`}
    style={backgroundColor !== '#FFFFFF' ? { backgroundColor } : undefined}
    onPress={onPress}
  >
    <View className="w-14 h-14 rounded-full bg-teal-50 justify-center items-center mb-3">
      {icon}
    </View>
    <Text className="text-base font-bold text-primary text-center mb-1">{title}</Text>
    <Text className="text-xs text-gray-500 text-center leading-4">{subtitle}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#FCFDFD]">
      <View className="flex-row justify-between items-center px-5 pt-12 pb-5 bg-white border-b border-gray-200">
        <View className="flex-1">
          <Text className="text-xl font-bold text-primary">Hello, Farmer!</Text>
        </View>
        <TouchableOpacity className="flex-row items-center px-3 py-2 bg-teal-50 rounded-full">
          <Globe size={20} color="#264653" />
          <Text className="text-sm font-semibold text-primary ml-1">En</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between pt-5">
          <FeatureCard
            title="Ask Me Anything"
            subtitle="Crop advice, finance, policies"
            icon={<MessageCircle size={32} color="#2A9D8F" strokeWidth={2} />}
            onPress={() => router.push('/chat')}
          />
          <FeatureCard
            title="Weather"
            subtitle="Ludhiana: 28°C, Clear Sky"
            icon={<Cloud size={32} color="#2A9D8F" strokeWidth={2} />}
            onPress={() => router.push('/weather')}
          />
          <FeatureCard
            title="Mandi Rates"
            subtitle="Check latest crop prices"
            icon={<TrendingUp size={32} color="#2A9D8F" strokeWidth={2} />}
            onPress={() => router.push('/market')}
          />
          <FeatureCard
            title="Govt. Schemes"
            subtitle="Find subsidies and support"
            icon={<Building size={32} color="#2A9D8F" strokeWidth={2} />}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}