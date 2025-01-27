import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

const MapTab = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  // Sample data for markers
  const markers = [
    {
      id: 1,
      type: 'attraction',
      title: 'Landmark Site',
      coordinate: { latitude: 4.0511, longitude: 9.7679 },
      rating: 4.5,
      image: 'https://placeholder.com/attraction1.jpg'
    },
    // Add more markers as needed
  ];

  // Filter categories
  const filterCategories: {
    id: string;
    label: string;
    color: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  }[] = [
    { id: 'nature', label: 'Nature', color: 'bg-green-500', icon: 'nature' },
    { id: 'restaurants', label: 'Restaurants', color: 'bg-red-500', icon: 'restaurant' },
    { id: 'events', label: 'Events', color: 'bg-yellow-500', icon: 'event' },
    { id: 'hotels', label: 'Hotels', color: 'bg-blue-500', icon: 'hotel' },
    { id: 'shopping', label: 'Shopping', color: 'bg-purple-500', icon: 'shopping-cart' },
  ];

  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter(id => id !== filterId));
    } else {
      setSelectedFilters([...selectedFilters, filterId]);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const MarkerIcon = ({ type }: { type: string }) => {
    let iconName: keyof typeof MaterialIcons.glyphMap = 'location-on';
    switch (type) {
      case 'attraction':
        iconName = 'place';
        break;
      case 'event':
        iconName = 'event';
        break;
      case 'hotel':
        iconName = 'hotel';
        break;
      case 'restaurant':
        iconName = 'restaurant';
        break;
      default:
        iconName = 'location-on';
    }
    return <MaterialIcons name={iconName} size={24} color="#FF0000" />;
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Map Container */}
      <View className="flex-1">
        <MapView
          className="w-full h-full"
          initialRegion={{
            latitude: 4.0511,
            longitude: 9.7679,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
            >
              <View>
                <MarkerIcon type={marker.type} />
              </View>
            </Marker>
          ))}
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            >
              <MaterialIcons name="my-location" size={24} color="#4285F4" />
            </Marker>
          )}
        </MapView>

        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg"
        >
          <MaterialIcons 
            name="filter-list" 
            size={24} 
            color={isDarkMode ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>

        {/* Filter Panel */}
        {showFilters && (
          <View className="absolute top-16 right-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold dark:text-white">Filters</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text className="text-blue-500">Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filterCategories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => toggleFilter(category.id)}
                  className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                    selectedFilters.includes(category.id)
                      ? category.color
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <MaterialIcons 
                    name={category.icon} 
                    size={16} 
                    color={selectedFilters.includes(category.id) ? '#FFFFFF' : '#666666'} 
                  />
                  <Text
                    className={`ml-2 ${
                      selectedFilters.includes(category.id)
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Location Button */}
        <TouchableOpacity
          className="absolute bottom-8 right-4 bg-blue-500 rounded-full p-4 shadow-lg"
          onPress={getLocationAsync}
        >
          <MaterialIcons name="my-location" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MapTab;