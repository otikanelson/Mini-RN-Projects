import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyListPlaceholder: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="library-outline" size={80} color="#58CC02" />
      </View>
      <Text style={styles.title}>Start Your Learning Journey!</Text>
      <Text style={styles.subtitle}>
        Create your first deck and begin mastering new skills today
      </Text>
      <View style={styles.hintContainer}>
        <Ionicons name="arrow-up-circle" size={24} color="#1CB0F6" />
        <Text style={styles.hintText}>Tap the button above to get started</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F0FFE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontFamily: "FeatherBold",
    color: '#3C3C3C',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "FeatherBold",
    color: '#AFAFAF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E6F7FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1CB0F6',
  },
  hintText: {
    fontSize: 14,
    fontFamily: "FeatherBold",
    color: '#1CB0F6',
  },
});

export default EmptyListPlaceholder;
