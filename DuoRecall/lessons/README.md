# DuoRecall Lessons Repository

This directory contains all importable lessons for the DuoRecall app.

## Structure

```
lessons/
├── manifest.json          # Main manifest file listing all available lessons
├── spanish/
│   └── basics.csv
├── french/
│   └── basics.csv
└── english/
    └── vocabulary.csv
```

## Adding New Lessons

### 1. Create a CSV file

Create a new CSV file in the appropriate language folder with the following format:

```csv
question,answer
Hello,Hola
Goodbye,Adiós
```

### 2. Update manifest.json

Add your lesson to the `manifest.json` file:

```json
{
  "id": "spanish-greetings",
  "title": "Greetings",
  "description": "Learn how to greet people in Spanish",
  "cardCount": 10,
  "version": "1.0",
  "csvUrl": "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/DuoRecall/lessons/spanish/greetings.csv"
}
```

### 3. Update the version

Increment the `version` field in the manifest.json root to trigger updates in the app.

## CSV Format

- First row must be: `question,answer`
- Each subsequent row contains one flashcard
- Use commas to separate question and answer
- Wrap text in quotes if it contains commas

## Publishing

Once you commit and push changes to GitHub, the app will automatically fetch the updated manifest and make new lessons available for import.

## GitHub Raw URL Format

```
https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/DuoRecall/lessons/LANGUAGE/LESSON.csv
```

Replace:
- `USERNAME`: Your GitHub username
- `REPO`: Your repository name
- `BRANCH`: Usually `main` or `master`
- `LANGUAGE`: Language folder (spanish, french, english, etc.)
- `LESSON`: Lesson filename
