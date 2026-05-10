import { useState, useEffect } from "react";

const defaultProgress = {
  userName: "",
  currentTopicId: 1,
  completedTopics: [],
  completedProblems: {},
  currentProblemIndex: {},
  notes: {},
  savedCodes: {},
  streak: { days: 0, lastDate: null },
  difficulty: "guided",
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
  if (streak?.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return {
    days: streak?.lastDate === yesterday ? (streak.days || 0) + 1 : 1,
    lastDate: today,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchProgress()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setProgress({ ...defaultProgress, ...data });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = (updater) => {
    setProgress((prev) => {
      const updated = typeof updater === "function" ? updater(prev) : updater;
      const withStreak = { ...updated, streak: updateStreak(updated) };
      saveProgress(withStreak).catch(() => {});
      return withStreak;
    });
  };

  const saveName = (name) => save((prev) => ({ ...prev, userName: name }));

  const saveDifficulty = (level) => save((prev) => ({ ...prev, difficulty: level }));

  const completeProblem = (topicId, problemIndex) => {
    save((prev) => {
      const next = { ...prev, completedProblems: { ...prev.completedProblems }, currentProblemIndex: { ...prev.currentProblemIndex } };
      if (!next.completedProblems[topicId]) next.completedProblems[topicId] = [];
      if (!next.completedProblems[topicId].includes(problemIndex)) next.completedProblems[topicId] = [...next.completedProblems[topicId], problemIndex];
      next.currentProblemIndex[topicId] = problemIndex + 1;
      return next;
    });
  };

  const completeTopic = (topicId) => {
    save((prev) => {
      const next = { ...prev, completedTopics: [...prev.completedTopics] };
      if (!next.completedTopics.includes(topicId)) next.completedTopics.push(topicId);
      next.currentTopicId = topicId + 1;
      return next;
    });
  };

  const saveNote = (topicId, problemIndex, text) => {
    save((prev) => ({
      ...prev,
      notes: { ...(prev.notes || {}), [`${topicId}-${problemIndex}`]: text },
    }));
  };

  const saveCode = (topicId, problemIndex, code) => {
    save((prev) => ({
      ...prev,
      savedCodes: { ...(prev.savedCodes || {}), [`${topicId}-${problemIndex}`]: code },
    }));
  };

  const resetTopic = (topicId) => {
    save((prev) => {
      const next = {
        ...prev,
        completedTopics: prev.completedTopics.filter((id) => id !== topicId),
        completedProblems: { ...prev.completedProblems, [topicId]: [] },
        currentProblemIndex: { ...prev.currentProblemIndex, [topicId]: 0 },
      };
      if (next.currentTopicId > topicId) next.currentTopicId = topicId;
      return next;
    });
  };

  const resetProgress = () => save((prev) => ({ ...defaultProgress, userName: prev.userName }));

  return { progress, loaded, saveName, saveDifficulty, completeProblem, completeTopic, saveNote, saveCode, resetTopic, resetProgress };
}
