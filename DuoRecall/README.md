# 🦉 DuoRecall - Language Learning Flashcard App

A beautiful, Duolingo-inspired flashcard application built with React Native and Expo. Learn languages through interactive flashcards with a delightful user experience.

## ✨ Features

- 📚 **Multiple Language Support** - Learn Spanish, French, English, and more
- 🎴 **Interactive Flashcards** - Flip cards to reveal answers with smooth animations
- 📥 **Cloud Import System** - Download lessons from GitHub without app updates
- 🎨 **Beautiful UI** - Duolingo-inspired design with custom modals and animations
- 📊 **Progress Tracking** - Track your learning streak and deck statistics
- ✏️ **Custom Decks** - Create and edit your own flashcard decks
- 🎯 **Quiz Mode** - Test your knowledge with interactive quizzes
- 💾 **Local Storage** - All your progress saved locally on your device

## 📱 Screenshots

<div align="center">

### Splash Screen & Home
![WhatsApp Image 2026-04-13 at 12 10 43 AM](https://github.com/user-attachments/assets/dbe1a0d5-018e-4066-9f15-4785390a9e01)
<img src="https://github.com/user-attachments/assets/ec6ce80a-71c1-4a85-9c86-4d99a408d80e" width="250" alt="Splash Screen" />
<img src="https://github.com/user-attachments/assets/469707de-89e9-4dbe-b302-a1bece07ad84" width="250" alt="Home Screen" />

*Beautiful animated splash screen and home dashboard with progress tracking*

### Create & Edit Decks
<img src="https://github.com/user-attachments/assets/f7cff307-125a-423a-b92b-719ac5859a39" width="250" alt="Create Deck" />
<img src="https://github.com/user-attachments/assets/69b373e0-eac2-4fbf-ab03-403a85114d90" width="250" alt="Edit Deck" />

*Create custom decks and add flashcards with an intuitive editor*

### Import Lessons
<img src="https://github.com/user-attachments/assets/9bca0306-7173-4b4c-9b54-617f0e9820ff" width="250" alt="Import Lessons" />
<img src="https://github.com/user-attachments/assets/579048c2-cf1a-42ef-a55f-76766c5c8bd8" width="250" alt="Import Success" />

*Browse and download lessons organized by language with beautiful success modals*

### Quiz Mode
<img src="https://github.com/user-attachments/assets/157a5be7-12a5-4e4a-bf75-4d7949d29ebb" width="250" alt="Quiz Screen" />

*Interactive flashcard quiz with smooth flip animations and progress tracking*

</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO/DuoRecall
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📚 Adding New Lessons

DuoRecall uses a dynamic lesson system that fetches content from GitHub. You can add new lessons without modifying the app code!

### Step 1: Create a CSV file

Create a new CSV file in the appropriate language folder:

```csv
question,answer
Hello,Hola
Goodbye,Adiós
Thank you,Gracias
```

Save it as `DuoRecall/lessons/spanish/greetings.csv`

### Step 2: Update manifest.json

Add your lesson to `DuoRecall/lessons/manifest.json`:

```json
{
  "id": "spanish-greetings",
  "title": "Greetings",
  "description": "Learn how to greet people in Spanish",
  "cardCount": 20,
  "version": "1.0",
  "csvUrl": "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/DuoRecall/lessons/spanish/greetings.csv"
}
```

### Step 3: Update the manifest URL

In `DuoRecall/app/import.tsx`, update the `MANIFEST_URL`:

```typescript
const MANIFEST_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/DuoRecall/lessons/manifest.json';
```

### Step 4: Commit and push

```bash
git add DuoRecall/lessons/
git commit -m "Add Spanish Greetings lesson"
git push origin main
```

The app will automatically fetch and display the new lesson! 🎉

For more details, see the [Lessons README](./lessons/README.md).

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation
- **AsyncStorage** - Local data persistence
- **React Native Reanimated** - Smooth animations
- **Expo Status Bar** - Status bar management
- **React Native Progress** - Progress indicators

## 📁 Project Structure

```
DuoRecall/
├── app/                    # Screen components (file-based routing)
│   ├── index.tsx          # Home screen
│   ├── import.tsx         # Import lessons screen
│   ├── deck/[deckId].tsx  # Deck editor
│   └── quiz/[quizId].tsx  # Quiz screen
├── components/            # Reusable UI components
│   ├── Card.tsx          # Deck card component
│   ├── DuoModal.tsx      # Custom modal
│   ├── DeckModal.tsx     # Deck options modal
│   └── AnimatedSplash.tsx # Splash screen
├── lessons/              # Lesson content (CSV files)
│   ├── manifest.json     # Lesson catalog
│   ├── spanish/          # Spanish lessons
│   ├── french/           # French lessons
│   └── english/          # English lessons
├── storage/              # Data persistence
│   └── DeckStorage.tsx   # AsyncStorage wrapper
├── types/                # TypeScript definitions
├── utils/                # Helper functions
│   └── csvParser.ts      # CSV parsing utility
└── constants/            # App constants
    └── theme.ts          # Theme configuration
```

## 🎨 Customization

### Changing Theme Colors

Edit the color values in your components or create a centralized theme file:

```typescript
const colors = {
  primary: '#58CC02',    // Green
  secondary: '#1CB0F6',  // Blue
  warning: '#FF9600',    // Orange
  danger: '#FF4B4B',     // Red
  background: '#F7F7F7', // Light gray
};
```

### Adding New Languages

1. Create a new folder in `lessons/` (e.g., `lessons/german/`)
2. Add lessons as CSV files
3. Update `manifest.json` with the new language:

```json
{
  "id": "german",
  "name": "German",
  "icon": "flag",
  "color": "#FFD700",
  "bgColor": "#FFF9E6",
  "lessons": [
    {
      "id": "german-basics",
      "title": "Basics",
      "description": "Learn basic German words",
      "cardCount": 25,
      "version": "1.0",
      "csvUrl": "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/DuoRecall/lessons/german/basics.csv"
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding Lessons

The easiest way to contribute is by adding new lessons! Just follow the [Adding New Lessons](#-adding-new-lessons) guide above.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by [Duolingo](https://www.duolingo.com/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Built with [Expo](https://expo.dev/)
- Fonts: FeatherBold, PierceRoman, PierceOblique

## 📞 Support

If you have any questions or run into issues:

- Open an [Issue](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- Check the [Lessons README](./lessons/README.md) for lesson creation help

## 🔗 Learn More

To learn more about developing with Expo:

- [Expo documentation](https://docs.expo.dev/) - Learn fundamentals and advanced topics
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/) - Step-by-step tutorial
- [Expo on GitHub](https://github.com/expo/expo) - View the open source platform
- [Discord community](https://chat.expo.dev) - Chat with Expo users

---

Made with ❤️ and ☕
