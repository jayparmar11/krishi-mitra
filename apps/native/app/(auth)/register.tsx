import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { authClient } from '@/lib/auth-client';
import { orpc, queryClient } from '@/utils/orpc';
import { Leaf, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const detectCity = async () => {
    setIsDetecting(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please type your city manually.');
        setIsDetecting(false);
        return;
      }

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Location request timed out')), 10000),
      );

      const location = (await Promise.race([locationPromise, timeoutPromise])) as any;
      const geo = await Location.reverseGeocodeAsync(location.coords);

      if (geo && geo[0]?.city) {
        setCity(geo[0].city);
      } else {
        setError('Could not detect city, please type manually.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to detect city');
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    detectCity();
  }, []);

  const handleSignUp = async () => {
  if (!city.trim()) {
    setError('City is required. Please detect or type manually.');
    return;
  }

  setIsLoading(true);
  setError(null);

  await authClient.signUp.email(
    {
      name,
      email,
      password,
      city
    },
    {
      onError: (error) => {
        setError(error.error?.message || 'Failed to sign up');
        setIsLoading(false);
      },
      onSuccess: () => {
        setIsLoading(false);
        setName('');
        setEmail('');
        setPassword('');
        setCity('');
        queryClient.refetchQueries();
        router.push('/(auth)/login');
      },
      onFinished: () => setIsLoading(false),
    },
  );
};

  return (
    <KeyboardAvoidingView className="flex-1 bg-green-50" behavior={'padding'}>
      <View className="flex-1 justify-end px-6 pb-20">
        <View className="items-center pb-10 mb-10">
          <View className="w-16 h-16 rounded-full bg-green-100 justify-center items-center mb-5">
            <Leaf size={32} color="#2A9D8F" strokeWidth={2} />
          </View>
          <Text className="text-2xl font-bold text-green-900 mb-2 text-center">
            Create an Account
          </Text>
          <Text className="text-base text-green-700 text-center">
            Sign up to get started
          </Text>
        </View>

        <View className="mb-10">
          {error && (
            <View className="mb-4 p-3 bg-red-100 rounded-md">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          <TextInput
            className="mb-4 p-4 border border-green-600 rounded-md bg-white text-green-900"
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            className="mb-4 p-4 border border-green-600 rounded-md bg-white text-green-900"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            className="mb-6 p-4 border border-green-600 rounded-md bg-white text-green-900"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />

          <View className="mb-4 relative">
            <TextInput
              className="p-4 border border-green-600 rounded-md bg-white text-green-900 pr-12"
              value={city}
              onChangeText={setCity}
              placeholder="City (required)"
              editable={!isDetecting}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onPress={detectCity}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <ActivityIndicator size="small" color="#2A9D8F" />
              ) : (
                <MapPin size={22} color="#2A9D8F" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`p-4 rounded-md flex-row justify-center items-center ${
              isLoading ? 'bg-green-300' : 'bg-brand-main'
            }`}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-medium">Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="mt-4"
        >
          <Text className="text-center text-green-700 underline">
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
