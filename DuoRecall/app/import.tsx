import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { saveDeck, loadAllDecks } from '../storage/DeckStorage';
import { Deck } from '../types';
import { parseCSV } from '../utils/csvParser';
import DuoModal from '../components/DuoModal';

// Manifest URL - Update this to your GitHub raw URL
const MANIFEST_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/DuoRecall/lessons/manifest.json';

interface CloudDeck {
  id: string;
  title: string;
  description?: string;
  language: string;
  cardCount: number;
  csvUrl: string;
  version: string;
}

interface LanguageCollection {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  lessons: CloudDeck[];
}

export default function ImportScreen() {
  const router = useRouter();
  const [collections, setCollections] = useState<LanguageCollection[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [existingDecks, setExistingDecks] = useState<Deck[]>([]);
  const [expandedLanguages, setExpandedLanguages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(MANIFEST_URL);
        
        if (!response.ok) {
          throw new Error('Failed to fetch lessons manifest');
        }
        
        const manifest = await response.json();
        
        const languageCollections: LanguageCollection[] = manifest.languages.map((lang: any) => ({
          id: lang.id,
          name: lang.name,
          icon: lang.icon as keyof typeof Ionicons.glyphMap,
          color: lang.color,
          bgColor: lang.bgColor,
          lessons: lang.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            language: lang.name,
            cardCount: lesson.cardCount,
            csvUrl: lesson.csvUrl,
            version: lesson.version,
          })),
        }));

        setCollections(languageCollections);
        // Expand all languages by default
        setExpandedLanguages(new Set(languageCollections.map(c => c.id)));
      } catch (error) {
        console.error('Error fetching manifest:', error);
        setModalConfig({
          title: 'Connection Error',
          message: 'Failed to load available lessons. Please check your internet connection.',
          icon: 'cloud-offline',
          iconColor: '#FF4B4B',
        });
        setModalVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManifest();
  }, []);

  // Load existing decks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadExistingDecks = async () => {
        const allDecks = await loadAllDecks();
        setExistingDecks(allDecks);
      };
      loadExistingDecks();
    }, [])
  );

  const toggleLanguage = (languageId: string) => {
    setExpandedLanguages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(languageId)) {
        newSet.delete(languageId);
      } else {
        newSet.add(languageId);
      }
      return newSet;
    });
  };

  const getDeckStatus = (cloudDeck: CloudDeck): 'new' | 'imported' | 'update' => {
    const existingDeck = existingDecks.find(d => d.sourceId === cloudDeck.id);
    
    if (!existingDeck) {
      return 'new';
    }
    
    // Check if there's an update available
    if (existingDeck.version !== cloudDeck.version) {
      return 'update';
    }
    
    return 'imported';
  };

  const handleImport = async (deck: CloudDeck) => {
    setDownloading(deck.id);
    
    try {
      // Fetch CSV from URL
      const response = await fetch(deck.csvUrl);
      
      if (!response.ok) {
        throw new Error('Failed to download lesson');
      }
      
      const csvData = await response.text();
      
      // Parse CSV data
      const parseResult = parseCSV(csvData);
      
      if (!parseResult.success || !parseResult.cards) {
        throw new Error(parseResult.error || 'Failed to parse CSV');
      }

      // Check if updating existing deck
      const existingDeck = existingDecks.find(d => d.sourceId === deck.id);
      
      if (existingDeck) {
        // UPDATE: Merge new cards with existing ones
        const existingQuestions = new Set(existingDeck.cards.map(c => c.question));
        const newCards = parseResult.cards.filter(card => !existingQuestions.has(card.question));
        
        if (newCards.length === 0) {
          setModalConfig({
            title: 'No Updates',
            message: 'This deck is already up to date!',
            icon: 'information-circle',
            iconColor: '#1CB0F6',
          });
          setModalVisible(true);
          setDownloading(null);
          return;
        }
        
        const updatedDeck: Deck = {
          ...existingDeck,
          cards: [...existingDeck.cards, ...newCards],
          version: deck.version,
        };

        await saveDeck(updatedDeck);
        
        setModalConfig({
          title: 'Updated!',
          message: `Added ${newCards.length} new cards to ${deck.title}!`,
          icon: 'checkmark-circle',
          iconColor: '#58CC02',
        });
        setModalVisible(true);
      } else {
        // NEW IMPORT: Create new deck
        const newDeck: Deck = {
          id: `imported-${Date.now()}`,
          title: deck.title,
          description: `Learn ${deck.language}`,
          cards: parseResult.cards,
          version: deck.version,
          sourceId: deck.id,
        };

        await saveDeck(newDeck);
        
        setModalConfig({
          title: 'Success!',
          message: `${deck.title} imported with ${parseResult.cards.length} cards!`,
          icon: 'checkmark-circle',
          iconColor: '#58CC02',
        });
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Import error:', error);
      setModalConfig({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to import deck',
        icon: 'close-circle',
        iconColor: '#FF4B4B',
      });
      setModalVisible(true);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={22} color="#3C3C3C" />
        </Pressable>
        <Text style={styles.title}>Import Decks</Text>
        <View style={styles.space} />
      </View>

      <View style={styles.contentArea}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1CB0F6" />
            <Text style={styles.loadingText}>Loading lessons...</Text>
          </View>
        ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: collection }) => {
            const isExpanded = expandedLanguages.has(collection.id);
            const totalDecks = collection.lessons.length;
            const importedCount = collection.lessons.filter(d => getDeckStatus(d) === 'imported').length;
            
            return (
              <View style={styles.collectionContainer}>
                {/* Language Header */}
                <Pressable
                  style={({ pressed }) => [
                    styles.languageHeader,
                    { backgroundColor: collection.bgColor },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => toggleLanguage(collection.id)}
                >
                  <View style={styles.languageHeaderLeft}>
                    <View style={[styles.languageIcon, { backgroundColor: collection.color }]}>
                      <Ionicons name={collection.icon} size={24} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text style={styles.languageTitle}>{collection.name}</Text>
                      <Text style={styles.languageSubtitle}>
                        {importedCount}/{totalDecks} lessons imported
                      </Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={collection.color} 
                  />
                </Pressable>

                {/* Lessons List */}
                {isExpanded && collection.lessons.map((deck) => {
                  const status = getDeckStatus(deck);
                  const isDisabled = downloading !== null || status === 'imported';
                  
                  return (
                    <Pressable
                      key={deck.id}
                      style={({ pressed }) => [
                        styles.deckCard,
                        pressed && !isDisabled && styles.pressed,
                        status === 'imported' && styles.cardImported,
                        status === 'update' && styles.cardUpdate,
                      ]}
                      onPress={() => !isDisabled && handleImport(deck)}
                      disabled={isDisabled}
                    >
                      <View style={[styles.deckIcon, { backgroundColor: collection.bgColor }]}>
                        <Ionicons 
                          name={
                            status === 'imported' ? "checkmark-circle" : 
                            status === 'update' ? "refresh-circle" : 
                            "book"
                          } 
                          size={22} 
                          color={collection.color} 
                        />
                      </View>
                      
                      <View style={styles.deckInfo}>
                        <Text style={styles.deckTitle}>{deck.title}</Text>
                        <Text style={styles.deckMeta}>
                          📚 {deck.cardCount} cards
                          {status === 'imported' && " • ✓ Imported"}
                          {status === 'update' && " • 🔄 Update Available"}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.deckBtn, 
                        { backgroundColor: collection.color },
                        status === 'imported' && styles.btnDisabled,
                        status === 'update' && styles.btnUpdate,
                        downloading === deck.id && styles.btnDisabled,
                      ]}>
                        {downloading === deck.id ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : status === 'imported' ? (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        ) : status === 'update' ? (
                          <Ionicons name="refresh" size={18} color="#fff" />
                        ) : (
                          <Ionicons name="download" size={18} color="#fff" />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            );
          }}
        />
        )}
      </View>

      <DuoModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        iconColor={modalConfig.iconColor}
        buttons={[
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              if (modalConfig.title === 'Success!' || modalConfig.title === 'Updated!') {
                router.back();
              }
            },
            style: 'primary',
          },
        ]}
        onClose={() => setModalVisible(false)}
      />
      </SafeAreaView>
    </View>
  );
}

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
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'FeatherBold',
    color: '#AFAFAF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#E5E5E5',
  },
  pressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 2,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'FeatherBold',
    color: '#3C3C3C',
    textAlign: 'center',
  },
  space: {
    width: 36,
  },
  list: {
    padding: 16,
  },
  collectionContainer: {
    marginBottom: 16,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#E5E5E5',
  },
  languageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageTitle: {
    fontSize: 18,
    fontFamily: 'FeatherBold',
    color: '#3C3C3C',
  },
  languageSubtitle: {
    fontSize: 12,
    fontFamily: 'FeatherBold',
    color: '#AFAFAF',
    marginTop: 2,
  },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    marginLeft: 16,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#E5E5E5',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#E5E5E5',
  },
  cardImported: {
    backgroundColor: '#F0FFE6',
    borderColor: '#58CC02',
    opacity: 0.7,
  },
  cardUpdate: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF9600',
  },
  deckIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deckInfo: {
    flex: 1,
  },
  info: {
    flex: 1,
  },
  deckTitle: {
    fontSize: 16,
    fontFamily: 'FeatherBold',
    color: '#3C3C3C',
    marginBottom: 3,
  },
  deckMeta: {
    fontSize: 11,
    fontFamily: 'FeatherBold',
    color: '#AFAFAF',
  },
  meta: {
    fontSize: 11,
    fontFamily: 'FeatherBold',
    color: '#AFAFAF',
  },
  deckBtn: {
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  btn: {
    backgroundColor: '#58CC02',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  btnUpdate: {
    backgroundColor: '#FF9600',
  },
  btnDisabled: {
    backgroundColor: '#AFAFAF',
  },
});
