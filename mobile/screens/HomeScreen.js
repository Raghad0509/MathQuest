import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import COLORS from '../constants/colors';
import { AVATAR_EMOJIS } from '../constants/gameData';
import { useGame } from '../context/GameContext';
import { getStatistics } from '../services/statisticsService';

export default function HomeScreen({ navigation }) {
  const {
    selectedProfile,
    setSelectedProfile,
    setSelectedLevel,
    setCurrentSession,
    statistics,
    setStatistics,
    setLatestResult,
  } = useGame();
  const [loadingStats, setLoadingStats] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadStats = async () => {
        if (!selectedProfile) return;
        setLoadingStats(true);
        try {
          const data = await getStatistics(selectedProfile.id);
          if (active) setStatistics(data);
        } catch {
          if (active) setStatistics(null);
        } finally {
          if (active) setLoadingStats(false);
        }
      };

      loadStats();
      return () => {
        active = false;
      };
    }, [selectedProfile, setStatistics])
  );

  if (!selectedProfile) {
    return null;
  }

  const avatarIcon = AVATAR_EMOJIS[selectedProfile.avatar] || AVATAR_EMOJIS.default;
  const progress = statistics ? Math.min((statistics.completed_levels / 5) * 100, 100) : 0;

  const handleSwitchProfile = () => {
    Alert.alert('Switch Profile', 'Do you want to choose a different explorer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Switch',
        style: 'destructive',
        onPress: () => {
          setCurrentSession(null);
          setSelectedLevel(null);
          setLatestResult(null);
          setStatistics(null);
          setSelectedProfile(null);
          navigation.reset({
            index: 0,
            routes: [{ name: 'ProfileSelection' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.avatar}>{avatarIcon}</Text>
        <View style={styles.playerInfo}>
          <Text style={styles.name}>{selectedProfile.name}</Text>
          <Text style={styles.smallText}>Stars: {statistics?.completed_levels || 0} ⭐</Text>
          <Text style={styles.smallText}>Treasure Points: {statistics?.total_score || 0} 💰</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <ProgressBar value={progress} label={loadingStats ? 'Updating progress...' : 'Adventure Progress'} />
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Start Adventure" color={COLORS.orange} onPress={() => navigation.navigate('AdventureMap')} style={styles.button} />
        <PrimaryButton title="Achievements" color={COLORS.emerald} onPress={() => navigation.navigate('Achievements')} style={styles.button} />
        <PrimaryButton title="Statistics" color={COLORS.skyBlue} onPress={() => navigation.navigate('Statistics')} style={styles.button} />
        <PrimaryButton title="Settings" color={COLORS.purple} onPress={() => navigation.navigate('Settings')} style={styles.button} />
        <PrimaryButton title="Switch Profile" color={COLORS.ink} onPress={handleSwitchProfile} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F8FF',
    paddingHorizontal: 16,
    paddingTop: 54,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 26,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    fontSize: 54,
    marginRight: 14,
  },
  playerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.ink,
  },
  smallText: {
    fontSize: 14,
    marginTop: 4,
    color: '#334155',
    fontWeight: '700',
  },
  progressCard: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
  },
  actions: {
    marginTop: 22,
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
