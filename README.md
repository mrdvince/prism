# Prism - (tinder for papers)
> This is me goofing around because reasons.

A Tinder-like interface for discovering and exploring research papers. 
Swipe right to save interesting papers, swipe left to skip.

<img src="screenshots/cap.gif" alt="App Demo" width="250"/>

## Features

- Intuitive swipe interface for discovering research papers
- Visual representation of paper metrics with dynamic charts
- Save interesting papers for later reading
- Share papers with colleagues
- Clean, modern UI with paper previews
- Support for various paper types (research, review, preprint)

## Tech Stack

- React Native / Expo
- TypeScript
- Expo Router for navigation
- React Native Reanimated for animations
- React Native Gesture Handler for swipe interactions

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
- Press 'i' for iOS simulator
- Press 'a' for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
prism/
├── app/                   # Main application code
│   ├── (tabs)/            # Tab-based navigation
│   ├── models/            # Data models & types
│   └── services/          # API & mock services
├── assets/                # Static assets
└── constants/             # App constants
```

## Development

- Mock data service is used in development
- Real API integration ready for production (TODO)
- Modular component structure for easy extension

## License

MIT
