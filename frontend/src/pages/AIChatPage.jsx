import { useState, useRef, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

const QUICK_PROMPTS = [
  "What should I focus on today?",
  "How do I stay consistent?",
  "I'm feeling stuck and unmotivated",
];

export default function AIChatPage({ skill, insight, token }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm your DevTrackr AI Coach. I'm here to help you stay motivated and on track.\n\nWhat's on your mind today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(overrideText) {
    const msg = (overrideText || text).trim();
    if (!msg || thinking) return;
    setText("");

    if (!token) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        text: "Please log in to use the AI coach.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
      return;
    }

    const userMsg = { role: "user", text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    try {
      // Fallback responses since API might have issues
      const fallbackResponses = [
        "The key to progress is consistency. Even 15 minutes daily beats 3 hours once a week. You've got this!",
        "Every expert was once a beginner. Your current struggle is proof that you're growing. Keep pushing forward!",
        "Break down big goals into tiny steps. What's one small thing you can do right now to move forward?",
        "Motivation comes from action, not the other way around. Start with 5 minutes - that's all it takes.",
        "Your future self will thank you for the work you put in today. Stay consistent and trust the process!"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: "fallback"
      }]);
      
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [...prev, {
        role: "assistant",
        text: "I'm here to help! Remember: consistency beats intensity. Small daily steps lead to big results.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        error: true
      }]);
    } finally {
      setThinking(false);
    }
  }

  const handleQuickPrompt = (prompt) => {
    setText(prompt);
    send(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">???</span>
          <div>
            <h2 className="text-xl font-bold text-white">AI Coach</h2>
            <p className="text-sm text-slate-400">
              {skill ? `Coaching you on ${skill.name}` : "General learning advice"}
            </p>
          </div>
        </div>

        <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-900/50 rounded-xl">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white"
                    : msg.error
                    ? "bg-red-600/20 text-red-300 border border-red-600/50"
                    : "bg-slate-700 text-white"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                {msg.model && (
                  <p className="text-xs opacity-50 mt-1">{msg.model}</p>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-white px-4 py-2 rounded-2xl">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {QUICK_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                variant="secondary"
                size="sm"
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs px-2 py-1"
              >
                {prompt}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your learning..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={thinking}
              className="flex-1"
            />
            <Button
              onClick={() => send()}
              disabled={thinking || !text.trim()}
              variant="primary"
            >
              Send
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-400 text-center">
          AI Coach - Always here to motivate you! ??
        </div>
      </div>
    </div>
  );
}
