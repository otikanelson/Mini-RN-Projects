import { CardData } from '../types';

export interface CSVParseResult {
  success: boolean;
  cards?: CardData[];
  error?: string;
}

export const parseCSV = (csvContent: string): CSVParseResult => {
  try {
    const lines = csvContent.trim().split('\n');
    
    if (lines.length < 2) {
      return { success: false, error: 'CSV file is empty or has no data rows' };
    }

    // Skip header row
    const dataLines = lines.slice(1);
    const cards: CardData[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      // Simple CSV parsing (handles basic cases)
      const parts = line.split(',');
      
      if (parts.length < 2) {
        console.warn(`Skipping invalid line ${i + 2}: ${line}`);
        continue;
      }

      const question = parts[0].trim();
      const answer = parts.slice(1).join(',').trim(); // Handle commas in answers

      if (question && answer) {
        cards.push({
          id: `${Date.now()}-${i}`,
          question,
          answer,
        });
      }
    }

    if (cards.length === 0) {
      return { success: false, error: 'No valid cards found in CSV' };
    }

    return { success: true, cards };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
