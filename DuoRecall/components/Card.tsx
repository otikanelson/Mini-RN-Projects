import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Deck } from "../types";

type CardProps = {
  item: Deck;
  onPress: (deck: Deck) => void;
};

const deckColors = [
  { bg: '#FFC800', icon: '#FF9600' },
  { bg: '#58CC02', icon: '#46A302' },
  { bg: '#1CB0F6', icon: '#1899D6' },
  { bg: '#CE82FF', icon: '#B565E8' },
  { bg: '#FF4B4B', icon: '#EA2B2B' },
  { bg: '#00CD9C', icon: '#00B386' },
];

const Card: React.FC<CardProps> = ({ item, onPress }) => {
  const cardCount = item.cards?.length ?? 0;
  const colorIndex = Math.abs(item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % deckColors.length;
  const colors = deckColors[colorIndex];
  
  const progress = cardCount > 0 ? Math.min((cardCount / 20) * 100, 100) : 0;

  return (
    <Pressable 
      onPress={() => onPress(item)} 
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.cardContent}>
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: colors.bg }]}>
          <View style={[styles.iconInner, { backgroundColor: colors.icon }]}>
            <Ionicons name="book" size={28} color="#FFFFFF" />
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={1}>{item.description}</Text>
          
          {/* Progress Bar */}
          {cardCount > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.bg }]} />
              </View>
              <Text style={styles.cardCountText}>{cardCount} cards</Text>
            </View>
          )}
          
          {cardCount === 0 && (
            <Text style={styles.emptyText}>No cards yet</Text>
          )}
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={24} color="#AFAFAF" />
        </View>
      </View>

      {/* Bottom Border for 3D effect */}
      <View style={[styles.cardBorder, { backgroundColor: colors.icon }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  cardPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 19,
    fontFamily: "FeatherBold",
    color: "#3C3C3C",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#AFAFAF",
    fontFamily: "FeatherBold",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  cardCountText: {
    fontSize: 12,
    fontFamily: "FeatherBold",
    color: "#AFAFAF",
    minWidth: 55,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: "FeatherBold",
    color: "#AFAFAF",
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBorder: {
    height: 0,
  },
});

export default Card;
