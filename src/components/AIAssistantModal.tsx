import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User as UserIcon, Sparkles, RefreshCw, Compass } from "lucide-react";
import { ChatMessage, TripPlan } from "../types";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrip?: TripPlan | null;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  activeTrip,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_welcome",
      sender: "assistant",
      text: activeTrip
        ? `Hello! I'm your TripGenius AI Assistant for your trip to **${activeTrip.destination}**. Ask me anything about hotels, attractions, weather, or local recommendations!`
        : "Hello! I'm TripGenius AI Assistant. Tell me where you'd like to travel or ask me for destination suggestions, budget advice, or packing tips!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `m_u_${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripContext: activeTrip,
          message: userText,
          history: messages,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `m_a_${Date.now()}`,
        sender: "assistant",
        text: data.text || "I recommend checking local tourism guides for more details!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `m_err_${Date.now()}`,
          sender: "assistant",
          text: "I experienced a slight connection issue. Please try asking again!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = activeTrip
    ? [
        `What are the best street foods in ${activeTrip.destination}?`,
        `How safe is ${activeTrip.destination} at night?`,
        `What's a good rainy day backup plan?`,
      ]
    : [
        "Recommend a 5-day budget destination under $800",
        "What are the top European cities for foodies?",
        "Tips for first-time solo travelers?",
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl h-[85vh] max-h-[680px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base">TripGenius AI Assistant</h3>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </div>
              <p className="text-[11px] text-indigo-200 truncate">
                {activeTrip ? `Active Trip: ${activeTrip.destination}` : "Smart AI Travel Companion"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {m.sender === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div>
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
                <span className={`text-[10px] text-slate-400 mt-1 block px-1 ${m.sender === "user" ? "text-right" : ""}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                TripGenius AI is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium border border-indigo-200/60 dark:border-indigo-800 shrink-0 transition-colors"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Travel Assistant..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow flex items-center justify-center gap-1 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
