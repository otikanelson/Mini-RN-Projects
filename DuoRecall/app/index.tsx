import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { loadAllDecks, deleteDeck, saveDeck } from "../storage/DeckStorage";
import { Deck } from "../types";
import Card from "../components/Card";
import EmptyListPlaceholder from "../components/EmptyListPlaceholder";
import AddForm from "../components/AddForm";
import DeckModal from "../components/DeckModal";
import DuoModal from "../components/DuoModal";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [duoModalVisible, setDuoModalVisible] = useState(false);
  const [duoModalConfig, setDuoModalConfig] = useState<{
    title: string;
    message?: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    onConfirm?: () => void;
  }>({
    title: '',
    icon: 'checkmark-circle',
    iconColor: '#58CC02',
  });

  const fetchDecks = useCallback(async () => {
    setIsLoading(true);
    const allDecks = await loadAllDecks();
    setDecks(allDecks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Auto-reload decks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [fetchDecks])
  );

  const handleAddButtonPress = () => {
    setIsFormVisible(true);
  };

  const handleCardPress = (deck: Deck) => {
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
    
    setDuoModalConfig({
      title: 'Delete Deck',
      message: 'Are you sure you want to delete this deck? This action cannot be undone.',
      icon: 'warning',
      iconColor: '#FF9600',
      onConfirm: async () => {
        if (selectedDeck?.id) {
          await deleteDeck(selectedDeck.id);
          setIsModalVisible(false);
          setSelectedDeck(null);
          fetchDecks();
        }
        setDuoModalVisible(false);
      },
    });
    setDuoModalVisible(true);
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
      setDuoModalConfig({
        title: 'No Deck Selected',
        message: 'Please select a deck to take a quiz.',
        icon: 'alert-circle',
        iconColor: '#FF9600',
      });
      setDuoModalVisible(true);
      return;
    }
    setIsModalVisible(false);
    router.push({
      pathname: `/quiz/[quizId]`,
      params: { quizId: selectedDeck.id, deckId: selectedDeck.id, title: selectedDeck.title },
    });
  };

  const handleImportPress = () => {
    router.push('/import');
  };

  const getTotalCards = (): number => {
    return decks.reduce((total: number, deck: Deck) => total + (deck.cards?.length || 0), 0);
  };

  const getStreak = () => {
    // Placeholder for streak functionality
    return 7;
  };

  const StatsCard = ({ icon, label, value, color, bgColor }: { icon: any; label: string; value: number; color: string; bgColor: string }) => (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const QuickActionButton = ({ icon, label, onPress, color }: { icon: any; label: string; onPress: () => void; color: string }) => (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickActionButton,
        { backgroundColor: color },
        pressed && styles.quickActionPressed
      ]}
    >
      <Ionicons name={icon} size={28} color="#fff" />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );

  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      {/* Stats Section */}
      <View style={styles.statsRow}>
        <StatsCard 
          icon="flame" 
          label="Day Streak" 
          value={getStreak()} 
          color="#FF9600"
          bgColor="#FFF4E6"
        />
        <StatsCard 
          icon="book" 
          label="Decks" 
          value={decks.length} 
          color="#1CB0F6"
          bgColor="#E6F7FF"
        />
        <StatsCard 
          icon="layers" 
          label="Cards" 
          value={getTotalCards()} 
          color="#58CC02"
          bgColor="#F0FFE6"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionButton 
            icon="add-circle" 
            label="New Deck" 
            onPress={handleAddButtonPress}
            color="#58CC02"
          />
          <QuickActionButton 
            icon="cloud-download" 
            label="Import" 
            onPress={handleImportPress}
            color="#1CB0F6"
          />
        </View>
      </View>
      
      {/* Section Title */}
      <View style={styles.sectionTitleContainer}>
        <Ionicons name="library" size={24} color="#3C3C3C" />
        <Text style={styles.sectionTitle}>My Learning Path</Text>
      </View>
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
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#58CC02" />

        {/* Duolingo-style Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/Duo.png")}
                style={styles.duoIcon}
              />
              <Text style={styles.appTitle}>DuoRecall</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle" size={40} color="#AFAFAF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Keep it up! 💪</Text>
            <Text style={styles.subGreetingText}>You're doing great today</Text>
          </View>
        </View>

        <FlatList
          data={decks.filter((item: Deck) => item.id !== undefined)}
          keyExtractor={(item: Deck) => item.id!}
          renderItem={({ item }: { item: Deck }) => (
            <Card item={item as Deck} onPress={handleCardPress} />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyListPlaceholder}
          contentContainerStyle={
            decks.length === 0
              ? styles.emptyListContainer
              : styles.filledListContainer
          }
          showsVerticalScrollIndicator={false}
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

        <DuoModal
          visible={duoModalVisible}
          title={duoModalConfig.title}
          message={duoModalConfig.message}
          icon={duoModalConfig.icon}
          iconColor={duoModalConfig.iconColor}
          buttons={
            duoModalConfig.onConfirm
              ? [
                  {
                    text: 'Cancel',
                    onPress: () => setDuoModalVisible(false),
                    style: 'secondary',
                  },
                  {
                    text: 'Delete',
                    onPress: duoModalConfig.onConfirm,
                    style: 'destructive',
                  },
                ]
              : [
                  {
                    text: 'OK',
                    onPress: () => setDuoModalVisible(false),
                    style: 'primary',
                  },
                ]
          }
          onClose={() => setDuoModalVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
    fontFamily: "FeatherBold",
  },
  header: {
    backgroundColor: "#58CC02",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  duoIcon: {
    width: 40,
    height: 45,
    marginRight: 8,
    backgroundColor: "#ffffff",
    borderRadius: 30,
  },
  appTitle: {
    fontSize: 20,
    fontFamily: "FeatherBold",
    color: "#FFFFFF",
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    marginTop: 4,
  },
  greetingText: {
    fontSize: 22,
    fontFamily: "FeatherBold",
    color: "#FFFFFF",
  },
  subGreetingText: {
    fontSize: 16,
    fontFamily: "FeatherBold",
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 2,
  },
  listHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontFamily: "FeatherBold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "FeatherBold",
    color: "#777",
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: "FeatherBold",
    color: "#3C3C3C",
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "rgba(0,0,0,0.1)",
    gap: 8,
  },
  quickActionPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  quickActionLabel: {
    fontSize: 15,
    fontFamily: "FeatherBold",
    color: "#FFFFFF",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "FeatherBold",
    color: "#3C3C3C",
  },
  filledListContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});

export default HomeScreen;
