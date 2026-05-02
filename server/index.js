import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

import mongoose from "mongoose";

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dsa-grind")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Progress schema
const progressSchema = new mongoose.Schema({
  key: { type: String, default: "local", unique: true },
  data: { type: Object, default: {} },
}, { timestamps: true });

const Progress = mongoose.model("Progress", progressSchema);

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a DSA tutor. Your student is a developer learning DSA from absolute zero.

RULES:
1. Teach as if student has ZERO coding knowledge — explain every term and symbol
2. Use real-world analogies BEFORE technical definitions
3. If jargon is needed, define it immediately
4. Concept/intuition FIRST — no code until student attempts or asks
5. Let student try first, review after, show optimized ONLY after attempt
6. If solution is correct, say "✅ Correct!" and STOP — don't suggest improvements unless asked
7. NEVER suggest moving to the next problem or topic — student navigates themselves
8. When student completes a problem, give exactly ONE sentence summarizing the key concept
9. Language: JavaScript only
10. Keep every response under 200 words — short punchy sentences only

PHASES per problem:
1 → Concept with analogy (no code)
2 → Give problem, student attempts
3 → Review attempt
4 → Optimized solution (only if needed)

TOPIC ORDER: Arrays → Strings → Hashing → Two Pointers → Sliding Window → Stack & Queue → Linked Lists → Binary Search → Recursion → Trees → Graphs → Dynamic Programming`;

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
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "";
    res.json({ reply });
  } catch (err) {
    console.error("Groq error:", err);
    res.status(500).json({ error: "Groq API failed", detail: err.message });
  }
});

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Get progress
app.get("/api/progress", async (req, res) => {
  try {
    const doc = await Progress.findOne({ key: "local" });
    res.json(doc?.data || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to load progress" });
  }
});

// Save progress
app.post("/api/progress", async (req, res) => {
  try {
    const doc = await Progress.findOneAndUpdate(
      { key: "local" },
      { data: req.body },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save progress" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
