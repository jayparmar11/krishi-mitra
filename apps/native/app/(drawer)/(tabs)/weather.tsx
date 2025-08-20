import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, MapPin, Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { orpc } from '@/utils/orpc';
import { useState } from 'react';
import * as Location from 'expo-location';

const HourlyForecast = ({
  time,
  temp,
  icon: IconComponent
}: {
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

const DailyForecast = ({
  day,
  icon: IconComponent,
  high,
  low,
  condition
}: {
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
  const { data: session, refetch } = authClient.useSession();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [cityInput, setCityInput] = useState<string>(session?.user?.city || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const updateLocationMutation = useMutation({
    mutationFn: ({ city }: { city: string }) => orpc.updateLocation.call({ city }),
    onSuccess: () => {
      refetch();
      setModalVisible(false);
    },
    onError: (err: any) => {
      setLocalError(err?.message || 'Failed to update location');
      Alert.alert('Error', err?.message || 'Failed to update location');
    }
  });

  const detectCity = async () => {
    setIsDetecting(true);
    setLocalError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocalError('Location permission denied. Please type your city manually.');
        setIsDetecting(false);
        return;
      }

      const locationPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Location request timed out')), 10000));

      const location = (await Promise.race([locationPromise, timeoutPromise])) as any;
      const geo = await Location.reverseGeocodeAsync(location.coords);

      if (geo && geo[0]?.city) {
        setCityInput(geo[0].city);
      } else {
        setLocalError('Could not detect city, please type manually.');
      }
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to detect city');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleChangeLocation = async () => {
    setLocalError(null);
    setCityInput(session?.user?.city || '');
    setModalVisible(true);
  };

  const handleSubmitLocation = async () => {
    if (!cityInput?.trim()) {
      setLocalError('City is required.');
      return;
    }

    try {
      await updateLocationMutation.mutateAsync({ city: cityInput.trim() });
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to update location');
    }
  };

  if (updateLocationMutation.isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2A9D8F" />
      </View>
    );
  }

  if (updateLocationMutation.isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load data</Text>
      </View>
    );
  }

  const hourlyData = [
    { time: 'Now', temp: 28, icon: Sun },
    { time: '1 PM', temp: 30, icon: Sun },
    { time: '2 PM', temp: 32, icon: Cloud },
    { time: '3 PM', temp: 31, icon: Cloud },
    { time: '4 PM', temp: 29, icon: CloudRain }
  ];

  const dailyData = [
    { day: 'Today', icon: Sun, high: 32, low: 21, condition: 'Clear Sky' },
    { day: 'Tuesday', icon: CloudRain, high: 8, low: 3, condition: 'Heavy Rain' },
    { day: 'Wednesday', icon: Cloud, high: 15, low: 8, condition: 'Cloudy' },
    { day: 'Thursday', icon: Sun, high: 25, low: 12, condition: 'Sunny' },
    { day: 'Friday', icon: Cloud, high: 22, low: 14, condition: 'Partly Cloudy' },
    { day: 'Saturday', icon: CloudRain, high: 18, low: 10, condition: 'Light Rain' },
    { day: 'Sunday', icon: Sun, high: 28, low: 16, condition: 'Clear Sky' }
  ];

  return (
    <View className="flex-1 bg-[#FCFDFD]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="bg-white rounded-t-2xl p-5"
            >
              <View className="flex-row items-center justify-between mb-4 gap-4">
                <Text className="text-lg font-semibold">Change Location</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="text-sm text-[#6B7280]">Close</Text>
                </TouchableOpacity>
              </View>

              {localError && (
                <View className="mb-3 p-3 bg-red-100 rounded-md">
                  <Text className="text-red-700 text-sm">{localError}</Text>
                </View>
              )}

              <TextInput
                className="mb-4 p-4 border border-green-600 rounded-md bg-white text-green-900"
                value={cityInput}
                onChangeText={setCityInput}
                placeholder="City"
                placeholderTextColor="#9CA3AF"
              />

              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 p-3 rounded-md bg-brand-main items-center"
                  onPress={handleSubmitLocation}
                  disabled={updateLocationMutation.isPending}
                >
                  {updateLocationMutation.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white">Save</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center p-3 rounded-md bg-white border border-green-600"
                  onPress={detectCity}
                  disabled={isDetecting}
                >
                  {isDetecting ? (
                    <ActivityIndicator color="#2A9D8F" />
                  ) : (
                    <MapPin size={18} color="#2A9D8F" strokeWidth={2} />
                  )}
                  <Text className="ml-2 text-[#2A9D8F]">Detect</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
        <View className="flex-row items-center px-5 py-4">
          <MapPin size={16} color="#6B7280" strokeWidth={2} />
          <Text className="text-sm text-[#6B7280] ml-1 flex-1">
            Location: {session?.user?.city || 'Unknown'}
          </Text>
          <TouchableOpacity
            onPress={handleChangeLocation}
            disabled={updateLocationMutation.isPending}
          >
            <Text className="text-sm text-[#2A9D8F] font-semibold">
              {updateLocationMutation.isPending ? 'Updating...' : 'Change'}
            </Text>
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
              <HourlyForecast key={index} time={item.time} temp={item.temp} icon={item.icon} />
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
