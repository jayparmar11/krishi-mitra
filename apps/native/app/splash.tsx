import { useEffect } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Leaf } from 'lucide-react-native';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
      className="flex-1 w-full h-full"
      blurRadius={2}
    >
      <View className="flex-1 bg-teal-600/80 justify-center items-center">
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-white/20 justify-center items-center mb-5 border-2 border-white">
            <Leaf size={48} color="#FCFDFD" strokeWidth={2} />
          </View>
          <Text className="text-4xl font-bold text-white mb-2 text-center">Krishi Mitra</Text>
          <Text className="text-lg text-white text-center opacity-90">Your Trusted Farming Partner</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

// ...existing code...