"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SidebarChat({ project, isLoading, setIsLoading }: { project: any; isLoading: boolean; setIsLoading: (v: boolean) => void }) {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(
    project.conversations?.[0]?.messages || []
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const brandPool = [
    { name: "NovaAI", type: "Startup AI Tech", color: "#0f172a", text: "#f8fafc", accent: "#3b82f6", badge: "✨ AI POWERED 2026" },
    { name: "BrewMaster", type: "Cafe & Kopi Nusantara", color: "#2c1810", text: "#f5e6d3", accent: "#d97706", badge: "☕ 100% ARABIKA" },
    { name: "IronPulse", type: "Gym & Fitness Studio", color: "#090d16", text: "#ffffff", accent: "#ef4444", badge: "🔥 PROMO MEMBER 50%" },
    { name: "Lumina", type: "Skincare Organic & Beauty", color: "#fdf6f0", text: "#881337", accent: "#be123c", badge: "🌸 100% VEGAN & ORGANIC" },
    { name: "VortexGames", type: "Game Studio Cyberpunk", color: "#050515", text: "#00f0ff", accent: "#7000ff", badge: "🎮 STEAM EARLY ACCESS" },
    { name: "VerdeEco", type: "Energi Ramah Lingkungan", color: "#052e16", text: "#ecfdf5", accent: "#10b981", badge: "🌱 GREEN TECHNOLOGY" },
    { name: "BarberCraft", type: "Barbershop Retro Modern", color: "#1c1917", text: "#f5f5f4", accent: "#eab308", badge: "💈 PREMIUM CUT & SHAVE" },
    { name: "ZenithSpace", type: "Coworking & Event Space", color: "#111827", text: "#f3f4f6", accent: "#6366f1", badge: "🏢 OPEN 24/7 JAKARTA" },
  ];

  const generateRandomPrompt = () => {
    const randomBrand = brandPool[Math.floor(Math.random() * brandPool.length)];
    const layouts = ["rata kiri", "rata tengah", "rata kanan"];
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];

    return `Bikin landing page untuk ${randomBrand.type} bernama ${randomBrand.name}. Layout hero ${randomLayout}, badge '${randomBrand.badge}', aksen warna tombol ${randomBrand.accent}, background ${randomBrand.color}. Lengkap dengan Navbar, Hero, Features, Pricing, dan Footer.`;
  };

  const [promptSuggestions, setPromptSuggestions] = useState([
    {
      title: "🚀 Startup SaaS / AI Tech",
      prompt: "Bikin landing page full untuk SaaS NovaAI. Layout hero rata kiri, badge '✨ AI POWERED 2026', aksen biru neon #3b82f6, background gelap #090d16. Lengkap Navbar, Hero, Features, Pricing, dan Footer.",
    },
    {
      title: "☕ Coffee Shop / Cafe Modern",
      prompt: "Bikin landing page brand kopi BrewMaster. Background coklat tua #2c1810, teks krem #f5e6d3, badge '☕ 100% ARABIKA NUSANTARA'. Ada Navbar, Hero, Features, dan Footer.",
    },
    {
      title: "🏋️ Gym & Fitness Cyberpunk",
      prompt: "Bikin landing page gym bernama IronPulse. Tema dark cyberpunk #0f172a, aksen merah #ef4444, badge '🔥 DISKON MEMBER 50%'. Lengkap Navbar, Hero, Features, Pricing, dan Footer.",
    },
    {
      title: "🌿 Skincare / Beauty Luxury",
      prompt: "Bikin landing page skincare Lumina. Tema elegan cream rose #fdf6f0, teks burgundy #881337, badge '🌸 100% ORGANIC'. Ada Navbar, Hero, Features, Testimonials, dan Footer.",
    },
  ]);

  const handleSurpriseMe = () => {
    const newPrompt = generateRandomPrompt();
    setInput(newPrompt);
  };

  const handleShuffleSuggestions = () => {
    const shuffled = [...brandPool].sort(() => 0.5 - Math.random()).slice(0, 4).map(b => ({
      title: `${b.badge.split(' ')[0]} ${b.type}`,
      prompt: `Bikin landing page untuk ${b.type} bernama ${b.name}. Background ${b.color}, aksen ${b.accent}, badge '${b.badge}'. Lengkap Navbar, Hero, Features, dan Footer.`,
    }));
    setPromptSuggestions(shuffled);
  };

  const handleSuggestionClick = (promptText: string) => {
    setInput(promptText);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-generate if canvas is empty and user has submitted an initial prompt
  useEffect(() => {
    const components = (project.landingPage?.content as any)?.components || [];
    const msgs = project.conversations?.[0]?.messages || [];
    const lastMsg = msgs[msgs.length - 1];

    if (components.length === 0 && lastMsg && lastMsg.role === "user" && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setIsLoading(true);

      fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId: project.id,
          message: lastMsg.content
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to generate landing page");
          }
          return res.json();
        })
        .then((data) => {
          if (data.reply) {
            setMessages((prev) => {
              // Avoid duplicate assistant message if already added
              if (prev.some((m) => m.content === data.reply)) return prev;
              return [...prev, { role: "assistant", content: data.reply }];
            });
            router.refresh();
          }
        })
        .catch((err) => {
          console.error("Auto Generation Error:", err);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `❌ Gagal membuat landing page: ${err.message || "Silakan coba lagi."}` }
          ]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [project, router, setIsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId: project.id,
          message: userMessage.content
        }),
      });

      if (!response.ok) {
        let errMsg = "Failed to get response";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errMsg = errorData.error;
            if (errorData.details) errMsg += `: ${errorData.details}`;
          }
        } catch (e) {}
        throw new Error(errMsg);
      }
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ Error: ${error.message || "Please try again."}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const visibleMessages = messages.filter(m => m.role !== 'system');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <div className="shrink-0 p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Google Gemini AI</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[80%] text-zinc-500 text-sm space-y-4 my-auto">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/50 text-blue-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">AI Landing Page Builder</h3>
              <p className="text-xs text-zinc-500 max-w-60">Klik rekomendasi di bawah atau gunakan tombol acak:</p>
            </div>

            <div className="flex items-center gap-2 w-full pt-1">
              <button
                onClick={handleSurpriseMe}
                className="flex-1 py-2 px-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🎲</span> Surprise Me! (Acak Prompt)
              </button>
              <button
                onClick={handleShuffleSuggestions}
                title="Acak daftar rekomendasi"
                className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-medium transition-all cursor-pointer border border-zinc-200 dark:border-zinc-800"
              >
                🔄
              </button>
            </div>

            <div className="w-full space-y-2 pt-2">
              {promptSuggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(item.prompt)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-xs group cursor-pointer"
                >
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.title}
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {item.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {visibleMessages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="max-w-[85%] rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-4 py-4">
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

      <div className="shrink-0 p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        {visibleMessages.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-zinc-400 shrink-0">Coba:</span>
            <button
              onClick={handleSurpriseMe}
              className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 shrink-0 transition-colors cursor-pointer shadow-sm"
            >
              🎲 Surprise Me!
            </button>
            <button
              onClick={() => handleSuggestionClick("Ubah layout hero jadi rata kiri dan tambahkan badge '✨ RILIS TERBARU 2026'")}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 shrink-0 transition-colors cursor-pointer"
            >
              📐 Layout Rata Kiri
            </button>
            <button
              onClick={() => handleSuggestionClick("Ganti aksen warna tombol jadi biru neon #3b82f6 dan tambahkan badge '🔥 DISKON 50%'")}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 shrink-0 transition-colors cursor-pointer"
            >
              ✨ Aksen & Badge
            </button>
            <button
              onClick={() => handleSuggestionClick("Ganti semua warna background jadi tema gelap obsidian #121212")}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 shrink-0 transition-colors cursor-pointer"
            >
              🎨 Tema Gelap
            </button>
            <button
              onClick={() => handleSuggestionClick("Hapus semua komponen di halaman ini")}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 shrink-0 transition-colors cursor-pointer"
            >
              🗑️ Reset All
            </button>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="relative w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 flex items-end p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            placeholder="Ketik perintah atau klik rekomendasi di atas..."
            className="w-full bg-transparent border-0 px-2 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-0 text-sm resize-none max-h-32 min-h-10"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-transform active:scale-95 disabled:opacity-50 ml-2 mb-1 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-center text-[11px] text-zinc-400">Tekan Enter untuk kirim, Shift+Enter untuk baris baru</p>
      </div>
    </div>
  );
}
