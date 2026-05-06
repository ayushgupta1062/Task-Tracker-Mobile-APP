# ⚡ HRX Studio - Premium Full-Stack Task Tracker App

> A production-grade, highly aesthetic full-stack task management application with a secure Node.js/Express backend and a gorgeous React Native mobile client built with custom glassmorphism styling and fluid animations.

---

## ✨ Features

- **🎯 Segmented Task Tabs**: Seamlessly filter tasks by **All**, **Pending**, and **Completed** sections with tab-specific custom empty states.
- **⏱️ Interactive Pomodoro Focus Timer**: Built-in 25-minute interactive timer on the unauthenticated landing screen to work in intervals and boost productivity.
- **👤 Dynamic User Profile Modal**: Tapping the top-right profile icon reveals an interactive glass card popup displaying the logged-in user's name and email with a clean logout option.
- **✏️ Complete Task Editing (PATCH)**: Tap any task card body to pull up pre-populated fields in an "Edit Task" screen, seamlessly calling the patch endpoint.
- **🛡️ Secure Backend**: Rigorous JWT auth state management, Helmet protection, Zod request body validation, and Mongo injection sanitization.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Backend Runtime** | Node.js 18+ |
| **Backend Framework** | Express.js |
| **Backend Language** | TypeScript (strict) |
| **Database** | MongoDB Atlas via Mongoose |
| **Authentication** | JWT (jsonwebtoken + bcryptjs) |
| **Validation** | Zod |
| **Security** | Helmet, express-rate-limit, express-mongo-sanitize, hpp |
| **Mobile Framework** | React Native (Expo SDK 54) |
| **Mobile Language** | TypeScript (strict) |
| **Navigation** | React Navigation v6 Native Stack |
| **State Management** | Zustand |
| **Server State** | TanStack Query v5 |
| **HTTP Client** | Axios |
| **Animations** | React Native Reanimated |

---

## 📋 Prerequisites

- **Node.js** 18 or later
- **npm** 9+ or **Yarn** 1.22+
- **MongoDB Atlas** connection string
- **Expo Go** app installed on your physical device (iOS or Android)

---

## 🛠️ Clone & Install

```bash
git clone https://github.com/ayushgupta1062/Task-Tracker-Mobile-APP.git
cd Task-Tracker-Mobile-APP
npm install
```

This single command installs all dependencies across both workspaces in the monorepo.

---

## ⚙️ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in the required values:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tasktracker
   JWT_SECRET=your_minimum_32_character_random_secret_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ALLOWED_ORIGIN=*
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

## 📱 Mobile Setup

1. Open `apps/mobile/src/api/client.ts`.
2. Replace the baseURL IP address with the actual local IP address of your machine (e.g., `192.168.1.42`) or use an Expo tunnel. Both your machine and your mobile device must be connected to the same Wi-Fi network.
3. Start the Expo development server:
   ```bash
   cd apps/mobile
   npm run start
   ```
4. Scan the generated QR code with **Expo Go** on your iOS or Android device.

---

## 📁 Folder Structure

```
task-tracker/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/      # Auth and Task controller handlers
│   │   │   ├── middleware/       # JWT auth, error, and rate-limit security
│   │   │   ├── models/           # Mongoose User and Task schemas
│   │   │   └── routes/           # Express API endpoints
│   └── mobile/
│       ├── src/
│       │   ├── api/              # Axios instance and API hooks
│       │   ├── components/       # Custom task cards, buttons, inputs, loader
│       │   ├── constants/        # Tailored harmonious color schemes & font-mappings
│       │   ├── hooks/            # TanStack Query cache integrations
│       │   ├── navigation/       # Unauthenticated & authenticated Stack Navigators
│       │   └── screens/
│       │       ├── auth/         # Landing, Login, and Signup screens
│       │       └── tasks/        # Dynamic TaskList and Create/Edit screens
```
