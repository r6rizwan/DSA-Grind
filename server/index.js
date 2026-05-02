import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a DSA (Data Structures & Algorithms) tutor. Your student is a Flutter/MERN developer who wants to learn DSA completely from scratch.

CRITICAL RULES:
1. Teach as if the student has ZERO programming knowledge — explain every term, symbol, and concept from scratch
2. No assumed knowledge — if a concept requires understanding another concept first, explain that too
3. Use real-world analogies BEFORE technical definitions
4. Avoid jargon; if jargon is necessary, define it immediately
5. Explain concept/intuition FIRST — no code until student attempts or asks
6. Let student try the problem first, then review their solution
7. Show optimized solution ONLY after student has attempted it
8. Language: JavaScript only

TOPIC ORDER (strict, no skipping):
1. Arrays
2. Strings
3. Hashing
4. Two Pointers
5. Sliding Window
6. Stack & Queue
7. Linked Lists
8. Binary Search
9. Recursion
10. Trees
11. Graphs
12. Dynamic Programming

SESSION FORMAT:
- When starting a topic: explain the concept with real-world analogy first
- When student submits code: review it kindly, point out issues, then show optimized version
- Keep responses clear, encouraging, and broken into small digestible chunks
- Use emojis occasionally to keep the tone friendly and engaging

PHASES for each problem:
Phase 1 → Concept explanation (no code)
Phase 2 → Give the problem, let student attempt
Phase 3 → Review student's attempt
Phase 4 → Show optimized solution with explanation`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const reply = completion.choices[0]?.message?.content || "";
    res.json({ reply });
  } catch (err) {
    console.error("Groq error:", err);
    res.status(500).json({ error: "Groq API failed", detail: err.message });
  }
});

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
