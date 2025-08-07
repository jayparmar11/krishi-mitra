import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Cloud, TrendingUp, Building, Mic, Globe } from 'lucide-react-native';

const FeatureCard = ({ title, subtitle, icon, onPress, backgroundColor = '#FFFFFF' }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
}) => (
  <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress}>
    <View style={styles.cardIcon}>
      {icon}
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello, Farmer!</Text>
        </View>
        <TouchableOpacity style={styles.languageToggle}>
          <Globe size={20} color="#264653" />
          <Text style={styles.languageText}>En</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
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

      <TouchableOpacity style={styles.fab}>
        <Mic size={24} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFDFD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#264653',
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F9F7',
    borderRadius: 20,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#264653',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F9F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#264653',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E9C46A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});