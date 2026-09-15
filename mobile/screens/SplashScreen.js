import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('ProfileSelection');
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={[COLORS.skyBlue, '#8AE2FF', COLORS.emerald]} style={styles.container}>
      <Text style={styles.logo}>MathQuest</Text>
      <Text style={styles.subtitle}>Treasure Hunt Adventure</Text>
      <Text style={styles.character}>🧒 🗺️ 👧</Text>
      <Text style={styles.chest}>✨🧰✨</Text>
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={styles.loadingText}>Loading Adventure...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.white,
    textShadowColor: '#1D4ED8',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 20,
    color: '#FDFDFD',
    fontWeight: '700',
  },
  character: {
    marginTop: 46,
    fontSize: 52,
  },
  chest: {
    marginTop: 12,
    fontSize: 58,
  },
  loadingWrap: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
