import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AchievementsScreen from '../screens/AchievementsScreen';
import AdventureMapScreen from '../screens/AdventureMapScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import HomeScreen from '../screens/HomeScreen';
import LevelCompleteScreen from '../screens/LevelCompleteScreen';
import LevelScreen from '../screens/LevelScreen';
import MathPuzzleScreen from '../screens/MathPuzzleScreen';
import ProfileSelectionScreen from '../screens/ProfileSelectionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from '../screens/SplashScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import COLORS from '../constants/colors';

const Stack = createNativeStackNavigator();

function HomeButton({ navigation }) {
  return (
    <Pressable
      onPress={() => navigation.navigate('Home')}
      style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
    >
      <Text style={styles.homeButtonText}>Home</Text>
    </Pressable>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerBackTitleVisible: false,
        headerTintColor: COLORS.oceanBlue,
        headerStyle: {
          backgroundColor: '#F8FCFF',
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileSelection" component={ProfileSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AdventureMap"
        component={AdventureMapScreen}
        options={({ navigation }) => ({
          title: 'Adventure Map',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Level"
        component={LevelScreen}
        options={({ navigation }) => ({
          title: 'Level',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="MathPuzzle"
        component={MathPuzzleScreen}
        options={({ navigation }) => ({
          title: 'Math Puzzle',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={({ navigation }) => ({
          title: 'Feedback',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="LevelComplete"
        component={LevelCompleteScreen}
        options={({ navigation }) => ({
          title: 'Level Complete',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={({ navigation }) => ({
          title: 'Achievements',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={({ navigation }) => ({
          title: 'Statistics',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          title: 'Settings',
          headerRight: () => <HomeButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  homeButtonPressed: {
    opacity: 0.8,
  },
  homeButtonText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13,
  },
});
