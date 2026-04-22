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
        "Consistency beats intensity every single time. 20 minutes today is better than 4 hours on Saturday.",
        "The secret of getting ahead is getting started. Don't wait for motivation; rely on your system.",
        "Your streak is your most valuable asset. Protect it like your career depends on it—because it does.",
        "Successful people do what they need to do even when they don't feel like doing it.",
        "Motivation is what gets you started. Habit is what keeps you going. Focus on building the habit.",
        "Don't break the chain. Use a calendar to mark your progress daily and keep that momentum.",
        "Small daily improvements over time lead to stunning results. Never underestimate the power of 1%.",
        "Discipline is choosing between what you want now and what you want most.",
        "If you're tired, learn to rest, not to quit. A 5-minute session counts as showing up.",
        "Feeling stuck is a sign that you're operating at the edge of your comfort zone. That's where growth happens.",
        "If you're stuck on a bug, walk away from the screen. A 10-minute walk often brings the solution.",
        "Explain the problem to a rubber duck. Speaking the logic out loud exposes the gaps in your thinking.",
        "Break the problem down into the smallest possible parts. Solve the tiniest part first.",
        "When you feel overwhelmed, it's usually because you're looking at the whole mountain instead of the next step.",
        "Theory is useless without application. Build a project for every new concept you learn.",
        "Stop watching tutorials and start building. Struggle is the most effective form of learning.",
        "Your portfolio doesn't need 100 projects; it needs 3 deep, well-architected ones that you can explain.",
        "Build things that solve your own problems. Passion for the solution drives the learning of the technology.",
        "Learning how to learn is more important than learning any specific programming language.",
        "Every line of code you write is a brick in the foundation of your future career."
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
