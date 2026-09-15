import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';

export default function ProgressBar({ value = 0, label }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
      <Text style={styles.percent}>{Math.round(clamped)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: COLORS.ink,
    marginBottom: 6,
    fontWeight: '700',
  },
  track: {
    width: '100%',
    height: 14,
    borderRadius: 999,
    backgroundColor: '#DCEEFF',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.emerald,
    borderRadius: 999,
  },
  percent: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.oceanBlue,
    fontWeight: '700',
  },
});
