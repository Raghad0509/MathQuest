import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';

export default function TreasureChest({ opened = false, size = 120 }) {
  const lidRotation = useRef(new Animated.Value(0)).current;
  const sparkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!opened) {
      lidRotation.setValue(0);
      sparkle.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(lidRotation, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkle, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, [lidRotation, opened, sparkle]);

  const lidStyle = {
    transform: [
      {
        rotate: lidRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-35deg'],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container, { width: size, height: size * 0.9 }]}>
      <Animated.Text style={[styles.sparkle, { opacity: sparkle }]}>✨ ✨</Animated.Text>
      <Animated.View style={[styles.lid, lidStyle]}>
        <Text style={styles.emoji}>🟨</Text>
      </Animated.View>
      <View style={styles.base}>
        <Text style={styles.emoji}>🧰</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sparkle: {
    position: 'absolute',
    top: 0,
    fontSize: 20,
    color: COLORS.brightYellow,
  },
  lid: {
    position: 'absolute',
    top: 14,
    zIndex: 2,
  },
  base: {
    marginBottom: 4,
  },
  emoji: {
    fontSize: 46,
  },
});
