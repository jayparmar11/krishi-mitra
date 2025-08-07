import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, MapPin, Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react-native';
import { router } from 'expo-router';

const HourlyForecast = ({ time, temp, icon: IconComponent }:{
  time: string;
  temp: number;
  icon: React.ElementType;
}) => (
  <View style={styles.hourlyItem}>
    <Text style={styles.hourlyTime}>{time}</Text>
    <IconComponent size={24} color="#2A9D8F" strokeWidth={2} />
    <Text style={styles.hourlyTemp}>{temp}°</Text>
  </View>
);

const DailyForecast = ({ day, icon: IconComponent, high, low, condition }:{
  day: string;
  icon: React.ElementType;
  high: number;
  low: number;
  condition: string;
}) => (
  <View style={styles.dailyItem}>
    <Text style={styles.dailyDay}>{day}</Text>
    <IconComponent size={24} color="#2A9D8F" strokeWidth={2} />
    <View style={styles.dailyTemps}>
      <Text style={styles.dailyHigh}>{high}°</Text>
      <Text style={styles.dailyLow}>{low}°</Text>
    </View>
    <Text style={styles.dailyCondition}>{condition}</Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#264653" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weather Forecast</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.locationText}>Location: Ludhiana, Punjab</Text>
          <TouchableOpacity>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.currentWeatherCard}>
          <View style={styles.currentWeatherMain}>
            <View style={styles.currentTempContainer}>
              <Text style={styles.currentTemp}>28°C</Text>
              <Sun size={64} color="#E9C46A" strokeWidth={2} />
            </View>
            <Text style={styles.currentCondition}>Clear Sky</Text>
          </View>
          
          <View style={styles.currentDetails}>
            <View style={styles.detailItem}>
              <Droplets size={16} color="#6B7280" strokeWidth={2} />
              <Text style={styles.detailText}>Humidity: 65%</Text>
            </View>
            <View style={styles.detailItem}>
              <Wind size={16} color="#6B7280" strokeWidth={2} />
              <Text style={styles.detailText}>Wind: 10 km/h</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyContainer}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <View style={styles.dailyContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFDFD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#264653',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  changeLink: {
    fontSize: 14,
    color: '#2A9D8F',
    fontWeight: '600',
  },
  currentWeatherCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
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
  currentWeatherMain: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#264653',
    marginRight: 16,
  },
  currentCondition: {
    fontSize: 18,
    color: '#6B7280',
  },
  currentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#264653',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  hourlyContainer: {
    paddingLeft: 20,
  },
  hourlyItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 70,
  },
  hourlyTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#264653',
    marginTop: 8,
  },
  dailyContainer: {
    paddingHorizontal: 20,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dailyDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
    width: 80,
  },
  dailyTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    width: 60,
  },
  dailyHigh: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#264653',
  },
  dailyLow: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  dailyCondition: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginLeft: 16,
  },
});