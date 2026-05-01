import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { loadAllDecks, deleteDeck, saveDeck } from "../storage/DeckStorage";
import { Deck, CardData } from "../types";
import Button from "../components/ui/button";
import Card from "../components/Card";
import EmptyListPlaceholder from "../components/EmptyListPlaceholder";
import AddForm from "../components/AddForm";
import DeckModal from "../components/DeckModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [decks, setDecks] = useState<Partial<Deck>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Partial<Deck> | null>(null);

  const fetchDecks = useCallback(async () => {
    setIsLoading(true);
    const allDecks = await loadAllDecks();
    setDecks(allDecks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleAddButtonPress = () => {
    setIsFormVisible(true);
  };

  const handleCardPress = (deck: Partial<Deck>) => {
    setSelectedDeck(deck);
    setIsModalVisible(true);
  };

  const handleAddDeck = async (title: string, description: string) => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      title,
      description,
      cards: [],
    };

    await saveDeck(newDeck);
    setIsFormVisible(false);
    fetchDecks(); // Refresh the list

    router.push({
      pathname: `/deck/[deckId]`,
      params: { deckId: newDeck.id, title: newDeck.title },
    });
  };

  const handleDeleteDeck = async () => {
    if (!selectedDeck?.id) return;
    Alert.alert("Delete Deck", "Are you sure you want to delete this deck?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (selectedDeck?.id) {
            // Added an additional check to satisfy TypeScript
            await deleteDeck(selectedDeck.id);
            setIsModalVisible(false);
            setSelectedDeck(null);
            fetchDecks(); // Refresh the list
          }
        },
      },
    ]);
  };

  const handleEditDeck = () => {
    if (!selectedDeck || !selectedDeck.id || !selectedDeck.title) return; // Added check for id and title
    setIsModalVisible(false);
    router.push({
      pathname: `/deck/[deckId]`,
      params: { deckId: selectedDeck.id, title: selectedDeck.title },
    });
  };

  const handleTakeQuiz = () => {
    if (!selectedDeck || !selectedDeck.id || !selectedDeck.title) {
      // Added check for id and title
      Alert.alert("No Deck Selected", "Please select a deck to take a quiz.");
      return;
    }
    setIsModalVisible(false);
    router.push({
      pathname: `/quiz/[quizId]`,
      params: { deckId: selectedDeck.id, title: selectedDeck.title },
    });
  };

  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <Text style={styles.listTitle}>Your Decks</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
        <Ionicons name="add-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a5568" />
        <Text style={styles.loadingText}>Loading decks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingHello}>Hello!</Text>
            <Text style={styles.greetingWelcome}>
              Welcome to DuoRecall Library.
            </Text>
          </View>
          <Image
            source={require("../assets/images/Duo.png")}
            style={styles.illustration}
          />
        </View>

        <FlatList
          data={decks.filter(item => item.id !== undefined)}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <Card item={item as Deck} onPress={handleCardPress} />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyListPlaceholder}
          contentContainerStyle={
            decks.length === 0
              ? styles.emptyListContainer
              : styles.filledListContainer
          }
        />

        {isFormVisible && (
          <AddForm
            onAddDeck={handleAddDeck}
            onClose={() => setIsFormVisible(false)}
          />
        )}

        {selectedDeck && (
          <DeckModal
            isVisible={isModalVisible}
            deckTitle={selectedDeck.title!}
            onClose={() => setIsModalVisible(false)}
            onEditDeck={handleEditDeck}
            onTakeQuiz={handleTakeQuiz}
            onDeleteDeck={handleDeleteDeck}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: Platform.OS == "web" ? 0 : Platform.OS == "ios" ? 10 : 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4a5568",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingHello: {
    fontSize: 30,
    fontFamily: "FeatherBold",
    color: "#1a202c",
  },
  greetingWelcome: {
    fontSize: 18,
    fontFamily: "FeatherBold",
    color: "#4a5568",
    marginTop: 4,
  },
  illustration: {
    width: 70,
    height: 80,
    marginLeft: 10,
  },
  listHeaderContainer: {
    width: Platform.OS == "web" ? "90%" : "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 5,
    paddingVertical: 10,
    borderWidth: 3,
    borderBottomWidth: 5,
    borderRadius: 25,
    paddingHorizontal: 10,
    borderColor: "#59c903ff",
  },
  listTitle: {
    fontSize: 20,
    fontFamily: "FeatherBold",
    color: "#2d3748",
  },
  addButton: {
    backgroundColor: "#59c903ff",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  filledListContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});

export default HomeScreen;
