"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

export function ChatSidebar({ project }: { project: any }) {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(
    project.conversations?.[0]?.messages || []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // We will create this API route in the next step
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
      
      // Update UI with the AI response
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      
      // Force Next.js to refresh server components (like our CanvasRenderer) 
      // if the AI changed the database.
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">AI Assistant</h2>
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
          Connected
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.filter(m => m.role !== 'system').length === 0 && (
          <div className="text-center text-sm text-zinc-500 mt-10">
            Send a message to start building your landing page!
          </div>
        )}
        
        {messages.filter(m => m.role !== 'system').map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-white border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="max-w-[85%] rounded-2xl bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 px-4 py-3">
              <div className="flex space-x-1.5 items-center h-5">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. Add a hero section about AI tools..."
            className="w-full rounded-full border-0 bg-zinc-100 dark:bg-zinc-900 px-5 py-3.5 pr-12 text-sm text-zinc-900 dark:text-white shadow-inner focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
