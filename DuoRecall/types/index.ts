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
}
