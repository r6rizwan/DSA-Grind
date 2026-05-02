import { TOPICS } from "../data/topics";

export default function Sidebar({ progress, activeTopic, onSelectTopic }) {
  const { completedTopics, currentTopicId } = progress;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚔️</span>
          <span className="logo-text">DSA <span className="logo-accent">Grind</span></span>
        </div>
        <p className="logo-sub">Zero to Hero</p>
      </div>

      <div className="topics-list">
        {TOPICS.map((topic) => {
          const isCompleted = completedTopics.includes(topic.id);
          const isCurrent = topic.id === currentTopicId;
          const isLocked = topic.id > currentTopicId;
          const isActive = activeTopic?.id === topic.id;
          const completedCount = progress.completedProblems[topic.id]?.length || 0;

          return (
            <button
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
            </button>
          );
        })}
      </div>
    </aside>
  );
}
