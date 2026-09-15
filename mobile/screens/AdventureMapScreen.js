import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LevelNode from '../components/LevelNode';
import COLORS from '../constants/colors';
import { useGame } from '../context/GameContext';
import { getLevels } from '../services/gameService';
import { getStatistics } from '../services/statisticsService';

const NODE_POSITIONS = [
  { top: 90, left: 24 },
  { top: 220, right: 24 },
  { top: 360, left: 30 },
  { top: 510, right: 28 },
  { top: 670, left: 90 },
];

export default function AdventureMapScreen({ navigation }) {
  const { selectedProfile, setSelectedLevel } = useGame();
  const [levels, setLevels] = useState([]);
  const [completedLevels, setCompletedLevels] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        try {
          const [levelData, statsData] = await Promise.all([
            getLevels(),
            selectedProfile ? getStatistics(selectedProfile.id) : Promise.resolve({ completed_levels: 0 }),
          ]);

          if (!active) return;
          setLevels(levelData);
          setCompletedLevels(statsData.completed_levels || 0);
        } catch (error) {
          if (active) {
            Alert.alert('Map Error', error.message);
          }
        }
      };

      load();
      return () => {
        active = false;
      };
    }, [selectedProfile])
  );

  const explorerIndex = useMemo(() => Math.min(completedLevels, Math.max(levels.length - 1, 0)), [completedLevels, levels.length]);

  const handleLevelPress = (level) => {
    const unlocked = level.unlock_order <= completedLevels + 1;
    if (!unlocked) {
      Alert.alert('Locked Level', 'Complete previous levels to unlock this area.');
      return;
    }

    setSelectedLevel(level);
    navigation.navigate('Level', { level });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adventure Treasure Map</Text>
      <ScrollView contentContainerStyle={styles.mapContent}>
        <View style={styles.path} />
        {levels.map((level, index) => {
          const unlocked = level.unlock_order <= completedLevels + 1;
          const completed = level.unlock_order <= completedLevels;
          const nodeStyle = NODE_POSITIONS[index] || { top: 820 + (index * 120), left: 24 };

          return (
            <View key={level.id} style={[styles.nodeSlot, nodeStyle]}>
              <LevelNode
                level={level}
                unlocked={unlocked}
                completed={completed}
                onPress={() => handleLevelPress(level)}
              />
            </View>
          );
        })}

        {levels.length > 0 && NODE_POSITIONS[explorerIndex] ? (
          <Text style={[styles.explorer, NODE_POSITIONS[explorerIndex]]}>🧭</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C7F2AA',
  },
  title: {
    marginTop: 52,
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.ink,
  },
  mapContent: {
    minHeight: 920,
    paddingBottom: 40,
  },
  path: {
    position: 'absolute',
    top: 80,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 700,
    backgroundColor: '#B37B3F',
    borderRadius: 10,
  },
  nodeSlot: {
    position: 'absolute',
  },
  explorer: {
    position: 'absolute',
    fontSize: 34,
    marginTop: 65,
    marginLeft: 32,
  },
});
