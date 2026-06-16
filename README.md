# 🎬 Movie App

A beautiful and smooth movie discovery application built with **React Native** and **Expo**. This app fetches data from **The Movie Database (TMDB) API** to show the latest movies, search for movies, manage your favorite list, and even play movie trailers directly inside the app.

## ✨ Features

- **Discover Movies:** Browse through top-rated and trending movies on the home screen.
- **Search:** Quickly search for any movie from the TMDB database.
- **Favorites:** Save your favorite movies locally using `AsyncStorage` for quick access.
- **Movie Details:** View detailed information including synopsis, rating, release date, cast, reviews, and similar movies.
- **Trailer Integration:** Play YouTube movie trailers seamlessly on a dedicated screen without leaving the app.
- **Stunning UI:** Features a dark-themed cinematic UI with blur effects (`expo-blur`) and smooth transitions.

## 🛠 Tech Stack

- **Framework:** React Native (Expo)
- **Navigation:** React Navigation (Bottom Tabs & Stack)
- **API:** TMDB (The Movie Database) via `axios`
- **Video Player:** `react-native-youtube-iframe`
- **Storage:** `@react-native-async-storage/async-storage`

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and add your TMDB API keys:

```env
TMDB_API_KEY=your_api_key_here
TMDB_ACCESS_TOKEN=your_access_token_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

> **Note:** You can get your free API key by registering at [TMDB Developer Settings](https://www.themoviedb.org/settings/api).

### 3. Run the App

```bash
npm start
```

Press `a` to run on Android Emulator, `i` for iOS Simulator, or scan the QR code using the **Expo Go** app on your physical device.

## 📱 Screenshots & Demo
*(Add screenshots of your Home, Detail, and Trailer screens here)*
