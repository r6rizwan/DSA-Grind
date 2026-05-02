import { useState, useEffect } from "react";

const defaultProgress = {
  currentTopicId: 1,
  completedTopics: [],
  completedProblems: {},
  currentProblemIndex: {},
  notes: {},
  streak: { days: 0, lastDate: null },
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

function updateStreak(progress) {
  const today = new Date().toDateString();
  const { streak } = progress;
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return {
    days: streak.lastDate === yesterday ? streak.days + 1 : 1,
    lastDate: today,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState(defaultProgress);

  useEffect(() => {
    fetchProgress()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setProgress({ ...defaultProgress, ...data });
        }
      })
      .catch(() => { });
  }, []);

  const save = (updated) => {
    const withStreak = { ...updated, streak: updateStreak(updated) };
    setProgress(withStreak);
    saveProgress(withStreak).catch(() => { });
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

  const saveNote = (topicId, problemIndex, text) => {
    const updated = { ...progress };
    if (!updated.notes) updated.notes = {};
    updated.notes[`${topicId}-${problemIndex}`] = text;
    save(updated);
  };

  const resetTopic = (topicId) => {
    const updated = { ...progress };
    updated.completedTopics = updated.completedTopics.filter((id) => id !== topicId);
    updated.completedProblems[topicId] = [];
    updated.currentProblemIndex[topicId] = 0;
    if (updated.currentTopicId > topicId) updated.currentTopicId = topicId;
    save(updated);
  };

  const resetProgress = () => save(defaultProgress);

  return { progress, completeProblem, completeTopic, saveNote, resetTopic, resetProgress };
}