import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';

export default function StatCard({ title, value, accent = COLORS.emerald }) {
  return (
    <View style={styles.card}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  value: {
    marginTop: 6,
    fontSize: 24,
    color: COLORS.ink,
    fontWeight: '800',
  },
});
