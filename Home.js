import React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen({ route }) {
  const { username } = route.params;

  return (
    <View>
      <Text>Welcome, {username}!</Text>
    </View>
  );
}