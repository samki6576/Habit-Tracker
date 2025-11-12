# Habit Tracker

A Next.js application for tracking daily habits with Firebase integration.

## Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/samki6576/Habit-Tracker.git
cd Habit-Tracker
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```
Then edit `.env.local` with your Firebase configuration.

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
pnpm build
pnpm start
```

## Installing the App

This app can be installed as a Progressive Web App (PWA) on your device or as a native mobile app using Capacitor.

### Installing as PWA (Progressive Web App)

1. **Build and deploy** the app to a web server (or use the production build locally)
2. **Open the app** in a supported browser (Chrome, Edge, Safari, etc.)
3. **Look for the install prompt** - A dialog will appear asking if you want to install the app
4. **Click "Install App"** - The app will be added to your home screen/desktop
5. **Alternative method**: 
   - **Chrome/Edge**: Click the install icon (⊕) in the address bar
   - **Safari (iOS)**: Tap the Share button → "Add to Home Screen"
   - **Firefox**: Click the menu → "Install"

The app will work offline and provide a native app-like experience.

### Installing as Native Mobile App (Capacitor)

#### Prerequisites
- For iOS: Xcode and CocoaPods installed
- For Android: Android Studio and Android SDK installed

#### Build Steps

1. **Build for Capacitor**:
   ```bash
   npm run build:capacitor
   ```

2. **Sync with Capacitor**:
   ```bash
   npm run capacitor:sync
   ```

3. **Open in native IDE**:
   - **For iOS**:
     ```bash
     npm run capacitor:ios
     ```
     This opens Xcode where you can build and run on a simulator or device.
   
   - **For Android**:
     ```bash
     npm run capacitor:android
     ```
     This opens Android Studio where you can build and run on an emulator or device.

4. **Build and deploy**:
   - In Xcode: Product → Archive → Distribute App
   - In Android Studio: Build → Generate Signed Bundle/APK

## Technologies Used

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Firebase
- Radix UI Components
- React Hook Form
- Zod for validation

## Features

- Habit tracking
- Calendar view
- Statistics dashboard
- Firebase authentication
- Real-time updates
- Responsive design
- Dark/Light mode
- **Progressive Web App (PWA)** - Installable on any device
- **Offline support** - Works without internet connection
- **Native mobile app support** - Build for iOS and Android using Capacitor