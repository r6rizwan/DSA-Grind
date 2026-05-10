import { useEffect } from "react";

export default function InfoModal({ onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal-header">
          <h2>How DSA Grind Works</h2>
          <button className="info-close" onClick={onClose}>✕</button>
        </div>

        <div className="info-sections">
          <div className="info-section">
            <h3>🚀 Getting Started</h3>
            <div className="info-steps">
              <div className="info-step"><span className="step-num">1</span><span>Pick the current topic from the sidebar — locked topics unlock one at a time as you complete them</span></div>
              <div className="info-step"><span className="step-num">2</span><span>Click any problem card to open it in the AI tutor chat</span></div>
              <div className="info-step"><span className="step-num">3</span><span>The AI will explain the concept using a real-world analogy first — no code yet</span></div>
            </div>
          </div>

          <div className="info-section">
            <h3>💻 Solving Problems</h3>
            <div className="info-steps">
              <div className="info-step"><span className="step-num">4</span><span>Once you understand the concept, attempt the problem yourself</span></div>
              <div className="info-step"><span className="step-num">5</span><span>Click the <strong>&lt;/&gt;</strong> button (or press <kbd>Ctrl/Cmd+K</kbd>) to open the code editor</span></div>
              <div className="info-step"><span className="step-num">6</span><span>Write your solution and press <strong>Submit for Review</strong> (or <kbd>Ctrl/Cmd+Enter</kbd>) — the AI will review it</span></div>
            </div>
          </div>

          <div className="info-section">
            <h3>💡 Getting Help</h3>
            <div className="info-steps">
              <div className="info-step"><span className="step-num">7</span><span>Stuck? Click the <strong>💡 Hint</strong> button — but you must describe what you've tried first</span></div>
              <div className="info-step"><span className="step-num">8</span><span>Use <strong>📝 Notes</strong> to save your key insights for each problem — great for revision</span></div>
            </div>
          </div>

          <div className="info-section">
            <h3>✅ Completing Problems</h3>
            <div className="info-steps">
              <div className="info-step"><span className="step-num">9</span><span>Click <strong>✅ Mark Done</strong> when you've understood the problem — you have 4 seconds to undo</span></div>
              <div className="info-step"><span className="step-num">10</span><span>A <strong>Next Problem →</strong> button will appear to take you to the next challenge</span></div>
              <div className="info-step"><span className="step-num">11</span><span>Complete all 5 problems in a topic to unlock the next one</span></div>
            </div>
          </div>

          <div className="info-section coming-soon-section">
            <h3>🎯 Difficulty Levels <span className="coming-soon-tag">Unlocks after completing all topics</span></h3>
            <div className="difficulty-preview">
              <div className="diff-preview-item">
                <span className="diff-dot green"></span>
                <div>
                  <strong>Guided</strong>
                  <span>Full AI assistance — concept explanations, hints, and code review</span>
                </div>
              </div>
              <div className="diff-preview-item">
                <span className="diff-dot yellow"></span>
                <div>
                  <strong>Challenge</strong>
                  <span>Problem only — no concept explanation. Hints available on request</span>
                </div>
              </div>
              <div className="diff-preview-item">
                <span className="diff-dot red"></span>
                <div>
                  <strong>Interview</strong>
                  <span>No hints, no explanations — just like a real technical interview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
