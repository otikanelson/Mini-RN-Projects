import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link, useLocalSearchParams } from "expo-router";
import { Deck } from "../../types";
import { loadQuizContent } from "../../storage/DeckStorage";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { navigate } from "expo-router/build/global-state/routing";
import DuoModal from "../../components/DuoModal";

const QuizScreen: React.FC = () => {
  const { deckId, title } = useLocalSearchParams<{
    deckId: string;
    title: string;
  }>();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message?: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
  }>({
    title: '',
    icon: 'checkmark-circle',
    iconColor: '#58CC02',
  });

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
          setModalConfig({
            title: 'Error',
            message: 'Deck not found. Please try again.',
            icon: 'close-circle',
            iconColor: '#FF4B4B',
          });
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Failed to load deck:", error);
        setModalConfig({
          title: 'Error',
          message: 'Failed to load deck content.',
          icon: 'close-circle',
          iconColor: '#FF4B4B',
        });
        setModalVisible(true);
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
      setModalConfig({
        title: '🎉 Quiz Complete!',
        message: "You've finished all the cards! Great job!",
        icon: 'trophy',
        iconColor: '#FFD700',
      });
      setModalVisible(true);
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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
        <Link href="/" asChild>
          <Pressable 
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed
            ]}
          >
            <Ionicons name="close" size={28} color="#AFAFAF" />
          </Pressable>
        </Link>
        <View style={styles.progressContainer}>
          <Progress.Bar
            style={styles.progressBar}
            progress={progress}
            color="#58CC02"
            unfilledColor="#E5E5E5"
            borderWidth={0}
            height={12}
            borderRadius={6}
          />
          <Text style={styles.progressText}>
            {currentCardIndex + 1} / {deck.cards.length}
          </Text>
        </View>
      </View>

      <View style={styles.contentArea}>
        <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="help-circle" size={48} color="#1CB0F6" />
          </View>
          <Text style={styles.cardText}>{currentCard?.question}</Text>
          <View style={styles.tapHint}>
            <Ionicons name="hand-left" size={20} color="#AFAFAF" />
            <Text style={styles.tapHintText}>Tap to reveal answer</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#FFFFFF" />
          </View>
          <Text style={[styles.cardText, styles.cardTextWhite]}>{currentCard?.answer}</Text>
        </Animated.View>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.flipButton,
          pressed && styles.flipButtonPressed
        ]}
        onPress={handleFlipCard}
      >
        <Ionicons 
          name={isFlipped ? "eye-off" : "eye"} 
          size={24} 
          color="#FFFFFF" 
        />
        <Text style={styles.flipButtonText}>
          {isFlipped ? "Hide Answer" : "Show Answer"}
        </Text>
      </Pressable>

      <View style={styles.navigationButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            styles.incorrectButton,
            currentCardIndex === 0 && styles.navButtonDisabled,
            pressed && currentCardIndex !== 0 && styles.navButtonPressed,
          ]}
          onPress={handlePreviousCard}
          disabled={currentCardIndex === 0}
        >
          <Ionicons name="close-circle" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Wrong</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            styles.correctButton,
            pressed && styles.navButtonPressed,
          ]}
          onPress={handleNextCard}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Correct</Text>
        </Pressable>
      </View>

      <DuoModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        iconColor={modalConfig.iconColor}
        buttons={[
          {
            text: modalConfig.title.includes('Complete') ? 'Back to Home' : 'OK',
            onPress: () => {
              setModalVisible(false);
              if (modalConfig.title.includes('Complete')) {
                navigate("/");
              } else if (modalConfig.title === 'Error') {
                navigate("/");
              }
            },
            style: 'primary',
          },
        ]}
        onClose={() => setModalVisible(false)}
      />
      </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  contentArea: {
    flex: 1,
    width: '100%',
    backgroundColor: "#F7F7F7",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
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
    backgroundColor: "#F7F7F7",
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
    backgroundColor: "#F7F7F7",
  },
  emptyListText: {
    textAlign: "center",
    color: "#AFAFAF",
    fontSize: 16,
    fontFamily: "FeatherBold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: "#E5E5E5",
  },
  closeButtonPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 2,
  },
  progressContainer: {
    flex: 1,
    gap: 8,
  },
  progressBar: {
    width: "100%",
  },
  progressText: {
    fontSize: 14,
    fontFamily: "FeatherBold",
    color: "#AFAFAF",
    textAlign: "center",
  },
  cardContainer: {
    width: "90%",
    height: "50%",
    marginVertical: 20,
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
    padding: 30,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#58CC02",
    borderColor: "rgba(0,0,0,0.1)",
  },
  cardIconContainer: {
    marginBottom: 20,
  },
  cardText: {
    fontSize: 28,
    fontFamily: "FeatherBold",
    textAlign: "center",
    color: "#3C3C3C",
    lineHeight: 38,
  },
  cardTextWhite: {
    color: "#FFFFFF",
  },
  tapHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    opacity: 0.6,
  },
  tapHintText: {
    fontSize: 14,
    fontFamily: "FeatherBold",
    color: "#AFAFAF",
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1CB0F6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  flipButtonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  flipButtonText: {
    color: "#FFFFFF",
    fontFamily: "FeatherBold",
    fontSize: 18,
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    bottom: 20,
    gap: 12,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "rgba(0,0,0,0.1)",
  },
  navButtonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  incorrectButton: {
    backgroundColor: "#FF4B4B",
  },
  correctButton: {
    backgroundColor: "#58CC02",
  },
  navButtonDisabled: {
    backgroundColor: "#AFAFAF",
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "FeatherBold",
    fontSize: 16,
  },
});

export default QuizScreen;