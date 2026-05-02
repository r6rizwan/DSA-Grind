import { TOPICS } from "../data/topics";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getMotivation(solvedProblems, totalProblems) {
  if (solvedProblems === 0) return "Ready to begin your DSA journey? 🚀";
  if (solvedProblems < 10) return "Great start! Keep the momentum going 💪";
  if (solvedProblems < 30) return "You're making solid progress! 🔥";
  if (solvedProblems < 50) return "More than halfway there! You're crushing it 🏆";
  return "Almost done! The finish line is in sight 🎯";
}

export default function Home({ progress, onStartLearning, onContinue }) {
  const { completedTopics, completedProblems, streak, userName, currentTopicId } = progress;

  const totalProblems = TOPICS.reduce((sum, t) => sum + t.problems.length, 0);
  const solvedProblems = Object.values(completedProblems).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  const overallPct = Math.round((solvedProblems / totalProblems) * 100);

  const currentTopic = TOPICS.find((t) => t.id === currentTopicId);
  const currentTopicDone = completedProblems[currentTopicId]?.length || 0;
  const nextProblemIndex = currentTopicDone < (currentTopic?.problems?.length || 0) ? currentTopicDone : 0;
  const nextProblemName = currentTopic?.problems?.[nextProblemIndex];

  const stats = [
    { label: "Problems Solved", value: `${solvedProblems}/${totalProblems}`, emoji: "✅", color: "#1DD1A1" },
    { label: "Topics Done", value: `${completedTopics.length}/12`, emoji: "🏆", color: "#FDCB6E" },
    { label: "Day Streak", value: streak?.days || 0, emoji: "🔥", color: "#FF6B6B" },
    { label: "Completion", value: `${overallPct}%`, emoji: "📈", color: "#A29BFE" },
  ];

  return (
    <div className="home">
      {/* Header */}
      <div className="home-header">
        <div>
          <h1 className="home-greeting">{getGreeting()}, <span className="home-name">{userName}</span> 👋</h1>
          <p className="home-motivation">{getMotivation(solvedProblems, totalProblems)}</p>
        </div>
        <div className="home-overall">
          <svg viewBox="0 0 36 36" className="home-circle">
            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path
              className="circle-fill"
              strokeDasharray={`${overallPct}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="home-circle-label">
            <span>{overallPct}%</span>
            <small>complete</small>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="home-stats">
        {stats.map((s) => (
          <div className="home-stat" key={s.label} style={{ "--stat-color": s.color }}>
            <span className="home-stat-emoji">{s.emoji}</span>
            <span className="home-stat-value">{s.value}</span>
            <span className="home-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="home-cta">
        {currentTopic && (
          <button
            className="home-continue-btn"
            onClick={() => onContinue(currentTopic, nextProblemIndex)}
            style={{ background: currentTopic.gradient }}
          >
            <div className="cta-left">
              <span className="cta-topic-emoji">{currentTopic.emoji}</span>
              <div>
                <span className="cta-label">Continue Learning</span>
                <span className="cta-problem">{nextProblemName}</span>
              </div>
            </div>
            <span className="cta-arrow">→</span>
          </button>
        )}
      </div>

      {/* Topic breakdown */}
      <div className="home-topics">
        <h3 className="home-section-title">Topic Progress</h3>
        <div className="home-topics-grid">
          {TOPICS.map((topic) => {
            const done = completedProblems[topic.id]?.length || 0;
            const total = topic.problems.length;
            const pct = Math.round((done / total) * 100);
            const isCompleted = completedTopics.includes(topic.id);
            const isLocked = topic.id > currentTopicId;
            const isCurrent = topic.id === currentTopicId;

            return (
              <div
                key={topic.id}
                className={`home-topic-card ${isCompleted ? "htc-done" : ""} ${isLocked ? "htc-locked" : ""} ${isCurrent ? "htc-current" : ""}`}
                style={{ "--tc": topic.color }}
              >
                <div className="htc-top">
                  <span className="htc-emoji">{topic.emoji}</span>
                  <span className="htc-name">{topic.name}</span>
                  {isCompleted && <span className="htc-badge done">✓</span>}
                  {isLocked && <span className="htc-badge locked">🔒</span>}
                  {isCurrent && <span className="htc-badge current">NOW</span>}
                </div>
                <div className="htc-bar">
                  <div className="htc-fill" style={{ width: `${pct}%`, background: topic.color }} />
                </div>
                <span className="htc-count">{done}/{total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
