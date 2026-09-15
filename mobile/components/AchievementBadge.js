import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';

export default function AchievementBadge({ achievement }) {
  return (
    <View style={[styles.card, !achievement.earned && styles.locked]}>
      <Text style={styles.icon}>{achievement.earned ? '🏅' : '🔒'}</Text>
      <Text style={styles.title}>{achievement.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{achievement.description}</Text>
      <Text style={styles.status}>{achievement.earned ? 'Unlocked' : 'Locked'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  locked: {
    opacity: 0.7,
    backgroundColor: '#E5E7EB',
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.ink,
    textAlign: 'center',
  },
  description: {
    marginTop: 4,
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    minHeight: 30,
  },
  status: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.purple,
  },
});
