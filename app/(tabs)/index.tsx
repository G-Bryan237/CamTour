import { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Dimensions,
  FlatList,
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { Skeleton } from '@rneui/themed';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Type definitions
type Destination = {
  id: string;
  name: string;
  weather: string;
  isFavorite: boolean;
  image: any;
};

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
};

type TravelTip = {
  id: string;
  title: string;
  tip: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Data declarations
const featuredDestinations: Destination[] = [
  {
    id: '1',
    name: 'Mount Cameroon',
    weather: '22°C',
    isFavorite: false,
    image: require('@/assets/images/mount-cameroon.jpg'),
  },
  // ... rest of destinations
];

const categories: Category[] = [
  { 
    id: '1',
    name: 'Nature', 
    icon: 'leaf',
    color: '#4CAF50',
    description: 'Find serenity in nature'
  },
  // ... rest of categories
];

const travelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Best Time to Visit',
    tip: 'Visit between November and February for ideal weather conditions',
    icon: 'calendar',
  },
  // ... rest of travel tips
];

export default function Home() {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => 
    new Set(featuredDestinations
      .filter(d => d.isFavorite)
      .map(d => d.id)
    )
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => new Set(prev).add(id).delete(id) ? prev : new Set(prev));
  };

  const renderDestinationItem = ({ item }: { item: Destination }) => (
    <TouchableOpacity 
      className="mr-4 rounded-2xl overflow-hidden bg-white"
      style={{ width: SCREEN_WIDTH * 0.8, height: 200 }}
      onPress={() => router.push({
        pathname: '/destination/[id]',
        params: { id: item.id }
      })}
    >
      <Image
        source={item.image}
        className="w-full h-[120]"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-bold">{item.name}</Text>
            <Text className="text-gray-600">{item.weather}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Ionicons 
              name={favorites.has(item.id) ? "heart" : "heart-outline"} 
              size={24} 
              color="#FF4081" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      className="w-[30%] bg-white rounded-xl p-4 mb-4"
      onPress={() => router.push({
        pathname: '/category/[category]',
        params: { category: item.name.toLowerCase() }
      })}
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${item.color}20` }}
      >
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={item.color} 
        />
      </View>
      <Text className="font-medium">{item.name}</Text>
      <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-20 pb-4 px-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-lg text-gray-600">Welcome back,</Text>
            <Text className="text-2xl font-bold">User!</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-gray-200"
            onPress={() => router.push('/profile' as Href)}
          />
        </View>
        
        <TouchableOpacity 
          className={`flex-row bg-gray-100 rounded-full p-3 items-center ${
            isSearchFocused ? 'border-2 border-green-500' : ''
          }`}
          onPress={() => router.push('/search' as Href)}
        >
          <Ionicons name="search" size={20} color="gray" />
          <Text className="flex-1 ml-2 text-gray-500">
            Search destinations, guides, or events...
          </Text>
          <Ionicons name="mic" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Featured Destinations */}
        <View className="py-6">
          <View className="flex-row justify-between items-center px-4 mb-4">
            <Text className="text-xl font-bold">Featured Destinations</Text>
            <TouchableOpacity onPress={() => router.push('/all-destinations' as Href)}>
              <Text className="text-green-600">See All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={featuredDestinations}
              renderItem={renderDestinationItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          )}
        </View>

        {/* Categories */}
        <View className="px-4">
          <Text className="text-xl font-bold mb-4">Explore by Category</Text>
          <FlatList
            key="categories-3-columns"
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </View>

        {/* Travel Tips Section */}
        <View className="px-4 mb-6 mt-6">
          <Text className="text-xl font-bold mb-4">Travel Tips</Text>
          {travelTips.map(tip => (
            <View key={tip.id} className="bg-white p-4 rounded-xl mb-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name={tip.icon} size={20} color="#4CAF50" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-semibold">{tip.title}</Text>
                  <Text className="text-gray-600">{tip.tip}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}