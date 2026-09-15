import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import RewardStars from '../components/RewardStars';
import COLORS from '../constants/colors';
import { useGame } from '../context/GameContext';

function scoreToStars(score) {
  if (score >= 110) return 3;
  if (score >= 70) return 2;
  return 1;
}

export default function LevelCompleteScreen({ route, navigation }) {
  const { completionData, level } = route.params || {};
  const { setCurrentSession } = useGame();

  const session = completionData?.session;
  const dailyStreak = completionData?.daily_streak;
  const stars = scoreToStars(session?.score || 0);

  const resetSession = () => setCurrentSession(null);

  return (
    <View style={styles.container}>
      <Text style={styles.banner}>Level Complete!</Text>
      <Text style={styles.levelName}>{level?.name || 'Adventure'}</Text>

      <RewardStars count={stars} />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Score: {session?.score || 0}</Text>
        <Text style={styles.summaryText}>Correct: {session?.correct_answers || 0}</Text>
        <Text style={styles.summaryText}>Wrong: {session?.wrong_answers || 0}</Text>
        <Text style={styles.summaryText}>Treasure Collected: {stars} chest(s)</Text>
        <Text style={styles.summaryText}>Daily Streak: {dailyStreak?.current_streak || 0} day(s)</Text>
        <Text style={styles.summaryText}>Streak Bonus: +{dailyStreak?.bonus_points || 0} points</Text>
      </View>

      <View style={styles.buttons}>
        <PrimaryButton
          title="Next Level"
          color={COLORS.emerald}
          onPress={() => {
            resetSession();
            navigation.navigate('AdventureMap');
          }}
        />
        <PrimaryButton
          title="Replay Level"
          color={COLORS.orange}
          onPress={() => {
            resetSession();
            navigation.replace('Level', { level });
          }}
        />
        <PrimaryButton
          title="Back to Map"
          color={COLORS.purple}
          onPress={() => {
            resetSession();
            navigation.navigate('AdventureMap');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  banner: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.ink,
  },
  levelName: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
  },
  summaryCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  buttons: {
    marginTop: 18,
    width: '100%',
    gap: 10,
  },
});
