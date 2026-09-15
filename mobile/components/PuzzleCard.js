import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';

export default function PuzzleCard({ questionText }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Math Puzzle</Text>
      <Text style={styles.question}>{questionText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.oceanBlue,
  },
  question: {
    marginTop: 10,
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.ink,
    textAlign: 'center',
  },
});
