export interface CardData {
    id: string;
    question: string;
    answer: string;
}

export interface Deck {
    id: string;
    title: string;
    description: string;
    cards: CardData[];
    version?: string; // Track deck version for updates
    sourceId?: string; // Track which cloud deck this came from
}
