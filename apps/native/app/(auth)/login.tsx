import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/utils/orpc';
import { Leaf } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { tailwindColors } from '@/utils/tailwindTheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || 'Failed to sign in');
          setIsLoading(false);
        },
        onSuccess: () => {
          setIsLoading(false);
          setEmail('');
          setPassword('');
          queryClient.refetchQueries();
          router.push('/(tabs)');
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-green-50" 
      behavior={'padding'}
    >
      <View className="flex-1 justify-end px-6 pb-20">
        <View className="items-center mb-10 pb-10">
          <View className="w-16 h-16 rounded-full bg-green-100 justify-center items-center mb-5">
            <Leaf size={32} color={tailwindColors?.brand?.main} strokeWidth={2} />
          </View>
          <Text className="text-2xl font-bold text-green-900 mb-2 text-center">Welcome to Krishi Mitra</Text>
          <Text className="text-base text-green-700 text-center">Enter your credentials to log in</Text>
        </View>

        <View className="mb-10">
          {error && (
            <View className="mb-4 p-3 bg-red-100 rounded-md">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

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

          <TouchableOpacity
            className={`p-4 rounded-md flex-row justify-center items-center bg-brand-main`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-medium">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} className="mt-4">
          <Text className="text-center text-brand-main underline">Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}