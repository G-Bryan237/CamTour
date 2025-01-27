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
import { useRouter } from 'expo-router';
import { Skeleton } from '@rneui/themed'; // Add this import

const SCREEN_WIDTH = Dimensions.get('window').width;

// Move data declarations before component
const featuredDestinations = [
  {
    id: '1',
    name: 'Mount Cameroon',
    weather: '22°C',
    isFavorite: false,
    image: require('@/assets/images/mount-cameroon.jpg'),
  },
  {
    id: '2',
    name: 'Limbe Beach',
    weather: '28°C',
    isFavorite: true,
    image: require('@/assets/images/limbe.jpg'),
  },
  {
    id: '3',
    name: 'Korup National Park',
    weather: '25°C',
    isFavorite: false,
    image: require('@/assets/images/korup.jpg'),
  },
  {
    id: '4',
    name: 'Kribi Beach',
    weather: '29°C',
    isFavorite: false,
    image: require('@/assets/images/kribi.jpg'),
  },
  {
    id: '5',
    name: 'Lake Nyos',
    weather: '20°C',
    isFavorite: false,
    image: require('@/assets/images/nyos.jpg'),
  }
  // {
  //   id: '6',
  //   name: 'Dja Reserve',
  //   weather: '24°C',
  //   isFavorite: false,
  //   image: require('@/assets/images/dja.jpg'),
  // }
];

const categories = [
  { 
    id: '1',
    name: 'Nature', 
    icon: 'leaf',
    color: '#4CAF50',
    description: 'Find serenity in nature'
  },
  { 
    id: '2',
    name: 'History', 
    icon: 'time',
    color: '#FFC107',
    description: 'Discover our heritage'
  },
  { 
    id: '3',
    name: 'Culture', 
    icon: 'people',
    color: '#9C27B0',
    description: 'Experience traditions'
  },
  { 
    id: '4',
    name: 'Beaches', 
    icon: 'water',
    color: '#03A9F4',
    description: 'Relax by the ocean'
  },
  { 
    id: '5',
    name: 'Adventure', 
    icon: 'compass',
    color: '#FF5722',
    description: 'Seek thrilling experiences'
  },
  { 
    id: '6',
    name: 'Cuisine', 
    icon: 'restaurant',
    color: '#E91E63',
    description: 'Taste local flavors'
  },
];

// Remove upcomingEvents array
const travelTips = [
  {
    id: '1',
    title: 'Best Time to Visit',
    tip: 'Visit between November and February for ideal weather conditions',
    icon: 'calendar',
  },
  {
    id: '2',
    title: 'Local Transportation',
    tip: 'Use registered taxi services for safe travel around cities',
    icon: 'car',
  },
];

export default function Home() {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // Fix favorites initialization
  const [favorites, setFavorites] = useState(() => 
    new Set(featuredDestinations
      .filter(d => d.isFavorite)
      .map(d => d.id)
    )
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const renderDestinationItem = ({ item }: { item: typeof featuredDestinations[0] }) => (
    <TouchableOpacity 
      className="mr-4 rounded-2xl overflow-hidden bg-white"
      style={{ width: SCREEN_WIDTH * 0.8, height: 200 }}
      onPress={() => router.push(`/destination/${item.id}`)}
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

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      className="w-[30%] bg-white rounded-xl p-4 mb-4"
      onPress={() => router.push(`/category/${item.name.toLowerCase()}`)}
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

  const renderSkeletonLoader = () => (
    <View className="px-4">
      <Skeleton width={200} height={20} />
      <View className="flex-row mt-4">
        <Skeleton width={150} height={150} style={{ marginRight: 10 }} />
        <Skeleton width={150} height={150} />
      </View>
    </View>
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
            onPress={() => router.push('/profile')}
          />
        </View>
        
        <TouchableOpacity 
          className={`flex-row bg-gray-100 rounded-full p-3 items-center ${
            isSearchFocused ? 'border-2 border-green-500' : ''
          }`}
          onPress={() => router.push('/search')}
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
            <TouchableOpacity onPress={() => router.push('/all-destinations')}>
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