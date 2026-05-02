import { TOPICS } from "../data/topics";

const DIFFICULTIES = ["Easy", "Easy", "Medium", "Medium", "Hard"];

export default function ProblemPanel({ topic, progress, activeProblem, onSelectProblem }) {
  if (!topic) {
    return (
      <div className="problem-panel empty-state">
        <div className="empty-icon">👈</div>
        <h2>Pick a topic to start</h2>
        <p>Select any unlocked topic from the sidebar to begin your DSA journey.</p>
      </div>
    );
  }

  const completedProblems = progress.completedProblems[topic.id] || [];

  return (
    <div className="problem-panel">
      <div className="topic-hero" style={{ background: topic.gradient }}>
        <span className="hero-emoji">{topic.emoji}</span>
        <div>
          <h1 className="hero-title">{topic.name}</h1>
          <p className="hero-desc">{topic.description}</p>
        </div>
        <div className="hero-stats">
          <span>{completedProblems.length}/{topic.problems.length}</span>
          <small>completed</small>
        </div>
      </div>

      <div className="problems-grid">
        {topic.problems.map((problem, idx) => {
          const isDone = completedProblems.includes(idx);
          const isActive = activeProblem === idx;
          const diff = DIFFICULTIES[idx];

          return (
            <button
              key={idx}
              className={`problem-card ${isDone ? "done" : ""} ${isActive ? "active-problem" : ""}`}
              style={{ "--topic-color": topic.color }}
              onClick={() => onSelectProblem(idx)}
            >
              <div className="problem-num">#{idx + 1}</div>
              <div className="problem-name">{problem}</div>
              <div className={`diff-badge diff-${diff.toLowerCase()}`}>{diff}</div>
              {isDone && <div className="done-check">✓</div>}
            </button>
          );
        })}
      </div>

      <div className="concept-prompt">
        <p>💡 Click a problem to load it in the tutor chat. The AI will explain the concept before giving you the challenge.</p>
      </div>
    </div>
  );
}
