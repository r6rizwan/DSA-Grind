import { useState } from "react";

const STORAGE_KEY = "dsa_tutor_progress";

const defaultProgress = {
  currentTopicId: 1,
  completedTopics: [],
  completedProblems: {},
  currentProblemIndex: {},
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  const save = (updated) => {
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const completeProblem = (topicId, problemIndex) => {
    const updated = { ...progress };
    if (!updated.completedProblems[topicId]) updated.completedProblems[topicId] = [];
    if (!updated.completedProblems[topicId].includes(problemIndex)) {
      updated.completedProblems[topicId].push(problemIndex);
    }
    updated.currentProblemIndex[topicId] = problemIndex + 1;
    save(updated);
  };

  const completeTopic = (topicId) => {
    const updated = { ...progress };
    if (!updated.completedTopics.includes(topicId)) {
      updated.completedTopics.push(topicId);
    }
    updated.currentTopicId = topicId + 1;
    save(updated);
  };

  const resetProgress = () => save(defaultProgress);

  return { progress, completeProblem, completeTopic, resetProgress };
}
