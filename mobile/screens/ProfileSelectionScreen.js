import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AvatarCard from '../components/AvatarCard';
import PrimaryButton from '../components/PrimaryButton';
import COLORS from '../constants/colors';
import { useGame } from '../context/GameContext';
import { createProfile, getProfiles } from '../services/profileService';

export default function ProfileSelectionScreen({ navigation }) {
  const { setSelectedProfile } = useGame();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [gender, setGender] = useState('girl');

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSelect = (profile) => {
    setSelectedProfile(profile);
    navigation.replace('Home');
  };

  const handleCreate = async () => {
    const cleanName = profileName.trim();
    if (!cleanName) {
      Alert.alert('Name Required', 'Please enter a profile name.');
      return;
    }

    const payload = {
      name: cleanName,
      avatar: gender === 'boy' ? 'explorer_boy' : 'explorer_girl',
      language: 'en',
    };

    try {
      const created = await createProfile(payload);
      const updated = [...profiles, created];
      setProfiles(updated);
      setProfileName('');
      setGender('girl');
      setShowCreateForm(false);
      setSelectedProfile(created);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Could not create profile', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Explorer</Text>
      <Text style={styles.subtitle}>Pick your hero and start the treasure journey.</Text>

      <FlatList
        data={profiles}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <AvatarCard profile={item} onPress={() => handleSelect(item)} />}
        refreshing={loading}
        onRefresh={fetchProfiles}
      />

      {showCreateForm ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Create Explorer</Text>
          <TextInput
            value={profileName}
            onChangeText={setProfileName}
            placeholder="Enter profile name"
            placeholderTextColor="#64748B"
            style={styles.input}
            maxLength={24}
          />

          <Text style={styles.genderTitle}>Choose Gender</Text>
          <View style={styles.genderRow}>
            <Pressable
              onPress={() => setGender('girl')}
              style={[styles.genderOption, gender === 'girl' && styles.genderOptionActive]}
            >
              <Text style={styles.genderEmoji}>👧</Text>
              <Text style={styles.genderLabel}>Girl</Text>
            </Pressable>
            <Pressable
              onPress={() => setGender('boy')}
              style={[styles.genderOption, gender === 'boy' && styles.genderOptionActive]}
            >
              <Text style={styles.genderEmoji}>🧒</Text>
              <Text style={styles.genderLabel}>Boy</Text>
            </Pressable>
          </View>

          <View style={styles.formActions}>
            <PrimaryButton
              title="Cancel"
              onPress={() => {
                setShowCreateForm(false);
                setProfileName('');
                setGender('girl');
              }}
              color={COLORS.muted}
              style={styles.formButton}
            />
            <PrimaryButton title="Create" onPress={handleCreate} color={COLORS.purple} style={styles.formButton} />
          </View>
        </View>
      ) : (
        <PrimaryButton
          title="Create New Profile"
          onPress={() => setShowCreateForm(true)}
          color={COLORS.purple}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 16,
    backgroundColor: '#DBF3FF',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.ink,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#334155',
    fontWeight: '600',
    marginBottom: 18,
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    marginBottom: 6,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.ink,
    backgroundColor: '#F8FAFC',
  },
  genderTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderOptionActive: {
    backgroundColor: '#DCFCE7',
    borderColor: COLORS.emerald,
  },
  genderEmoji: {
    fontSize: 28,
  },
  genderLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
  },
  formActions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    width: '48%',
  },
});
