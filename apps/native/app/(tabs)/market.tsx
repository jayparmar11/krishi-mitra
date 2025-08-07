import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, ChevronDown, TrendingUp, TrendingDown, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

export default function MarketScreen() {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedMarket, setSelectedMarket] = useState('Khanna');
  const [showHistorical, setShowHistorical] = useState(false);

  const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Corn'];
  const markets = ['Khanna', 'Jagraon', 'Ludhiana', 'Rajpura', 'Samrala'];

  const historicalData = [
    { date: 'Aug 4', price: 2275 },
    { date: 'Aug 3', price: 2250 },
    { date: 'Aug 2', price: 2230 },
    { date: 'Aug 1', price: 2200 },
    { date: 'Jul 31', price: 2180 },
    { date: 'Jul 30', price: 2160 },
    { date: 'Jul 29', price: 2140 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#264653" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mandi Prices</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Crop</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedCrop}</Text>
                <ChevronDown size={16} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Market</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedMarket}</Text>
                <ChevronDown size={16} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.cropName}>Wheat (Sona)</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>₹ 2,275</Text>
            <Text style={styles.priceUnit}>/ Quintal</Text>
          </View>
          
          <View style={styles.priceChangeContainer}>
            <TrendingUp size={16} color="#10B981" strokeWidth={2} />
            <Text style={styles.priceChange}>+₹25</Text>
            <Text style={styles.priceChangeText}>from yesterday</Text>
          </View>
          
          <View style={styles.priceMetadata}>
            <View style={styles.metadataRow}>
              <Calendar size={14} color="#6B7280" strokeWidth={2} />
              <Text style={styles.metadataText}>Last updated: 4 Aug 2025, 11:00 AM</Text>
            </View>
            <Text style={styles.sourceText}>Source: Punjab Mandi Board</Text>
          </View>
        </View>

        <View style={styles.historicalSection}>
          <View style={styles.historicalHeader}>
            <TouchableOpacity
              style={[styles.toggleButton, !showHistorical && styles.toggleButtonActive]}
              onPress={() => setShowHistorical(false)}
            >
              <Text style={[styles.toggleText, !showHistorical && styles.toggleTextActive]}>
                Current
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, showHistorical && styles.toggleButtonActive]}
              onPress={() => setShowHistorical(true)}
            >
              <Text style={[styles.toggleText, showHistorical && styles.toggleTextActive]}>
                Last 7 Days
              </Text>
            </TouchableOpacity>
          </View>

          {showHistorical && (
            <View style={styles.historicalData}>
              <Text style={styles.historicalTitle}>Price Trend - {selectedCrop}</Text>
              {historicalData.map((item, index) => {
                const prevPrice = index < historicalData.length - 1 ? historicalData[index + 1].price : item.price;
                const change = item.price - prevPrice;
                const isPositive = change > 0;
                
                return (
                  <View key={index} style={styles.historicalItem}>
                    <Text style={styles.historicalDate}>{item.date}</Text>
                    <Text style={styles.historicalPrice}>₹ {item.price}</Text>
                    {change !== 0 && (
                      <View style={styles.historicalChange}>
                        {isPositive ? (
                          <TrendingUp size={12} color="#10B981" strokeWidth={2} />
                        ) : (
                          <TrendingDown size={12} color="#EF4444" strokeWidth={2} />
                        )}
                        <Text style={[
                          styles.historicalChangeText,
                          { color: isPositive ? '#10B981' : '#EF4444' }
                        ]}>
                          {isPositive ? '+' : ''}₹{Math.abs(change)}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Market Insights</Text>
          <Text style={styles.insightsText}>
            Wheat prices in Khanna mandi have shown a positive trend this week. 
            The recent rainfall in the region may affect supply, potentially driving prices higher. 
            Consider selling within the next 2-3 days if you have ready stock.
          </Text>
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
  filtersContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 16,
    color: '#264653',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
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
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  priceUnit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  priceChangeText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  priceMetadata: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  sourceText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  historicalSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  historicalHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#264653',
  },
  historicalData: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historicalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 16,
  },
  historicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historicalDate: {
    fontSize: 14,
    color: '#6B7280',
    width: 60,
  },
  historicalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
    flex: 1,
    marginLeft: 16,
  },
  historicalChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historicalChangeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  insightsCard: {
    backgroundColor: '#F0F9F7',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});