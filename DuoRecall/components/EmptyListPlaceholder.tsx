import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EmptyListPlaceholder: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require("@/assets/images/images.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Nothing to see here yet!</Text>
      <Text style={styles.subtitle}>
        You haven't made any decks yet
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 50,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "FeatherBold",
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "FeatherBold",
    color: '#777',
    textAlign: 'center',
  },
});

export default EmptyListPlaceholder;