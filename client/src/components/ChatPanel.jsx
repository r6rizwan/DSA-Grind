import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

export default function ChatPanel({ topic, problemIndex, onProblemComplete, onNextProblem, saveNote, saveCode, progress }) {
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("// Write your solution here\n\n");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintAttempt, setHintAttempt] = useState("");
  const [showNextBtn, setShowNextBtn] = useState(false);

  const problemKey = `${topic?.id}-${problemIndex}`;

  useEffect(() => {
    const key = `${topic?.id}-${problemIndex}`;
    setNoteText(progress?.notes?.[key] || "");
    setCode(progress?.savedCodes?.[key] || "// Write your solution here\n\n");
  }, [problemKey]);

  const undoRef = useRef(null);
  const bottomRef = useRef(null);
  const prevProblemRef = useRef(null);

  const problemName = topic?.problems?.[problemIndex];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!topic || problemIndex === null || problemIndex === undefined) return;
    if (prevProblemRef.current === problemKey) return;
    prevProblemRef.current = problemKey;

    setMessages([]);
    setShowEditor(false);
    setShowNextBtn(false);

    const initMsg = `I want to learn about: "${problemName}" from the topic "${topic.name}". Please start by explaining the concept with a real-world analogy before giving me the problem.`;
    sendMessage(initMsg, []);
  }, [problemKey]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowEditor((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (showEditor) handleSubmitCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showEditor, code, loading]);

  const sendMessage = async (text, existingMessages) => {
    const userMsg = { role: "user", content: text };
    const updated = [...existingMessages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { messages: updated, userName: progress?.userName || "" });
      const assistantMsg = { role: "assistant", content: res.data.reply };
      setMessages([...updated, assistantMsg]);
    } catch (err) {
      setMessages([...updated, { role: "assistant", content: "❌ Error connecting to server. Make sure the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim(), messages);
    setInput("");
  };

  const handleSubmitCode = () => {
    if (!code.trim() || loading) return;
    saveCode?.(topic.id, problemIndex, code);
    const msg = `Here is my solution attempt for "${problemName}":\n\`\`\`javascript\n${code}\n\`\`\`\nPlease review it and give me feedback.`;
    sendMessage(msg, messages);
    setShowEditor(false);
  };

  const handleMarkDone = () => {
    setShowToast(true);
    undoRef.current = setTimeout(() => {
      setShowToast(false);
      onProblemComplete?.();
      setShowNextBtn(true);
      sendMessage(`I completed "${problemName}". Give me a one-sentence summary of the key concept I just learned.`, messages);
    }, 4000);
  };

  const handleUndo = () => {
    clearTimeout(undoRef.current);
    setShowToast(false);
  };

  const handleRequestHint = () => {
    if (!hintAttempt.trim() || loading) return;
    const msg = `Before giving me a hint for "${problemName}", here is what I've tried or thought about so far:\n\n"${hintAttempt}"\n\nBased on my attempt above, please give me a small nudge in the right direction — do NOT reveal the solution. If my approach is actually correct, tell me that and encourage me to keep going.`;
    sendMessage(msg, messages);
    setHintAttempt("");
    setShowHint(false);
  };

  if (!topic || problemIndex === null || problemIndex === undefined) {
    return (
      <div className="chat-panel empty-chat">
        <div className="empty-icon">🤖</div>
        <h3>Your AI Tutor is ready</h3>
        <p>Select a topic and problem to begin. The tutor will explain everything from scratch.</p>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header" style={{ borderColor: topic.color }}>
        <span>{topic.emoji}</span>
        <div>
          <strong>{problemName}</strong>
          <small>{topic.name}</small>
        </div>
        <button className="done-btn" onClick={handleMarkDone} title="Mark as complete">
          ✅ Mark Done
        </button>
        <button className="notes-btn" onClick={() => setShowNotes(!showNotes)} title="My notes">
          📝
        </button>
        <button className="hint-btn" onClick={() => setShowHint(!showHint)} title="Get a hint">
          💡
        </button>
      </div>

      <div className="messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.role === "assistant" && <span className="msg-avatar">🤖</span>}
            <div className="msg-bubble">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
            {msg.role === "user" && <span className="msg-avatar user-av">👤</span>}
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <span className="msg-avatar">🤖</span>
            <div className="msg-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
        {showNextBtn && (
          <div className="next-problem-wrap">
            <button
              className="next-problem-btn"
              onClick={() => { setShowNextBtn(false); onNextProblem?.(); }}
              style={{ borderColor: topic.color, color: topic.color }}
            >
              {problemIndex + 1 < topic.problems.length
                ? `→ Next: ${topic.problems[problemIndex + 1]}`
                : `→ Topic Complete! Start Next Topic`}
            </button>
          </div>
        )}
      </div>

      {showHint && (
        <div className="hint-area">
          <div className="hint-header">
            <span>💡 Get a Hint — {problemName}</span>
            <button onClick={() => setShowHint(false)}>✕</button>
          </div>
          <p className="hint-rule">Tell me what you've tried first, then I'll give you a nudge.</p>
          <textarea
            className="hint-input"
            placeholder="Describe your thinking or what you've attempted so far..."
            value={hintAttempt}
            onChange={(e) => setHintAttempt(e.target.value)}
          />
          <button
            className="hint-submit-btn"
            onClick={handleRequestHint}
            disabled={!hintAttempt.trim() || loading}
          >
            Get Hint →
          </button>
        </div>
      )}

      {showNotes && (
        <div className="notes-area">
          <div className="notes-header">
            <span>📝 My Notes — {problemName}</span>
            <button onClick={() => setShowNotes(false)}>✕</button>
          </div>
          <textarea
            className="notes-input"
            placeholder="Write your summary, key insights, or anything you want to remember..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button
            className="save-note-btn"
            onClick={() => { saveNote?.(topic.id, problemIndex, noteText); setShowNotes(false); }}
          >
            Save Note ✓
          </button>
        </div>
      )}

      {showEditor && (
        <div className="editor-area">
          <div className="editor-header">
            <span>📝 Your Solution (JavaScript)</span>
            <button onClick={() => setShowEditor(false)}>✕</button>
          </div>
          <Editor
            height="220px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
          />
          <button className="submit-code-btn" onClick={handleSubmitCode} disabled={loading}>
            Submit for Review →
          </button>
        </div>
      )}

      <div className="input-area">
        <button className="code-toggle-btn" onClick={() => setShowEditor(!showEditor)} title="Open code editor" style={{ background: topic.color }}>
          {"</>"}
        </button>
        <input
          className="chat-input"
          placeholder="Ask a question or type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={loading}
        />
        <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()} style={{ background: topic.color }}>
          ➤
        </button>
      </div>

      {showToast && (
        <div className="toast">
          <span>✅ Marked as done</span>
          <button className="toast-undo" onClick={handleUndo}>Undo</button>
          <div className="toast-bar" />
        </div>
      )}
    </div>
  );
}
