import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ProblemPanel from "./components/ProblemPanel";
import ChatPanel from "./components/ChatPanel";
import Home from "./components/Home";
import Onboarding from "./components/Onboarding";
import { useProgress } from "./hooks/useProgress";
import { TOPICS } from "./data/topics";
import "./App.css";

export default function App() {
  const { progress, loaded, saveName, saveDifficulty, completeProblem, completeTopic, saveNote, saveCode, resetTopic } = useProgress();
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeProblemIndex, setActiveProblemIndex] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("dsa-theme");
    return saved ? saved === "dark" : true;
  });
  const [view, setView] = useState("home");

  useEffect(() => {
    if (loaded && progress.userName) setView("home");
  }, [loaded]);

  useEffect(() => {
    localStorage.setItem("dsa-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleOnboardingComplete = (name) => saveName(name);

  const handleSelectTopic = (topic) => {
    setActiveTopic(topic);
    setActiveProblemIndex(null);
    setView("learn");
  };

  const handleSelectProblem = (index) => setActiveProblemIndex(index);

  const handleContinue = (topic, problemIndex) => {
    setActiveTopic(topic);
    setActiveProblemIndex(problemIndex);
    setView("learn");
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

  if (!loaded) return <div className={`app-loading ${isDark ? "dark" : "light"}`}><span>⚔️</span></div>;

  if (!progress.userName) {
    return (
      <div className={`app-full ${isDark ? "dark" : "light"}`}>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>
      <Sidebar
        progress={progress}
        activeTopic={activeTopic}
        onSelectTopic={handleSelectTopic}
        onResetTopic={resetTopic}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onShowHome={() => setView("home")}
        activeView={view}
      />
      {view === "home" ? (
        <Home
          progress={progress}
          onContinue={handleContinue}
          saveDifficulty={saveDifficulty}
        />
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
            isDark={isDark}
          />
        </>
      )}
    </div>
  );
}
