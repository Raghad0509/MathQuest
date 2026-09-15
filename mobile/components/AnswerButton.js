import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import COLORS from '../constants/colors';

export default function AnswerButton({ label, value, onPress, disabled }) {
  return (
    <Pressable
      onPress={() => onPress(label)}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '48%',
    minHeight: 84,
    backgroundColor: COLORS.brightYellow,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: '#78350f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 10,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
  },
  value: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.oceanBlue,
  },
});
