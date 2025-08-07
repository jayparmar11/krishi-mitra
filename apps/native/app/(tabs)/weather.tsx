import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, MapPin, Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react-native';
import { router } from 'expo-router';

const HourlyForecast = ({ time, temp, icon: IconComponent }: {
  time: string;
  temp: number;
  icon: React.ElementType;
}) => (
  <View className="items-center bg-white py-4 px-3 mr-3 rounded-xl border border-[#E5E7EB] min-w-[70px]">
    <Text className="text-xs text-[#6B7280] mb-2">{time}</Text>
    <IconComponent size={24} color="#2A9D8F" strokeWidth={2} />
    <Text className="text-sm font-semibold text-[#264653] mt-2">{temp}°</Text>
  </View>
);

const DailyForecast = ({ day, icon: IconComponent, high, low, condition }: {
  day: string;
  icon: React.ElementType;
  high: number;
  low: number;
  condition: string;
}) => (
  <View className="flex-row items-center bg-white py-4 px-4 mb-2 rounded-xl border border-[#E5E7EB]">
    <Text className="text-base font-semibold text-[#264653] w-[80px]">{day}</Text>
    <IconComponent size={24} color="#2A9D8F" strokeWidth={2} />
    <View className="flex-row items-center ml-4 w-[60px]">
      <Text className="text-base font-bold text-[#264653]">{high}°</Text>
      <Text className="text-base text-[#6B7280] ml-2">{low}°</Text>
    </View>
    <Text className="text-sm text-[#6B7280] flex-1 ml-4">{condition}</Text>
  </View>
);

export default function WeatherScreen() {
  const hourlyData = [
    { time: 'Now', temp: 28, icon: Sun },
    { time: '1 PM', temp: 30, icon: Sun },
    { time: '2 PM', temp: 32, icon: Cloud },
    { time: '3 PM', temp: 31, icon: Cloud },
    { time: '4 PM', temp: 29, icon: CloudRain },
  ];

  const dailyData = [
    { day: 'Today', icon: Sun, high: 32, low: 21, condition: 'Clear Sky' },
    { day: 'Tuesday', icon: CloudRain, high: 8, low: 3, condition: 'Heavy Rain' },
    { day: 'Wednesday', icon: Cloud, high: 15, low: 8, condition: 'Cloudy' },
    { day: 'Thursday', icon: Sun, high: 25, low: 12, condition: 'Sunny' },
    { day: 'Friday', icon: Cloud, high: 22, low: 14, condition: 'Partly Cloudy' },
    { day: 'Saturday', icon: CloudRain, high: 18, low: 10, condition: 'Light Rain' },
    { day: 'Sunday', icon: Sun, high: 28, low: 16, condition: 'Clear Sky' },
  ];

  return (
    <View className="flex-1 bg-[#FCFDFD]">
      <View className="flex-row items-center px-5 pt-[50px] pb-4 bg-white border-b border-b-[#E5E7EB]">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={24} color="#264653" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-[#264653] text-center">Weather Forecast</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center px-5 py-4">
          <MapPin size={16} color="#6B7280" strokeWidth={2} />
          <Text className="text-sm text-[#6B7280] ml-1 flex-1">Location: Ludhiana, Punjab</Text>
          <TouchableOpacity>
            <Text className="text-sm text-[#2A9D8F] font-semibold">Change</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white mx-5 mb-6 rounded-2xl p-6 shadow border border-[#E5E7EB]">
          <View className="items-center mb-5">
            <View className="flex-row items-center mb-2">
              <Text className="text-5xl font-bold text-[#264653] mr-4">28°C</Text>
              <Sun size={64} color="#E9C46A" strokeWidth={2} />
            </View>
            <Text className="text-lg text-[#6B7280]">Clear Sky</Text>
          </View>
          <View className="flex-row justify-around">
            <View className="flex-row items-center">
              <Droplets size={16} color="#6B7280" strokeWidth={2} />
              <Text className="text-sm text-[#6B7280] ml-1">Humidity: 65%</Text>
            </View>
            <View className="flex-row items-center">
              <Wind size={16} color="#6B7280" strokeWidth={2} />
              <Text className="text-sm text-[#6B7280] ml-1">Wind: 10 km/h</Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-[#264653] px-5 mb-3">Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-5">
            {hourlyData.map((item, index) => (
              <HourlyForecast
                key={index}
                time={item.time}
                temp={item.temp}
                icon={item.icon}
              />
            ))}
          </ScrollView>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-[#264653] px-5 mb-3">7-Day Forecast</Text>
          <View className="px-5">
            {dailyData.map((item, index) => (
              <DailyForecast
                key={index}
                day={item.day}
                icon={item.icon}
                high={item.high}
                low={item.low}
                condition={item.condition}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

