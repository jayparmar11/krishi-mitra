import { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
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
      style={styles.background}
      blurRadius={2}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <View style={styles.iconWrapper}>
            <Leaf size={48} color="#FCFDFD" strokeWidth={2} />
          </View>
          <Text style={styles.appName}>Krishi Mitra</Text>
          <Text style={styles.tagline}>Your Trusted Farming Partner</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 157, 143, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252, 253, 253, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FCFDFD',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FCFDFD',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#FCFDFD',
    textAlign: 'center',
    opacity: 0.9,
  },
});