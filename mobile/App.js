import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './context/GameContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </GameProvider>
  );
}
