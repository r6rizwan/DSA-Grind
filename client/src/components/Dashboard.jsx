import { TOPICS } from "../data/topics";

export default function Dashboard({ progress, onClose }) {
  const { completedTopics, completedProblems, streak } = progress;

  const totalProblems = TOPICS.reduce((sum, t) => sum + t.problems.length, 0);
  const solvedProblems = Object.values(completedProblems).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  const overallPct = Math.round((solvedProblems / totalProblems) * 100);

  const stats = [
    { label: "Problems Solved", value: solvedProblems, total: totalProblems, emoji: "✅" },
    { label: "Topics Completed", value: completedTopics.length, total: TOPICS.length, emoji: "🏆" },
    { label: "Day Streak", value: streak?.days || 0, total: null, emoji: "🔥" },
    { label: "Overall Progress", value: `${overallPct}%`, total: null, emoji: "📈" },
  ];

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2 className="dash-title">📊 Your Progress</h2>
          <p className="dash-sub">DSA Grind — Zero to Hero</p>
        </div>
        <button className="dash-close" onClick={onClose}>✕ Back</button>
      </div>

      <div className="dash-stats">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-emoji">{s.emoji}</span>
            <span className="stat-value">{s.value}{s.total ? `/${s.total}` : ""}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-overall">
        <div className="overall-label">
          <span>Overall Completion</span>
          <span>{overallPct}%</span>
        </div>
        <div className="overall-bar">
          <div className="overall-fill" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      <div className="dash-topics">
        <h3 className="dash-section-title">Topic Breakdown</h3>
        {TOPICS.map((topic) => {
          const done = completedProblems[topic.id]?.length || 0;
          const total = topic.problems.length;
          const pct = Math.round((done / total) * 100);
          const isCompleted = completedTopics.includes(topic.id);
          const isLocked = topic.id > progress.currentTopicId;

          return (
            <div className="topic-row" key={topic.id}>
              <div className="topic-row-info">
                <span className="topic-row-emoji">{topic.emoji}</span>
                <span className="topic-row-name">{topic.name}</span>
                <span className="topic-row-count">{done}/{total}</span>
                {isCompleted && <span className="topic-row-badge completed">✓ Done</span>}
                {isLocked && <span className="topic-row-badge locked">🔒</span>}
              </div>
              <div className="topic-bar">
                <div
                  className="topic-bar-fill"
                  style={{ width: `${pct}%`, background: topic.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
