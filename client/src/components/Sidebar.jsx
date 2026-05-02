import { useState } from "react";
import { TOPICS } from "../data/topics";

export default function Sidebar({ progress, activeTopic, onSelectTopic, onResetTopic, isDark, onToggleTheme, onShowDashboard }) {
  const { completedTopics, currentTopicId, streak } = progress;
  const [confirmReset, setConfirmReset] = useState(null);

  const handleResetClick = (e, topicId) => {
    e.stopPropagation();
    setConfirmReset(topicId);
  };

  const handleConfirmReset = (e, topicId) => {
    e.stopPropagation();
    onResetTopic(topicId);
    setConfirmReset(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚔️</span>
          <span className="logo-text">DSA <span className="logo-accent">Grind</span></span>
        </div>
        <p className="logo-sub">Zero to Hero</p>
        <div className="streak-badge">
          <span className="streak-fire">🔥</span>
          <span className="streak-count">{streak?.days || 0}</span>
          <span className="streak-label">day streak</span>
        </div>
        <button className="dashboard-btn" onClick={onShowDashboard}>
          📊 Progress
        </button>
        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="topics-list">
        {TOPICS.map((topic) => {
          const isCompleted = completedTopics.includes(topic.id);
          const isCurrent = topic.id === currentTopicId;
          const isLocked = topic.id > currentTopicId;
          const isActive = activeTopic?.id === topic.id;
          const completedCount = progress.completedProblems[topic.id]?.length || 0;
          const canReset = isCompleted || isCurrent;

          return (
            <div
              key={topic.id}
              className={`topic-item ${isActive ? "active" : ""} ${isLocked ? "locked" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => !isLocked && onSelectTopic(topic)}
              style={{ "--topic-color": topic.color }}
            >
              <div className="topic-emoji">{topic.emoji}</div>
              <div className="topic-info">
                <span className="topic-name">{topic.name}</span>
                <span className="topic-progress">
                  {isCompleted ? "✅ Done" : isLocked ? "🔒 Locked" : `${completedCount}/${topic.problems.length} problems`}
                </span>
              </div>
              {isCurrent && !isCompleted && <div className="current-badge">NOW</div>}
              {isCompleted && <div className="done-badge">✓</div>}
              {canReset && confirmReset === topic.id ? (
                <div className="reset-confirm" onClick={(e) => e.stopPropagation()}>
                  <button className="reset-yes" onClick={(e) => handleConfirmReset(e, topic.id)}>✓</button>
                  <button className="reset-no" onClick={(e) => { e.stopPropagation(); setConfirmReset(null); }}>✕</button>
                </div>
              ) : canReset ? (
                <button className="reset-btn" onClick={(e) => handleResetClick(e, topic.id)} title="Reset topic">↺</button>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}