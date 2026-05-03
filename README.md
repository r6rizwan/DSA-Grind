# ⚔️ DSA Grind

A structured, AI-powered DSA learning app built for developers who want to go from zero to hero — one problem at a time.

Built with **React + Vite**, **Node.js + Express**, and **Groq AI (Llama 3.3 70B)** — completely free to run.

---

## ✨ Features

- 📚 **12 structured topics** — Arrays → Strings → Hashing → Two Pointers → Sliding Window → Stack & Queue → Linked Lists → Binary Search → Recursion → Trees → Graphs → Dynamic Programming
- 🔒 **Locked progression** — topics unlock only after completing the current one
- 🤖 **AI tutor (Groq + Llama 3.3 70B)** — explains concepts using real-world analogies before giving you the problem
- 💻 **Monaco editor** (VS Code's engine) — write JavaScript solutions directly in the app
- 🔍 **AI code review** — submit your solution and get detailed feedback + optimized version
- 💡 **Hint system** — get a nudge only after describing what you've already tried
- ➡️ **Next problem button** — auto-navigates after marking a problem done
- 💾 **Save code per problem** — your solution is stored and restored every time
- 📝 **Notes per problem** — save your own summary and key insights
- 🔥 **Streak tracker** — tracks your daily learning consistency
- ↺ **Reset individual topic** — redo any topic without losing other progress
- ↩️ **Undo mark done** — 4-second undo window to prevent accidental completion
- 🏠 **Personalized home screen** — greets you by name with stats and a continue button
- ☀️ **Dark/light mode toggle**
- ⌨️ **Keyboard shortcuts** — Cmd+K to open editor, Cmd+Enter to submit code
- 🎨 **Vibrant UI** — each topic has its own color theme

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Monaco Editor |
| Backend | Node.js, Express |
| AI | Groq API (Llama 3.3 70B — free tier) |
| Storage | MongoDB (local) |
| Styling | Pure CSS with CSS Variables |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Free Groq API key from https://console.groq.com (no credit card required)
- MongoDB Community Server installed locally

Start MongoDB before running the server:

    brew services start mongodb-community

### 1. Clone the repo

    git clone https://github.com/r6rizwan/DSA-Grind.git
    cd DSA-Grind

### 2. Backend setup

    cd server
    npm install
    cp .env.example .env

Open .env and add your keys:

    GROQ_API_KEY=your_groq_api_key_here
    MONGODB_URI=mongodb://localhost:27017/dsa-grind

Start the server:

    npm run dev

### 3. Frontend setup (new terminal)

    cd client
    npm install
    npm run dev

### 4. Open the app

    http://localhost:5173

---

## 📁 Project Structure

    DSA-Grind/
    ├── server/
    │   ├── index.js          # Express server + Groq API + system prompt
    │   ├── .env.example      # Environment variable template
    │   └── package.json
    └── client/
        ├── src/
        │   ├── components/
        │   │   ├── Sidebar.jsx       # Topic list with progress + reset
        │   │   ├── ProblemPanel.jsx  # Problem cards with difficulty badges
        │   │   ├── ChatPanel.jsx     # AI tutor chat + Monaco code editor
        │   │   ├── Home.jsx          # Personalized home screen
        │   │   └── Onboarding.jsx    # First-launch name capture
        │   ├── data/
        │   │   └── topics.js         # 12 topics x 5 problems each
        │   ├── hooks/
        │   │   └── useProgress.js    # MongoDB progress tracker
        │   ├── App.jsx
        │   └── App.css
        └── package.json

---

## 🧠 How the AI Tutor Works

Each problem follows a 4-phase flow:

    Phase 1 → Concept explanation with real-world analogy (no code yet)
    Phase 2 → Problem is given — you attempt it in the Monaco editor
    Phase 3 → Submit your solution → AI reviews and gives feedback
    Phase 4 → AI shows the optimized solution only if needed

The tutor teaches from absolute zero — every term, symbol, and concept is explained as if the student has never coded before.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd + K | Open / close code editor |
| Cmd + Enter | Submit code for review |

---

## 📚 Topics & Problems

| # | Topic | Problems |
|---|-------|----------|
| 1 | 📦 Arrays | Two Sum, Maximum Subarray, Best Time to Buy Stock, Contains Duplicate, Rotate Array |
| 2 | 🔤 Strings | Reverse String, Valid Palindrome, Anagram Check, Longest Common Prefix, String Compression |
| 3 | 🗂️ Hashing | Two Sum (HashMap), Group Anagrams, Top K Frequent, Subarray Sum Equals K, Longest Consecutive |
| 4 | 👆 Two Pointers | Valid Palindrome II, 3Sum, Container With Most Water, Remove Duplicates, Merge Sorted Arrays |
| 5 | 🪟 Sliding Window | Max Average Subarray, Longest Substring No Repeat, Minimum Window Substring, Fruit Into Baskets, Permutation in String |
| 6 | 📚 Stack & Queue | Valid Parentheses, Min Stack, Daily Temperatures, Evaluate RPN, Implement Queue using Stacks |
| 7 | 🔗 Linked Lists | Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle, Middle of List, Remove Nth from End |
| 8 | 🔍 Binary Search | Binary Search, Search Insert Position, Find Peak Element, Search in Rotated Array, Koko Eating Bananas |
| 9 | 🌀 Recursion | Fibonacci, Factorial, Power of X, Merge Sort, Generate Parentheses |
| 10 | 🌳 Trees | Inorder Traversal, Max Depth, Invert Binary Tree, Validate BST, Level Order Traversal |
| 11 | 🕸️ Graphs | Number of Islands, Clone Graph, Course Schedule, Pacific Atlantic Water, Word Ladder |
| 12 | ⚡ Dynamic Programming | Climbing Stairs, House Robber, Coin Change, Longest Increasing Subsequence, 0/1 Knapsack |

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| GROQ_API_KEY | Your Groq API key from console.groq.com |
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB connection string (default: mongodb://localhost:27017/dsa-grind) |

---

## 📄 License

MIT License — free to use, modify, and distribute.
