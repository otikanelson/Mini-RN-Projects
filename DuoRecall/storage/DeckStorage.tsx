import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, DeckContent, CardData } from '../types';

const DECKS_STORAGE_KEY = 'decks';

// Helper function to get a single deck for editing
export const loadDeckContent = async (deckId: string): Promise<Deck | null> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        if (serializedDecks === null) {
            return null;
        }

        const decks: Deck[] = JSON.parse(serializedDecks);
        const deck = decks.find(d => d.id === deckId);
        
        console.log("Loading deck with ID:", deckId); // Debugging line
        console.log("Loaded deck content:", deck); // Debugging line

        if (deck) {
            return deck;
        }
        return null;
    } catch (error) {
        console.error('Error loading deck content:', error);
        return null;
    }
};

export const loadQuizContent = async (deckId: string): Promise<DeckContent | null> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        if (serializedDecks === null) {
            return null;
        }

        const decks: Deck[] = JSON.parse(serializedDecks);
        const deck = decks.find(d => d.id === deckId);
        
        console.log("Loading quiz content for deck ID:", deckId);
        
        if (deck) {
            return {
                id: deck.id,
                content: deck.cards,
            };
        }
        return null;
    } catch (error) {
        console.error('Error loading quiz content:', error);
        return null;
    }
};

export const loadAllDecks = async (): Promise<Partial<Deck>[]> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        if (serializedDecks === null) {
            return [];
        }
        const decks: Deck[] = JSON.parse(serializedDecks);
        return decks.map(deck => ({
            id: deck.id,
            title: deck.title,
            description: deck.description,
        }));
    } catch (error) {
        console.error('Error loading all decks:', error);
        return [];
    }
};

export const saveDeck = async (deckToSave: Deck): Promise<void> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        let decks: Deck[] = serializedDecks ? JSON.parse(serializedDecks) : [];
        
        const existingDeckIndex = decks.findIndex(d => d.id === deckToSave.id);
        
        if (existingDeckIndex > -1) {
            // Update existing deck
            decks[existingDeckIndex] = deckToSave;
        } else {
            // Add new deck
            decks.push(deckToSave);
        }
        
        await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
    } catch (error) {
        console.error('Error saving deck:', error);
    }
};

export const deleteDeck = async (deckId: string): Promise<void> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        if (serializedDecks === null) {
            return;
        }
        const decks: Deck[] = JSON.parse(serializedDecks);
        const updatedDecks = decks.filter(deck => deck.id !== deckId);
        await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(updatedDecks));
    } catch (error) {
        console.error('Error deleting deck:', error);
    }
};

// Helper function to add a card to a deck
export const addCardToDeck = async (deckId: string, card: CardData): Promise<void> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        if (serializedDecks === null) {
            return;
        }
        
        const decks: Deck[] = JSON.parse(serializedDecks);
        const deckToUpdate = decks.find(d => d.id === deckId);
        
        if (deckToUpdate) {
            deckToUpdate.cards.push(card);
            await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
        }
    } catch (error) {
        console.error('Error adding card to deck:', error);
    }
};

// Helper function to update a card in a deck
export const updateCardInDeck = async (deckId: string, updatedCard: CardData): Promise<void> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        if (serializedDecks === null) {
            return;
        }
        
        const decks: Deck[] = JSON.parse(serializedDecks);
        const deckToUpdate = decks.find(d => d.id === deckId);
        
        if (deckToUpdate) {
            const cardIndex = deckToUpdate.cards.findIndex(card => card.id === updatedCard.id);
            if (cardIndex !== -1) {
                deckToUpdate.cards[cardIndex] = updatedCard;
                await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
            }
        }
    } catch (error) {
        console.error('Error updating card in deck:', error);
    }
};

// Helper function to delete a card from a deck
export const deleteCardFromDeck = async (deckId: string, cardId: string): Promise<void> => {
    try {
        const serializedDecks = await AsyncStorage.getItem(DECKS_STORAGE_KEY);
        if (serializedDecks === null) {
            return;
        }
        
        const decks: Deck[] = JSON.parse(serializedDecks);
        const deckToUpdate = decks.find(d => d.id === deckId);
        
        if (deckToUpdate) {
            const updatedCards = deckToUpdate.cards.filter(card => card.id !== cardId);
            deckToUpdate.cards = updatedCards;
            await AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
        }
    } catch (error) {
        console.error('Error deleting card from deck:', error);
    }
};
