import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';
import { WORLD_BACKDROPS } from '../constants/gameData';

export default function LevelNode({ level, unlocked, completed, onPress }) {
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!unlocked || completed) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [completed, glow, unlocked]);

  const icon = WORLD_BACKDROPS[level.world] || '🗺️';

  return (
    <Pressable onPress={onPress} disabled={!unlocked} style={styles.nodeWrap}>
      <Animated.View
        style={[
          styles.node,
          !unlocked && styles.locked,
          completed && styles.completed,
          unlocked && !completed && { opacity: glow },
        ]}
      >
        <Text style={styles.icon}>{completed ? '⭐' : icon}</Text>
      </Animated.View>
      <Text style={[styles.name, !unlocked && styles.lockedText]} numberOfLines={2}>
        {level.name}
      </Text>
      {!unlocked ? <View style={styles.lockBadge}><Text style={styles.lockBadgeText}>🔒</Text></View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nodeWrap: {
    alignItems: 'center',
    width: 120,
  },
  node: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brightYellow,
    borderWidth: 4,
    borderColor: COLORS.white,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  completed: {
    backgroundColor: COLORS.emerald,
  },
  locked: {
    backgroundColor: COLORS.lockGray,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.ink,
  },
  lockedText: {
    color: '#6B7280',
  },
  lockBadge: {
    position: 'absolute',
    right: 10,
    top: -2,
  },
  lockBadgeText: {
    fontSize: 16,
  },
});
