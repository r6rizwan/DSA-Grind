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
- 💾 **Auto progress tracking** — saved to local MongoDB, survives browser clears
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
- Free [Groq API key](https://console.groq.com) (no credit card required)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/dsa-grind.git
cd dsa-grind
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:
```bash
npm run dev
```

### 3. Frontend setup (new terminal)
```bash
cd client
npm install
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

---

## 📁 Project Structure

```
dsa-grind/
├── server/
│   ├── index.js          # Express server + Groq API + system prompt
│   ├── .env.example      # Environment variable template
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Topic list with progress indicators
    │   │   ├── ProblemPanel.jsx  # Problem cards with difficulty badges
    │   │   └── ChatPanel.jsx     # AI tutor chat + Monaco code editor
    │   ├── data/
    │   │   └── topics.js         # 12 topics × 5 problems each
    │   ├── hooks/
    │   │   └── useProgress.js    # MongoDB progress tracker
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

---

## 🧠 How the AI Tutor Works

Each problem follows a 4-phase flow:

```
Phase 1 → Concept explanation with real-world analogy (no code yet)
Phase 2 → Problem is given — you attempt it in the Monaco editor
Phase 3 → Submit your solution → AI reviews and gives feedback
Phase 4 → AI shows the optimized solution with full explanation
```

The tutor is instructed to teach from absolute zero — every term, symbol, and concept is explained as if the student has never coded before.

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
| `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com) |
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string (default: localhost) |

---

## 📄 License

MIT License — free to use, modify, and distribute.
