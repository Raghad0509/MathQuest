import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function RewardStars({ count = 3 }) {
  const scales = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = scales.map((scale, index) =>
      Animated.timing(scale, {
        toValue: index < count ? 1 : 0.25,
        duration: 350,
        delay: index * 120,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  }, [count, scales]);

  return (
    <View style={styles.row}>
      {scales.map((scale, index) => (
        <Animated.Text
          key={index}
          style={[styles.star, { transform: [{ scale }] }]}
        >
          ⭐
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 6,
  },
});
