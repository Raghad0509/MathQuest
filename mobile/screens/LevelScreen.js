import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import COLORS from '../constants/colors';
import { OBSTACLE_ICONS } from '../constants/gameData';
import { useGame } from '../context/GameContext';
import { completeGame, getNextObstacle, startGame } from '../services/gameService';

export default function LevelScreen({ route, navigation }) {
  const { selectedProfile, selectedLevel, setSelectedLevel, currentSession, setCurrentSession, setStatistics } = useGame();
  const [loading, setLoading] = useState(true);
  const [nextObstacle, setNextObstacle] = useState(null);
  const [remainingQuestions, setRemainingQuestions] = useState(0);
  const characterX = useRef(new Animated.Value(0)).current;

  const level = route.params?.level || selectedLevel;

  useEffect(() => {
    if (route.params?.level) {
      setSelectedLevel(route.params.level);
    }
  }, [route.params?.level, setSelectedLevel]);

  const loadSessionState = useCallback(async () => {
    if (!selectedProfile || !level) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let session = currentSession;
      if (!session || session.level !== level.id || session.completed) {
        session = await startGame(selectedProfile.id, level.id);
        setCurrentSession(session);
      }

      const obstacleData = await getNextObstacle(session.id);
      if (obstacleData.level_completed) {
        const completeData = await completeGame(session.id);
        setStatistics(completeData.statistics);
        navigation.replace('LevelComplete', { completionData: completeData, level });
        return;
      }

      setNextObstacle(obstacleData.next_obstacle);
      setRemainingQuestions(obstacleData.remaining_questions);
    } catch (error) {
      Alert.alert('Level Error', error.message);
    } finally {
      setLoading(false);
    }
  }, [currentSession, level, navigation, selectedProfile, setCurrentSession, setStatistics]);

  useFocusEffect(
    useCallback(() => {
      loadSessionState();
    }, [loadSessionState])
  );

  useEffect(() => {
    if (!level || !nextObstacle) return;

    const solved = nextObstacle.sequence_order - 1;
    const total = level.obstacles?.length || 4;
    const progressX = total > 1 ? (solved / (total - 1)) * 180 : 0;

    Animated.timing(characterX, {
      toValue: progressX,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, [characterX, level, nextObstacle]);

  if (!level) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No level selected.</Text>
      </View>
    );
  }

  if (loading || !currentSession) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.purple} />
      </View>
    );
  }

  const totalObstacles = level.obstacles?.length || 4;
  const solvedObstacles = nextObstacle ? nextObstacle.sequence_order - 1 : totalObstacles;
  const progressValue = (solvedObstacles / totalObstacles) * 100;
  const obstacleIcon = nextObstacle ? OBSTACLE_ICONS[nextObstacle.obstacle_type] : '🎉';
  const isMiniBoss = nextObstacle?.obstacle_type === 'mini_boss';

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.levelName}>{level.name}</Text>
        <Text style={styles.score}>Score: {currentSession.score}</Text>
        <ProgressBar value={progressValue} label={`Path Progress: ${solvedObstacles}/${totalObstacles}`} />
      </View>

      <View style={styles.pathArea}>
        <View style={styles.pathLine} />
        <Animated.Text style={[styles.character, { transform: [{ translateX: characterX }] }]}>🧒</Animated.Text>
        <View style={styles.obstacleCard}>
          <Text style={styles.obstacleIcon}>{obstacleIcon}</Text>
          <Text style={styles.obstacleName}>{nextObstacle?.obstacle_name || 'Path is clear!'}</Text>
          {isMiniBoss ? <Text style={styles.bossBadge}>MINI BOSS</Text> : null}
          <Text style={styles.obstacleHint}>Questions to unlock: {remainingQuestions}</Text>
        </View>
      </View>

      <View style={styles.bottomActions}>
        <PrimaryButton
          title="Hint"
          color={COLORS.skyBlue}
          onPress={() => Alert.alert('Hint', 'Hints are available in the puzzle screen and cost 5 points.')}
          style={styles.actionButton}
        />
        <PrimaryButton
          title="Solve Obstacle"
          color={COLORS.orange}
          onPress={() => navigation.navigate('MathPuzzle', { obstacle: nextObstacle })}
          disabled={!nextObstacle}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F8E6',
    padding: 16,
    paddingTop: 52,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F8E6',
  },
  infoText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
  },
  topCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
  },
  levelName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.ink,
  },
  score: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
  },
  pathArea: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#CFF5BD',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
  },
  pathLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 14,
    borderRadius: 10,
    backgroundColor: '#A1703F',
  },
  character: {
    fontSize: 38,
    position: 'absolute',
    left: 20,
    top: '46%',
    marginTop: -30,
  },
  obstacleCard: {
    marginLeft: 'auto',
    width: 170,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  obstacleIcon: {
    fontSize: 44,
  },
  obstacleName: {
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.ink,
  },
  obstacleHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  bossBadge: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.danger,
    letterSpacing: 0.6,
  },
  bottomActions: {
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    width: '100%',
  },
});
