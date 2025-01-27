import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const EventsTab = () => {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cultural', 'Music', 'Workshop', 'Sports'];

  // Updated sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Cultural Festival 2025',
      location: 'City Center',
      date: 'Jan 27',
      time: '10:00 AM',
      description: 'Join the largest cultural festival of the year!',
      attendees: 245,
      category: 'Cultural',
      image: require('../../assets/images/cultural.jpg')  // Fix path
    },
    {
      id: 2,
      title: 'Beach Concert Series',
      location: 'Beach Arena',
      date: 'Jan 28',
      time: '7:00 PM',
      description: 'An evening of local music and dance',
      attendees: 180,
      category: 'Music',
      image: require('../../assets/images/concert.jpg')   // Fix path
    }
  ];

  // Create marked dates object for calendar
  const markedDates = upcomingEvents.reduce((acc, event) => {
    // Convert date string to YYYY-MM-DD format
    const dateStr = '2025-01-' + event.date.split(' ')[1]; // Simple conversion for the example
    acc[dateStr] = { marked: true, dotColor: '#2563eb' };
    return acc;
  }, {});

  const filteredEvents = selectedCategory === 'All' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.category === selectedCategory);

  const EventCard = ({ event }) => (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
      onPress={() => {
        setSelectedEvent(event);
        setShowEventDetails(true);
      }}
    >
      <Image
        source={event.image}  // Remove the uri property
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800">{event.title}</Text>
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            <MaterialIcons name="calendar-today" size={16} color="#6b7280" />
            <Text className="ml-1 text-gray-600">{event.date}, {event.time}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="people" size={16} color="#6b7280" />
            <Text className="ml-1 text-gray-600">{event.attendees}</Text>
          </View>
        </View>
        <View className="flex-row items-center mt-2">
          <MaterialIcons name="location-on" size={16} color="#6b7280" />
          <Text className="ml-1 text-gray-600">{event.location}</Text>
        </View>
        <TouchableOpacity 
          className="bg-blue-500 py-2 rounded-full mt-3"
          onPress={() => {/* Handle attend */}}
        >
          <Text className="text-white text-center font-medium">Buy Ticket</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EventDetails = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEventDetails}
      onRequestClose={() => setShowEventDetails(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl overflow-hidden">
          <Image
            source={selectedEvent?.image}  // Remove the uri property
            className="w-full h-56"
            resizeMode="cover"
          />
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold">{selectedEvent?.title}</Text>
              <TouchableOpacity onPress={() => setShowEventDetails(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-96">
              <View className="space-y-4">
                <View className="flex-row items-center">
                  <MaterialIcons name="calendar-today" size={24} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">
                    {selectedEvent?.date}, {selectedEvent?.time}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="location-on" size={24} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{selectedEvent?.location}</Text>
                </View>
                <Text className="text-gray-800">{selectedEvent?.description}</Text>
                <View className="flex-row items-center">
                  <MaterialIcons name="people" size={24} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{selectedEvent?.attendees} people attending</Text>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity 
              className="bg-blue-500 py-4 rounded-full mt-4"
              onPress={() => {/* Handle attend */}}
            >
              <Text className="text-white text-center font-bold">Buy Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Add Calendar Modal component
  const CalendarModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCalendar}
      onRequestClose={() => setShowCalendar(false)}
    >
      <View className="flex-1 bg-black/50 justify-center">
        <View className="bg-white mx-4 rounded-xl overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Event Calendar</Text>
            <TouchableOpacity onPress={() => setShowCalendar(false)}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Calendar
            markedDates={markedDates}
            theme={{
              todayTextColor: '#2563eb',
              selectedDayBackgroundColor: '#2563eb',
              dotColor: '#2563eb'
            }}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold">Upcoming Events</Text>
      </View>

      {/* Categories Filter */}
      <View className="bg-white">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category 
                  ? 'bg-blue-500' 
                  : 'bg-gray-200'
              }`}
            >
              <Text className={`${
                selectedCategory === category 
                  ? 'text-white' 
                  : 'text-gray-800'
              } font-medium`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>

      {/* Floating Calendar Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
        onPress={() => setShowCalendar(true)}
      >
        <MaterialIcons name="calendar-today" size={24} color="white" />
      </TouchableOpacity>

      {/* Event Details Modal */}
      <EventDetails />

      {/* Calendar Modal */}
      <CalendarModal />
    </SafeAreaView>
  );
};

export default EventsTab;