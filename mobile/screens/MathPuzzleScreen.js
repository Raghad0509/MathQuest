import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import AnswerButton from '../components/AnswerButton';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import PuzzleCard from '../components/PuzzleCard';
import COLORS from '../constants/colors';
import { OBSTACLE_ICONS } from '../constants/gameData';
import { useGame } from '../context/GameContext';
import { getHint, getQuestion, submitAnswer } from '../services/gameService';

export default function MathPuzzleScreen({ route, navigation }) {
  const { currentSession, setCurrentSession, setLatestResult } = useGame();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionBundle, setQuestionBundle] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedOption, setEliminatedOption] = useState(null);
  const [hintMessage, setHintMessage] = useState('');

  const obstacle = route.params?.obstacle;

  useEffect(() => {
    const loadQuestion = async () => {
      if (!currentSession || !obstacle) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getQuestion(currentSession.id, obstacle.id);
        setQuestionBundle(data);
        setHintUsed(false);
        setEliminatedOption(null);
        setHintMessage('');
      } catch (error) {
        Alert.alert('Question Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [currentSession, obstacle]);

  const handleAnswer = async (selectedAnswer) => {
    if (!questionBundle?.question || !currentSession) return;

    setSubmitting(true);
    try {
      const result = await submitAnswer({
        session_id: currentSession.id,
        obstacle_id: obstacle.id,
        question_id: questionBundle.question.id,
        selected_answer: selectedAnswer,
      });

      setCurrentSession(result.session);
      setLatestResult(result);
      navigation.replace('Feedback', {
        obstacle,
        question: questionBundle.question,
        result,
      });
    } catch (error) {
      Alert.alert('Answer Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHint = async () => {
    if (!questionBundle?.question || !currentSession || hintUsed) return;

    setHintLoading(true);
    try {
      const hint = await getHint({
        session_id: currentSession.id,
        obstacle_id: obstacle.id,
        question_id: questionBundle.question.id,
      });
      setCurrentSession(hint.session);
      setEliminatedOption(hint.eliminated_option);
      setHintMessage(`${hint.hint_message} (-${hint.hint_cost} points)`);
      setHintUsed(true);
    } catch (error) {
      Alert.alert('Hint Unavailable', error.message);
    } finally {
      setHintLoading(false);
    }
  };

  if (loading || !questionBundle) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  const { question } = questionBundle;
  const options = [
    { label: 'A', value: question.option_a },
    { label: 'B', value: question.option_b },
    { label: 'C', value: question.option_c },
    { label: 'D', value: question.option_d },
  ].filter((option) => option.label !== eliminatedOption);

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>
        {OBSTACLE_ICONS[obstacle.obstacle_type]} Solve the puzzle to unlock the treasure!
      </Text>
      <PuzzleCard questionText={question.question_text} />
      <View style={styles.hintCard}>
        <Text style={styles.pointsText}>Points: {currentSession?.score ?? 0}</Text>
        <PrimaryButton
          title={hintLoading ? 'Using Hint...' : 'Use Hint (-5 points)'}
          color={COLORS.skyBlue}
          onPress={handleHint}
          disabled={hintLoading || submitting || hintUsed}
        />
        {hintMessage ? <Text style={styles.hintText}>{hintMessage}</Text> : null}
      </View>

      <View style={styles.optionsWrap}>
        {options.map((option) => (
          <AnswerButton
            key={option.label}
            label={option.label}
            value={option.value}
            onPress={handleAnswer}
            disabled={submitting}
          />
        ))}
      </View>

      <View style={styles.timerCard}>
        <ProgressBar value={80} label="Puzzle Energy" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6D8',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6D8',
  },
  topText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 14,
  },
  optionsWrap: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hintCard: {
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.ink,
  },
  hintText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.oceanBlue,
  },
  timerCard: {
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
  },
});
