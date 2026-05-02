import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProblemPanel from "./components/ProblemPanel";
import ChatPanel from "./components/ChatPanel";
import Dashboard from "./components/Dashboard";
import { useProgress } from "./hooks/useProgress";
import { TOPICS } from "./data/topics";
import "./App.css";

export default function App() {
  const { progress, completeProblem, completeTopic, saveNote, saveCode, resetTopic } = useProgress();
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeProblemIndex, setActiveProblemIndex] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleSelectTopic = (topic) => {
    setActiveTopic(topic);
    setActiveProblemIndex(null);
  };

  const handleSelectProblem = (index) => {
    setActiveProblemIndex(index);
  };

  const handleProblemComplete = () => {
    if (!activeTopic || activeProblemIndex === null) return;
    completeProblem(activeTopic.id, activeProblemIndex);

    const allDone = activeTopic.problems.every((_, i) =>
      i === activeProblemIndex || (progress.completedProblems[activeTopic.id] || []).includes(i)
    );
    if (allDone) completeTopic(activeTopic.id);
  };

  const handleNextProblem = () => {
    if (!activeTopic) return;
    const nextIndex = activeProblemIndex + 1;

    if (nextIndex < activeTopic.problems.length) {
      setActiveProblemIndex(nextIndex);
    } else {
      const nextTopic = TOPICS.find((t) => t.id === activeTopic.id + 1);
      if (nextTopic) {
        setActiveTopic(nextTopic);
        setActiveProblemIndex(0);
      }
    }
  };

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>
      <Sidebar
        progress={progress}
        activeTopic={activeTopic}
        onSelectTopic={handleSelectTopic}
        onResetTopic={resetTopic}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onShowDashboard={() => setShowDashboard(true)}
      />
      {showDashboard ? (
        <Dashboard progress={progress} onClose={() => setShowDashboard(false)} />
      ) : (
        <>
          <ProblemPanel
            topic={activeTopic}
            progress={progress}
            activeProblem={activeProblemIndex}
            onSelectProblem={handleSelectProblem}
          />
          <ChatPanel
            topic={activeTopic}
            problemIndex={activeProblemIndex}
            onProblemComplete={handleProblemComplete}
            onNextProblem={handleNextProblem}
            saveNote={saveNote}
            saveCode={saveCode}
            progress={progress}
          />
        </>
      )}
    </div>
  );
}
