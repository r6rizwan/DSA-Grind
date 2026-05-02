import { useState } from "react";

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter your name to continue."); return; }
    if (trimmed.length < 2) { setError("Name must be at least 2 characters."); return; }
    onComplete(trimmed);
  };

  return (
    <div className="onboarding">
      <div className="ob-card">
        <div className="ob-logo">⚔️</div>
        <h1 className="ob-title">DSA <span className="ob-accent">Grind</span></h1>
        <p className="ob-tagline">Zero to Hero — One problem at a time</p>

        <div className="ob-features">
          <div className="ob-feature"><span>🤖</span><span>AI tutor that teaches from scratch</span></div>
          <div className="ob-feature"><span>📚</span><span>12 topics, 60 problems, structured path</span></div>
          <div className="ob-feature"><span>💻</span><span>Built-in code editor with AI review</span></div>
          <div className="ob-feature"><span>🔥</span><span>Streak tracking & progress dashboard</span></div>
        </div>

        <div className="ob-form">
          <label className="ob-label">What should we call you?</label>
          <input
            className={`ob-input ${error ? "ob-input-error" : ""}`}
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          {error && <p className="ob-error">{error}</p>}
          <button
            className="ob-btn"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Start Learning →
          </button>
        </div>

        <p className="ob-note">Your name is saved locally — no account needed.</p>
      </div>
    </div>
  );
}
