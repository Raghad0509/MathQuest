import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import RewardStars from '../components/RewardStars';
import TreasureChest from '../components/TreasureChest';
import COLORS from '../constants/colors';
import { useGame } from '../context/GameContext';
import { completeGame } from '../services/gameService';

export default function FeedbackScreen({ route, navigation }) {
  const { result, obstacle } = route.params;
  const { currentSession, selectedLevel, setStatistics, setCurrentSession } = useGame();
  const [completing, setCompleting] = useState(false);

  const handleContinue = async () => {
    if (!result.is_correct) {
      navigation.replace('MathPuzzle', { obstacle });
      return;
    }

    if (result.level_completed && currentSession) {
      setCompleting(true);
      try {
        const completionData = await completeGame(currentSession.id);
        setStatistics(completionData.statistics);
        setCurrentSession(completionData.session);
        navigation.replace('LevelComplete', { completionData, level: selectedLevel });
      } catch (error) {
        Alert.alert('Complete Error', error.message);
      } finally {
        setCompleting(false);
      }
      return;
    }

    navigation.replace('Level');
  };

  if (completing) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.emerald} />
      </View>
    );
  }

  return (
    <View style={[styles.container, result.is_correct ? styles.correctBg : styles.wrongBg]}>
      <Text style={styles.title}>{result.is_correct ? 'Great Job!' : 'Almost! Try again.'}</Text>
      <TreasureChest opened={result.is_correct} size={160} />

      {result.is_correct ? <RewardStars count={result.obstacle_solved ? 3 : 1} /> : null}

      {!result.is_correct ? (
        <Text style={styles.answerInfo}>Correct answer: {result.correct_answer}</Text>
      ) : (
        <Text style={styles.answerInfo}>Score: {result.session.score}</Text>
      )}

      <PrimaryButton
        title={result.is_correct ? 'Continue Adventure' : 'Retry Puzzle'}
        onPress={handleContinue}
        color={result.is_correct ? COLORS.emerald : COLORS.orange}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  correctBg: {
    backgroundColor: '#DDFBE7',
  },
  wrongBg: {
    backgroundColor: '#FFE1DA',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.ink,
    textAlign: 'center',
    marginBottom: 18,
  },
  answerInfo: {
    marginTop: 10,
    fontSize: 18,
    color: '#334155',
    fontWeight: '800',
  },
  button: {
    width: '100%',
    marginTop: 22,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDFBE7',
  },
});
