import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import COLORS from '../constants/colors';

export default function SettingsScreen() {
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Sound Effects</Text>
          <Switch value={soundOn} onValueChange={setSoundOn} trackColor={{ true: COLORS.emerald }} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Background Music</Text>
          <Switch value={musicOn} onValueChange={setMusicOn} trackColor={{ true: COLORS.emerald }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E6',
    paddingTop: 56,
    paddingHorizontal: 14,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.ink,
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
});
