# DuoRecall Cloud Decks

This directory contains CSV deck files that can be imported into DuoRecall.

## CSV Format

Each deck should be a CSV file with the following format:

```csv
question,answer
What is 2+2?,4
Capital of France?,Paris
```

- First row is the header (question,answer)
- Each subsequent row is a flashcard
- Questions go in the first column
- Answers go in the second column

## Adding New Decks

1. Create a new CSV file in this directory
2. Update `manifest.json` with the new deck information
3. Push to GitHub
4. Users can download from the app's Import screen

## Manifest Format

The `manifest.json` file lists all available decks:

```json
{
  "decks": [
    {
      "id": "unique-deck-id",
      "title": "Deck Title",
      "description": "Brief description of the deck",
      "language": "Language name",
      "cardCount": 30,
      "fileName": "filename.csv",
      "downloadUrl": "https://raw.githubusercontent.com/USERNAME/REPO/main/DuoRecall/assets/decks/filename.csv"
    }
  ]
}
```

## GitHub Setup

1. Push this repository to GitHub
2. Update the URLs in `manifest.json` with your GitHub username and repo name
3. Update the `MANIFEST_URL` in `app/import.tsx` with your manifest URL
4. Make sure the repository is public so users can download the files

## Current Decks

- French Basics (30 cards)
- Spanish Basics (30 cards)
- English Vocabulary (30 cards)
