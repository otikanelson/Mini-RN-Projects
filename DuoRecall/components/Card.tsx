import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Deck } from "../types";

// This is the main card component, styled to look like a Duolingo "skill" icon.
// We'll use a large, rounded container with a solid color and a subtle shadow.

type CardProps = {
  item: Deck;
  onPress: (deck: Deck) => void;
};

const Card: React.FC<CardProps> = ({ item, onPress }) => {
  const cardCount = item.cards?.length ?? 0;

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.cardContainer}>
      <View style={styles.contentWrapper}>
        {/* Placeholder for a deck-specific image, like Duo's character icons */}
        <View style={styles.imagePlaceholder}>
          <Ionicons name="folder-open-outline" size={40} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={1}>{item.description}</Text>
        </View>
      </View>
      {cardCount > 0 && (
        <View style={styles.cardBadge}>
          <Text style={styles.badgeText}>{cardCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#59c903ff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "FeatherBold",
    color: "#2d3748",
  },
  cardDescription: {
    fontSize: 14,
    color: "#4a5568",
    fontFamily: "FeatherBold",
    marginTop: 4,
  },
  cardBadge: {
    backgroundColor: "#1cb0f6",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "FeatherBold",
  },
});

export default Card;
