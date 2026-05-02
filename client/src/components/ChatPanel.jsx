import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

export default function ChatPanel({ topic, problemIndex, onProblemComplete }) {
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("// Write your solution here\n\n");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const bottomRef = useRef(null);
  const prevProblemRef = useRef(null);

  const problemName = topic?.problems?.[problemIndex];
  const problemKey = `${topic?.id}-${problemIndex}`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!topic || problemIndex === null || problemIndex === undefined) return;
    if (prevProblemRef.current === problemKey) return;
    prevProblemRef.current = problemKey;

    setMessages([]);
    setCode("// Write your solution here\n\n");
    setShowEditor(false);

    const initMsg = `I want to learn about: "${problemName}" from the topic "${topic.name}". Please start by explaining the concept with a real-world analogy before giving me the problem.`;
    sendMessage(initMsg, []);
  }, [problemKey]);

  const sendMessage = async (text, existingMessages) => {
    const userMsg = { role: "user", content: text };
    const updated = [...existingMessages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { messages: updated });
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
    const msg = `Here is my solution attempt for "${problemName}":\n\`\`\`javascript\n${code}\n\`\`\`\nPlease review it and give me feedback.`;
    sendMessage(msg, messages);
    setShowEditor(false);
  };

  const handleMarkDone = () => {
    onProblemComplete?.();
    sendMessage(`I understood this problem. Please give me a quick summary of what I learned and what's coming next.`, messages);
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
      </div>

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
    </div>
  );
}
