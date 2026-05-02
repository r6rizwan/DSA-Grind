import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProblemPanel from "./components/ProblemPanel";
import ChatPanel from "./components/ChatPanel";
import { useProgress } from "./hooks/useProgress";
import { TOPICS } from "./data/topics";
import "./App.css";

export default function App() {
  const { progress, completeProblem, completeTopic } = useProgress();
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeProblemIndex, setActiveProblemIndex] = useState(null);

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

  return (
    <div className="app">
      <Sidebar progress={progress} activeTopic={activeTopic} onSelectTopic={handleSelectTopic} />
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
      />
    </div>
  );
}
