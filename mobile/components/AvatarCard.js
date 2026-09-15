import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';
import { AVATAR_EMOJIS } from '../constants/gameData';

export default function AvatarCard({ profile, onPress, selected }) {
  const avatarIcon = AVATAR_EMOJIS[profile.avatar] || AVATAR_EMOJIS.default;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.avatarCircle}>
        <Text style={styles.avatar}>{avatarIcon}</Text>
      </View>
      <Text style={styles.name}>{profile.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#172554',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  selected: {
    borderColor: COLORS.emerald,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  avatarCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    fontSize: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
  },
});
