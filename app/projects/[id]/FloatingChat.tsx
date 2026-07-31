"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingChat({ project, isLoading, setIsLoading }: { project: any; isLoading: boolean; setIsLoading: (v: boolean) => void }) {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(
    project.conversations?.[0]?.messages || []
  );
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  // Auto-expand if a new message comes in (from user or AI)
  useEffect(() => {
    const visibleMessages = messages.filter(m => m.role !== 'system');
    if (visibleMessages.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsExpanded(true);

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId: project.id,
          message: userMessage.content 
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const visibleMessages = messages.filter(m => m.role !== 'system');

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 flex flex-col items-center">
      
      <AnimatePresence>
        {isExpanded && visibleMessages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl mb-4 overflow-hidden flex flex-col max-h-[60vh]"
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Chat History</span>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {visibleMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="max-w-[85%] rounded-2xl bg-zinc-100 dark:bg-zinc-800 px-4 py-3">
                    <div className="flex space-x-1.5 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onSubmit={handleSubmit} 
        className="relative w-full shadow-2xl rounded-full bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 flex items-center p-2 group focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-500 transition-all"
      >
        {!isExpanded && visibleMessages.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full p-1.5 shadow-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to build or update the page..."
          className="w-full bg-transparent border-0 px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-0 text-base"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-transform active:scale-95 disabled:opacity-50 ml-2"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
