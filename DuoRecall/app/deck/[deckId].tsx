import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    ScrollView,
    ActivityIndicator,
    Platform,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Deck, CardData } from '../../types';
import { saveDeck, loadDeckContent } from '../../storage/DeckStorage';
import { Ionicons } from '@expo/vector-icons';

const CardItem: React.FC<{ 
    card: CardData; 
    index: number; 
    onUpdate: (id: string, key: 'question' | 'answer', value: string) => void;
    onRemove: (id: string) => void;
}> = ({ card, index, onUpdate, onRemove }) => {
    return (
        <View style={cardStyles.cardContainer}>
            <View style={cardStyles.cardHeader}>
                <View style={cardStyles.cardNumberBadge}>
                    <Text style={cardStyles.cardNumber}>{index + 1}</Text>
                </View>
                <Pressable 
                    style={({ pressed }) => [
                        cardStyles.deleteButton,
                        pressed && cardStyles.deleteButtonPressed
                    ]} 
                    onPress={() => onRemove(card.id)}
                >
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                </Pressable>
            </View>

            <View style={cardStyles.inputGroup}>
                <View style={cardStyles.labelContainer}>
                    <Ionicons name="help-circle" size={18} color="#1CB0F6" />
                    <Text style={cardStyles.label}>Question</Text>
                </View>
                <TextInput
                    style={cardStyles.input}
                    placeholder="What's the question?"
                    placeholderTextColor="#AFAFAF"
                    value={card.question}
                    onChangeText={(text) => onUpdate(card.id, 'question', text)}
                    multiline
                />
            </View>

            <View style={cardStyles.inputGroup}>
                <View style={cardStyles.labelContainer}>
                    <Ionicons name="checkmark-circle" size={18} color="#58CC02" />
                    <Text style={cardStyles.label}>Answer</Text>
                </View>
                <TextInput
                    style={cardStyles.input}
                    placeholder="What's the answer?"
                    placeholderTextColor="#AFAFAF"
                    value={card.answer}
                    onChangeText={(text) => onUpdate(card.id, 'answer', text)}
                    multiline
                />
            </View>
        </View>
    );
};

const cardStyles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: '#E5E5E5',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardNumberBadge: {
        backgroundColor: '#1CB0F6',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardNumber: {
        fontSize: 16,
        fontFamily: "FeatherBold",
        color: '#FFFFFF',
    },
    deleteButton: {
        backgroundColor: '#FF4B4B',
        borderRadius: 12,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderBottomWidth: 3,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    deleteButtonPressed: {
        transform: [{ translateY: 1 }],
        borderBottomWidth: 2,
    },
    inputGroup: {
        marginBottom: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontFamily: "FeatherBold",
        color: '#3C3C3C',
    },
    input: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        padding: 14,
        fontSize: 16,
        color: '#3C3C3C',
        fontFamily: "FeatherBold",
        minHeight: 50,
    },
});

const DeckContentScreen: React.FC = () => {
    const { deckId, title } = useLocalSearchParams<{ deckId: string, title: string }>();
    const router = useRouter();

    const [deck, setDeck] = useState<Deck | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchDeck = async () => {
            if (deckId) {
                const loadedDeck = await loadDeckContent(deckId);
                if (!loadedDeck) {
                    setDeck({ id: deckId, title: title || 'Untitled Deck', description: '', cards: [] });
                } else {
                    setDeck(loadedDeck);
                }
            }
        };
        fetchDeck();
    }, [deckId]);

    const handleUpdateCard = (id: string, key: 'question' | 'answer', value: string) => {
        if (!deck) return;
        const updatedCards = deck.cards.map(card => 
            card.id === id ? { ...card, [key]: value } : card
        );
        setDeck({ ...deck, cards: updatedCards });
    };

    const handleRemoveCard = (id: string) => {
        if (!deck) return;
        const updatedCards = deck.cards.filter(card => card.id !== id);
        setDeck({ ...deck, cards: updatedCards });
    };

    const handleAddCard = () => {
        if (!deck) return;
        const newCard: CardData = {
            id: Date.now().toString(),
            question: '',
            answer: '',
        };
        const updatedCards = [...deck.cards, newCard];
        setDeck({ ...deck, cards: updatedCards });
    };

    const handleSaveDeck = async () => {
        if (!deck) return;
        setIsSaving(true);
        await saveDeck(deck);
        setIsSaving(false);
        router.back();
    };

    if (!deck) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4B90F2" />
                <Text style={styles.loadingText}>Loading deck...</Text>
            </SafeAreaView>
        );
    }

    const isSaveButtonDormant = deck.cards.length === 0;

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                <Pressable 
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed
                    ]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#3C3C3C" />
                </Pressable>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{title || 'Untitled Deck'}</Text>
                    <Text style={styles.headerSubtitle}>{deck.cards.length} cards</Text>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        styles.saveButton,
                        isSaveButtonDormant && styles.saveButtonDormant,
                        pressed && !isSaveButtonDormant && styles.saveButtonPressed
                    ]}
                    disabled={isSaveButtonDormant || isSaving}
                    onPress={handleSaveDeck}
                >
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>
                        {isSaving ? "Saving..." : "Save"}
                    </Text>
                </Pressable>
            </View>

            <View style={styles.contentArea}>
                <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {deck.cards.length === 0 ? (
                    <View style={styles.emptyListContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="albums-outline" size={80} color="#E5E5E5" />
                        </View>
                        <Text style={styles.emptyListTitle}>No cards yet!</Text>
                        <Text style={styles.emptyListText}>
                            Tap the button below to create your first flashcard and start learning.
                        </Text>
                    </View>
                ) : (
                    deck.cards.map((card, index) => (
                        <CardItem
                            key={card.id}
                            card={card}
                            index={index}
                            onUpdate={handleUpdateCard}
                            onRemove={handleRemoveCard}
                        />
                    ))
                )}
            </ScrollView>

            <View style={styles.bottomContainer}>
                <Pressable 
                    style={({ pressed }) => [
                        styles.addButton,
                        pressed && styles.addButtonPressed
                    ]}
                    onPress={handleAddCard}
                >
                    <Ionicons name="add" size={32} color="white" />
                    <Text style={styles.addButtonText}>Add Card</Text>
                </Pressable>
            </View>
            </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: "FeatherBold",
        color: '#AFAFAF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 2,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderWidth: 2,
        borderBottomWidth: 3,
        borderColor: '#E5E5E5',
    },
    backButtonPressed: {
        transform: [{ translateY: 1 }],
        borderBottomWidth: 2,
    },
    headerTitleContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "FeatherBold",
        color: '#3C3C3C',
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: "FeatherBold",
        color: '#AFAFAF',
        marginTop: 2,
    },
    saveButton: {
        backgroundColor: '#58CC02',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    saveButtonPressed: {
        transform: [{ translateY: 2 }],
        borderBottomWidth: 2,
    },
    saveButtonDormant: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: "FeatherBold",
    },
    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 100,
    },
    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 80,
    },
    emptyIconContainer: {
        marginBottom: 20,
    },
    emptyListTitle: {
        fontSize: 24,
        fontFamily: "FeatherBold",
        color: '#3C3C3C',
        marginBottom: 12,
    },
    emptyListText: {
        textAlign: 'center',
        color: '#AFAFAF',
        fontSize: 16,
        fontFamily: "FeatherBold",
        lineHeight: 24,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    addButton: {
        backgroundColor: '#58CC02',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    addButtonPressed: {
        transform: [{ translateY: 2 }],
        borderBottomWidth: 2,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: "FeatherBold",
    },
});

export default DeckContentScreen;