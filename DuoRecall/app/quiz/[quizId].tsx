import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import { Deck } from "../../types";
import { loadQuizContent } from "../../storage/DeckStorage";
import { AntDesign } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { navigate } from "expo-router/build/global-state/routing";

const QuizScreen: React.FC = () => {
  const { deckId, title } = useLocalSearchParams<{
    deckId: string;
    title: string;
  }>();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const animatedValue = useState(new Animated.Value(0))[0];

  if (!deckId) {
    console.error("Error: deckId parameter is missing.");
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Something went wrong. Could not find a valid deck.
        </Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    console.log("useEffect triggered with deckId:", deckId);

    const fetchDeck = async () => {
      try {
        const loadedDeck = await loadQuizContent(deckId);
        if (loadedDeck) {
          setDeck(loadedDeck);
        } else {
          console.error(`Deck with ID ${deckId} not found.`);
          Alert.alert("Error", "Deck not found. Please try again.");
        }
      } catch (error) {
        console.error("Failed to load deck:", error);
        Alert.alert("Error", "Failed to load deck content.");
      }
    };
    fetchDeck();
  }, [deckId]);

  useEffect(() => {
    setIsFlipped(false);
    animatedValue.setValue(0);
  }, [currentCardIndex]);

  const handleFlipCard = () => {
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  const handleNextCard = () => {
    if (deck && currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      Alert.alert("Quiz Complete!", "You have finished this deck. Great job!");
      navigate("/");
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  if (!deck) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B90F2" />
        <Text style={styles.loadingText}>Loading deck...</Text>
      </SafeAreaView>
    );
  }

  if (deck.cards.length === 0) {
    return (
      <SafeAreaView style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>
          This deck has no cards. Please add some from the deck editor screen!
        </Text>
      </SafeAreaView>
    );
  }

  const currentCard = deck.cards[currentCardIndex];
  const progress = (currentCardIndex + 1) / deck.cards.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.closeButton}>
          <Link href="/" asChild>
            <AntDesign name="close" size={24} color="#909090" />
          </Link>
        </TouchableOpacity>
        <Progress.Bar
          style={styles.progressBar}
          progress={progress}
          color="#7ACC22"
          unfilledColor="#E5E5E5"
          borderWidth={0}
        />
      </View>

      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <Text style={styles.cardText}>{currentCard?.question}</Text>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <Text style={styles.cardText}>{currentCard?.answer}</Text>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.flipButton} onPress={handleFlipCard}>
        <Text style={styles.flipButtonText}>
          {isFlipped ? "Hide Answer" : "Show Answer"}
        </Text>
      </TouchableOpacity>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.incorrectButton,
            currentCardIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousCard}
          disabled={currentCardIndex === 0}
        >
          <Text style={styles.buttonText}>I got it wrong</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.correctButton]}
          onPress={handleNextCard}
        >
          <Text style={styles.buttonText}>I got it right</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "FeatherBold",
    color: "#AFAFAF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    textAlign: "center",
    fontFamily: "FeatherBold",
    color: "#FF4B4B",
    fontSize: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyListText: {
    textAlign: "center",
    color: "#AFAFAF",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 10,
  },
  progressBar: {
    flex: 1,
    marginHorizontal: 15,
    height: 10,
  },
  cardContainer: {
    width: "90%",
    height: "50%",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#7ACC22",
  },
  cardText: {
    fontSize: 24,
    fontFamily: "FeatherBold",
    textAlign: "center",
    color: "#4B4B4B",
  },
  flipButton: {
    width: "auto",
    backgroundColor: "#58CC02",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#4fae07ff",
    borderBottomWidth: 7,
    marginBottom: 20,
    alignSelf: "center",
  },
  flipButtonText: {
    color: "white",
    fontFamily: "FeatherBold",
    fontSize: 18,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    bottom: 20,
  },
  navButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  incorrectButton: {
    borderWidth: 3,
    borderColor: "#da3939ff",
    borderBottomWidth: 7,
    backgroundColor: "#FF4B4B",
  },
  correctButton: {
    borderWidth: 3,
    borderColor: "#4fae07ff",
    borderBottomWidth: 7,
    backgroundColor: "#58CC02",
  },
  navButtonDisabled: {
    borderWidth: 3,
    borderColor: "#9b9a9aff",
    borderBottomWidth: 7,
    backgroundColor: "#AFAFAF",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default QuizScreen;