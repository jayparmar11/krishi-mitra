import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
    <View className="flex-1 bg-[#FCFDFD]">
      <View className="flex-row items-center px-5 pt-[50px] pb-4 bg-white border-b border-b-[#E5E7EB]">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <ArrowLeft size={24} color="#264653" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-[#264653] text-center">Mandi Prices</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5 bg-white border-b border-b-[#E5E7EB]">
          <View className="flex-row justify-between">
            <View className="flex-1 mx-1">
              <Text className="text-base font-semibold text-[#264653] mb-2">Crop</Text>
              <TouchableOpacity className="flex-row items-center justify-between px-3 py-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <Text className="text-lg text-[#264653]">{selectedCrop}</Text>
                <ChevronDown size={16} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <View className="flex-1 mx-1">
              <Text className="text-base font-semibold text-[#264653] mb-2">Market</Text>
              <TouchableOpacity className="flex-row items-center justify-between px-3 py-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <Text className="text-lg text-[#264653]">{selectedMarket}</Text>
                <ChevronDown size={16} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="bg-white mx-5 mt-5 rounded-2xl p-6 shadow border border-[#E5E7EB]">
          <Text className="text-lg font-bold text-[#264653] mb-3">Wheat (Sona)</Text>
          <View className="flex-row items-baseline mb-3">
            <Text className="text-4xl font-bold text-[#2A9D8F]">₹ 2,275</Text>
            <Text className="text-lg text-[#6B7280] ml-2">/ Quintal</Text>
          </View>
          <View className="flex-row items-center mb-4">
            <TrendingUp size={16} color="#10B981" strokeWidth={2} />
            <Text className="text-lg font-semibold text-[#10B981] ml-1">+₹25</Text>
            <Text className="text-base text-[#6B7280] ml-2">from yesterday</Text>
          </View>
          <View className="border-t border-t-[#E5E7EB] pt-4">
            <View className="flex-row items-center mb-2">
              <Calendar size={14} color="#6B7280" strokeWidth={2} />
              <Text className="text-base text-[#6B7280] ml-1">Last updated: 4 Aug 2025, 11:00 AM</Text>
            </View>
            <Text className="text-xs text-[#9CA3AF] italic">Source: Punjab Mandi Board</Text>
          </View>
        </View>

        <View className="mx-5 mt-6">
          <View className="flex-row bg-[#F9FAFB] rounded-lg p-1 mb-4">
            <TouchableOpacity
              className={`flex-1 py-2 items-center rounded ${!showHistorical ? 'bg-white shadow' : ''}`}
              onPress={() => setShowHistorical(false)}
            >
              <Text className={`text-base font-semibold ${!showHistorical ? 'text-[#264653]' : 'text-[#6B7280]'}`}>
                Current
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 items-center rounded ${showHistorical ? 'bg-white shadow' : ''}`}
              onPress={() => setShowHistorical(true)}
            >
              <Text className={`text-base font-semibold ${showHistorical ? 'text-[#264653]' : 'text-[#6B7280]'}`}>
                Last 7 Days
              </Text>
            </TouchableOpacity>
          </View>

          {showHistorical && (
            <View className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <Text className="text-base font-bold text-[#264653] mb-4">Price Trend - {selectedCrop}</Text>
              {historicalData.map((item, index) => {
                const prevPrice = index < historicalData.length - 1 ? historicalData[index + 1].price : item.price;
                const change = item.price - prevPrice;
                const isPositive = change > 0;
                return (
                  <View key={index} className="flex-row items-center py-3 border-b border-b-[#F3F4F6]">
                    <Text className="text-base text-[#6B7280] w-[60px]">{item.date}</Text>
                    <Text className="text-lg font-semibold text-[#264653] flex-1 ml-4">₹ {item.price}</Text>
                    {change !== 0 && (
                      <View className="flex-row items-center">
                        {isPositive ? (
                          <TrendingUp size={12} color="#10B981" strokeWidth={2} />
                        ) : (
                          <TrendingDown size={12} color="#EF4444" strokeWidth={2} />
                        )}
                        <Text className={`text-xs font-semibold ml-1 ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{isPositive ? '+' : ''}₹{Math.abs(change)}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View className="bg-[#F0F9F7] mx-5 mt-6 mb-10 rounded-xl p-5 border border-[#D1FAE5]">
          <Text className="text-base font-bold text-[#264653] mb-2">Market Insights</Text>
          <Text className="text-base text-[#6B7280] leading-5">
            Wheat prices in Khanna mandi have shown a positive trend this week. 
            The recent rainfall in the region may affect supply, potentially driving prices higher. 
            Consider selling within the next 2-3 days if you have ready stock.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

