import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AchievementBadge from '../components/AchievementBadge';
import COLORS from '../constants/colors';
import { useGame } from '../context/GameContext';
import { getAchievements } from '../services/achievementService';

export default function AchievementsScreen() {
  const { selectedProfile } = useGame();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!selectedProfile) return;
      try {
        const data = await getAchievements(selectedProfile.id);
        setAchievements(data);
      } catch (error) {
        Alert.alert('Achievements Error', error.message);
      }
    };

    load();
  }, [selectedProfile]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <AchievementBadge achievement={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E9FF',
    paddingTop: 54,
    paddingHorizontal: 14,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.ink,
    marginBottom: 14,
  },
  row: {
    justifyContent: 'space-between',
  },
  content: {
    paddingBottom: 20,
  },
});
