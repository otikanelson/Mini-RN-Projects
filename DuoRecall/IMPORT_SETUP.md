# Import Feature Setup Guide

## What's Been Added

1. **CSV Deck Files**: Three sample decks in `assets/decks/`
   - French Basics (30 cards)
   - Spanish Basics (30 cards)
   - English Vocabulary (30 cards)

2. **Import Screen**: New screen at `app/import.tsx` that allows users to browse and download decks from the cloud

3. **CSV Parser**: Utility at `utils/csvParser.ts` to parse CSV files into flashcards

4. **Manifest System**: `assets/decks/manifest.json` lists all available decks

5. **UI Updates**: Added cloud download button to home screen

## Setup Instructions

### Step 1: Push to GitHub

1. Commit all changes to your repository
2. Push to GitHub (make sure the repo is public)

### Step 2: Update URLs

You need to replace placeholder URLs with your actual GitHub info:

1. Open `DuoRecall/assets/decks/manifest.json`
2. Replace `YOUR_USERNAME` with your GitHub username
3. Replace `YOUR_REPO` with your repository name

Example:
```json
"downloadUrl": "https://raw.githubusercontent.com/johndoe/Mini-RN-Projects/main/DuoRecall/assets/decks/french_basics.csv"
```

4. Open `DuoRecall/app/import.tsx`
5. Update the `MANIFEST_URL` constant (line 23) with your GitHub info

Example:
```typescript
const MANIFEST_URL = 'https://raw.githubusercontent.com/johndoe/Mini-RN-Projects/main/DuoRecall/assets/decks/manifest.json';
```

### Step 3: Test

1. Run the app: `npx expo start`
2. On the home screen, tap the blue cloud download button
3. You should see the three decks available for import
4. Tap the download icon to import a deck

## Adding More Decks

1. Create a new CSV file in `assets/decks/` following the format:
   ```csv
   question,answer
   Question 1,Answer 1
   Question 2,Answer 2
   ```

2. Add an entry to `manifest.json`:
   ```json
   {
     "id": "german-basics",
     "title": "German Basics",
     "description": "Essential German phrases",
     "language": "German",
     "cardCount": 25,
     "fileName": "german_basics.csv",
     "downloadUrl": "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/DuoRecall/assets/decks/german_basics.csv"
   }
   ```

3. Commit and push to GitHub
4. Users will see the new deck in the import screen

## How It Works

1. User taps the cloud download button on home screen
2. App fetches `manifest.json` from your GitHub repo
3. Displays list of available decks
4. When user taps download, app fetches the CSV file
5. CSV is parsed into flashcards
6. New deck is saved to local storage
7. User can now study the imported deck

## Benefits

- No backend server needed
- Free hosting via GitHub
- Easy to add new decks (just edit CSV and manifest)
- Users always get the latest decks
- Works offline after import
- No licensing issues (you control the content)

## Future Enhancements

- Add deck versioning to update existing decks
- Support for images in cards
- Community deck submissions via pull requests
- Deck categories and filtering
- Search functionality
- Deck ratings and reviews
