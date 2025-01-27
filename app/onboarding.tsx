// app/onboarding.js
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const router = useRouter();
  
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold mb-4">Welcome to Explore Cameroon</Text>
      <TouchableOpacity 
        className="bg-green-600 rounded-full px-8 py-4"
        onPress={() => router.push('/(tabs)')}
      >
        <Text className="text-white font-semibold">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}