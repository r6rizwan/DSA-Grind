import { useState, useEffect } from "react";

const defaultProgress = {
  currentTopicId: 1,
  completedTopics: [],
  completedProblems: {},
  currentProblemIndex: {},
};

async function fetchProgress() {
  const res = await fetch("/api/progress");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function saveProgress(data) {
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function useProgress() {
  const [progress, setProgress] = useState(defaultProgress);

  useEffect(() => {
    fetchProgress()
      .then((data) => {
        if (data && Object.keys(data).length > 0) setProgress(data);
      })
      .catch(() => {});
  }, []);

  const save = (updated) => {
    setProgress(updated);
    saveProgress(updated).catch(() => {});
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