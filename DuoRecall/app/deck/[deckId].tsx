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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Deck, CardData } from '../../types';
import { saveDeck, loadDeckContent } from '../../storage/DeckStorage';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';

const CardItem: React.FC<{ 
    card: CardData; 
    index: number; 
    onUpdate: (id: string, key: 'question' | 'answer', value: string) => void;
    onRemove: (id: string) => void;
}> = ({ card, index, onUpdate, onRemove }) => {
    return (
        <View style={cardStyles.cardContainer}>
            <View style={cardStyles.cardHeader}>
                <Text style={cardStyles.cardNumber}>Card {index + 1}</Text>
                <TouchableOpacity style={cardStyles.iconButton} onPress={() => onRemove(card.id)}>
                    <FontAwesome5 name="trash-alt" size={16} color="#FF4B4B" />
                </TouchableOpacity>
            </View>

            <View style={cardStyles.inputColumn}>
                <TextInput
                    style={cardStyles.input}
                    placeholder="Enter question"
                    placeholderTextColor="#AFAFAF"
                    value={card.question}
                    onChangeText={(text) => onUpdate(card.id, 'question', text)}
                />
            </View>

            <View style={cardStyles.inputColumn}>
                <TextInput
                    style={cardStyles.input}
                    placeholder="Enter answer"
                    placeholderTextColor="#AFAFAF"
                    value={card.answer}
                    onChangeText={(text) => onUpdate(card.id, 'answer', text)}
                />
            </View>
        </View>
    );
};

const cardStyles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20, 
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardNumber: {
        fontSize: 18,
        fontFamily: "FeatherBold",
        color: '#4B4B4B',
    },
    iconButton: {
        marginLeft: 15,
    },
    inputColumn: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 15,
        fontSize: 16,
        color: '#4B4B4B',
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{title || 'Untitled Deck'}</Text>
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        isSaveButtonDormant && styles.saveButtonDormant,
                    ]}
                    disabled={isSaveButtonDormant || isSaving}
                    onPress={handleSaveDeck}
                >
                    <Text style={styles.saveButtonText}>
                        {isSaving ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {deck.cards.length === 0 ? (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>
                            No cards yet! Tap the plus icon below to create your first flashcard.
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
                <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
                    <AntDesign name="plus" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        marginTop: Platform.OS == "web" ? 0 : Platform.OS == "ios" ? 10 : 15,

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
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
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: "FeatherBold",
        color: '#4B4B4B',
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 3,
        borderBottomWidth: 7,
        borderColor: "#459309ff",
        borderRadius: 15,
    },
    saveButtonDormant: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#fff',
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
        paddingTop: 50,
    },
    emptyListText: {
        textAlign: 'center',
        color: '#AFAFAF',
        fontSize: 16,
        fontFamily: "FeatherBold",
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    addButton: {
        backgroundColor: '#58CC02',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
});

export default DeckContentScreen;