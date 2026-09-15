import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';
import COLORS from '../constants/colors';
import { useGame } from '../context/GameContext';
import { getStatistics } from '../services/statisticsService';

export default function StatisticsScreen() {
  const { selectedProfile } = useGame();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!selectedProfile) return;
      try {
        const data = await getStatistics(selectedProfile.id);
        setStats(data);
      } catch (error) {
        Alert.alert('Statistics Error', error.message);
      }
    };

    load();
  }, [selectedProfile]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Adventure Stats</Text>

      <View style={styles.grid}>
        <StatCard title="Games Played" value={stats?.total_games || 0} accent={COLORS.skyBlue} />
        <StatCard title="Best Score" value={stats?.best_score || 0} accent={COLORS.orange} />
        <StatCard title="Accuracy" value={`${Math.round(stats?.accuracy_rate || 0)}%`} accent={COLORS.emerald} />
        <StatCard title="Levels Done" value={stats?.completed_levels || 0} accent={COLORS.purple} />
        <StatCard title="Current Streak" value={stats?.current_streak || 0} accent={COLORS.danger} />
        <StatCard title="Longest Streak" value={stats?.longest_streak || 0} accent={COLORS.oceanBlue} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Treasure Progress</Text>
        <ProgressBar value={Math.min(((stats?.completed_levels || 0) / 5) * 100, 100)} label="World Completion" />
        <Text style={styles.summaryText}>Total Score: {stats?.total_score || 0}</Text>
        <Text style={styles.summaryText}>Treasures Opened: {stats?.total_treasures_opened || 0}</Text>
        <Text style={styles.summaryText}>Last Adventure: {stats?.last_played_date || 'Not played yet'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDF5FF',
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
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  summaryCard: {
    marginTop: 14,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 8,
  },
  summaryText: {
    marginTop: 8,
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
  },
});
