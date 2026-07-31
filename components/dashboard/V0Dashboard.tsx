"use client";

import { SignInButton, SignOutButton, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

import { ProjectCardPreview } from "./ProjectCardPreview";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Home, 
  FolderKanban, 
  MessageSquare, 
  Palette, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Send, 
  MoreHorizontal, 
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ChevronsUpDown,
  CircleDot,
  Star,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  Layers,
  Sparkle,
  LogIn
} from "lucide-react";

export function V0Dashboard({ initialProjects = [] }: { initialProjects?: any[] }) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "chats" | "design" | "templates">("home");
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [promptInput, setPromptInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(true);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);

  // Custom Modals State
  const [renameModalProject, setRenameModalProject] = useState<{ id: string; name: string } | null>(null);
  const [deleteModalProject, setDeleteModalProject] = useState<{ id: string; name: string } | null>(null);
  const [renameInputValue, setRenameInputValue] = useState("");
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  // Search Modal Keyboard Shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreateProject = async (overridePrompt?: string) => {
    if (!isSignedIn) {
      if (openSignIn) openSignIn();
      return;
    }

    const textToSend = overridePrompt || promptInput;
    setIsCreating(true);
    try {
      const res = await fetch("/api/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend }),
      });
      const data = await res.json();
      if (data.project?.id) {
        window.location.href = `/projects/${data.project.id}`;
      }
    } catch (e) {
      console.error(e);
      setIsCreating(false);
    }
  };

  const openRenameModal = (project: { id: string; name: string }, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setRenameModalProject(project);
    setRenameInputValue(project.name || "Untitled Project");
    setActiveMenuProjectId(null);
  };

  const openDeleteModal = (project: { id: string; name: string }, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDeleteModalProject(project);
    setActiveMenuProjectId(null);
  };

  const submitRenameModal = async () => {
    if (!renameModalProject || !renameInputValue.trim()) return;
    setIsSubmittingModal(true);
    try {
      await fetch("/api/project/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rename", projectId: renameModalProject.id, name: renameInputValue.trim() }),
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === renameModalProject.id ? { ...p, name: renameInputValue.trim() } : p))
      );
      setRenameModalProject(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const submitDeleteModal = async () => {
    if (!deleteModalProject) return;
    setIsSubmittingModal(true);
    try {
      await fetch("/api/project/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", projectId: deleteModalProject.id }),
      });
      setProjects((prev) => prev.filter((p) => p.id !== deleteModalProject.id));
      setDeleteModalProject(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const toggleFavorite = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const filteredProjects = projects.filter((p) =>
    (p.name || "Untitled Project").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteProjects = projects.filter((p) => favorites.includes(p.id));

  const getTimeAgo = (dateStr: string) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const templatesList = [
    {
      title: "Startup AI SaaS Platform",
      category: "SaaS & Tech",
      desc: "Hero rata kiri, badge 'AI POWERED 2026', aksen biru neon #3b82f6, background gelap obsidian #090d16.",
      prompt: "Bikin landing page full untuk SaaS NovaAI. Layout hero rata kiri, badge 'AI POWERED 2026', aksen biru neon #3b82f6, background gelap #090d16. Lengkap Navbar, Hero, Features, Pricing, dan Footer.",
    },
    {
      title: "Cafe Kopi Nusantara",
      category: "Food & Beverage",
      desc: "Background coklat tua #2c1810, teks krem #f5e6d3, badge '100% ARABIKA NUSANTARA'.",
      prompt: "Bikin landing page brand kopi BrewMaster. Background coklat tua #2c1810, teks krem #f5e6d3, badge '100% ARABIKA NUSANTARA'. Ada Navbar, Hero, Features, dan Footer.",
    },
    {
      title: "Gym & Fitness Cyberpunk",
      category: "Sports & Health",
      desc: "Tema dark cyberpunk #0f172a, aksen merah #ef4444, badge 'DISKON MEMBER 50%'.",
      prompt: "Bikin landing page gym bernama IronPulse. Tema dark cyberpunk #0f172a, aksen merah #ef4444, badge 'DISKON MEMBER 50%'. Lengkap Navbar, Hero, Features, Pricing, dan Footer.",
    },
    {
      title: "Skincare Organic Beauty",
      category: "Beauty & Lifestyle",
      desc: "Tema elegan cream rose #fdf6f0, teks burgundy #881337, badge '100% ORGANIC'.",
      prompt: "Bikin landing page skincare Lumina. Tema elegan cream rose #fdf6f0, teks burgundy #881337, badge '100% ORGANIC'. Ada Navbar, Hero, Features, Testimonials, dan Footer.",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      
      {/* ================= SEARCH COMMAND PALETTE MODAL (Ctrl+K) ================= */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
              <Search className="w-4 h-4 text-zinc-400 mr-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all projects, chats, and templates..."
                className="w-full py-3.5 bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none"
              />
              <button 
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="text-[10px] font-bold uppercase px-3 py-1 text-zinc-400">Projects ({filteredProjects.length})</div>
              {filteredProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  onClick={() => setShowSearchModal(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderKanban className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-semibold truncate">{p.name || "Untitled Project"}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 shrink-0">{getTimeAgo(p.createdAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM RENAME MODAL ================= */}
      {renameModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Rename Project</h3>
              <button 
                onClick={() => setRenameModalProject(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500">Masukkan nama baru untuk project ini:</p>
            <input
              type="text"
              autoFocus
              value={renameInputValue}
              onChange={(e) => setRenameInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRenameModal();
              }}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => setRenameModalProject(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={submitRenameModal}
                disabled={isSubmittingModal || !renameInputValue.trim()}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40"
              >
                {isSubmittingModal ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM DELETE CONFIRMATION MODAL ================= */}
      {deleteModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Delete Project</h3>
                  <p className="text-xs text-zinc-500">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
              <button 
                onClick={() => setDeleteModalProject(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
              Apakah kamu yakin ingin menghapus <span className="font-bold text-zinc-900 dark:text-white">"{deleteModalProject.name || "Untitled Project"}"</span>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => setDeleteModalProject(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={submitDeleteModal}
                disabled={isSubmittingModal}
                className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-40"
              >
                {isSubmittingModal ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LEFT SIDEBAR (v0 Style) ================= */}
      <aside className={`shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col justify-between p-3 select-none transition-all duration-300 ${
        isSidebarCollapsed ? "w-16" : "w-64"
      }`}>
        <div className="space-y-4">
          
          {/* Collapse Sidebar Button (Top-Right) */}
          <div className="flex items-center justify-end px-1 pt-1">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
            >
              {isSidebarCollapsed ? <PanelLeft className="w-4 h-4 text-zinc-500" /> : <PanelLeftClose className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <button 
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${activeTab === "home" ? "bg-zinc-200/70 dark:bg-zinc-800/80 font-semibold text-zinc-900 dark:text-white" : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"}`}
            >
              <Home className="w-4 h-4 text-zinc-500 shrink-0" />
              {!isSidebarCollapsed && <span>Home</span>}
            </button>

            <button 
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${activeTab === "projects" ? "bg-zinc-200/70 dark:bg-zinc-800/80 font-semibold text-zinc-900 dark:text-white" : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"}`}
            >
              <FolderKanban className="w-4 h-4 text-zinc-500 shrink-0" />
              {!isSidebarCollapsed && <span>Projects</span>}
            </button>

            <button 
              onClick={() => setActiveTab("design")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${activeTab === "design" ? "bg-zinc-200/70 dark:bg-zinc-800/80 font-semibold text-zinc-900 dark:text-white" : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"}`}
            >
              <Palette className="w-4 h-4 text-zinc-500 shrink-0" />
              {!isSidebarCollapsed && <span>Design Systems</span>}
            </button>
          </nav>

          {!isSidebarCollapsed && (
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
              
              {/* Favorites */}
              <div className="space-y-0.5">
                <button 
                  onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <span>Favorites ({favoriteProjects.length})</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFavoritesOpen ? "" : "-rotate-90"}`} />
                </button>

                {isFavoritesOpen && (
                  <div className="space-y-0.5 pl-2 max-h-32 overflow-y-auto no-scrollbar">
                    {favoriteProjects.length === 0 ? (
                      <div className="text-[11px] text-zinc-400 px-3 py-1 italic">Klik ⭐ di project untuk menyimpan favorit</div>
                    ) : (
                      favoriteProjects.map((p) => (
                        <Link
                          key={p.id}
                          href={`/projects/${p.id}`}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 rounded-lg truncate transition-colors"
                        >
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                          <span className="truncate">{p.name || "Untitled Project"}</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Recent Chats */}
              <div className="space-y-0.5">
                <button 
                  onClick={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <span>Recent Chats</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isRecentChatsOpen ? "" : "-rotate-90"}`} />
                </button>

                {isRecentChatsOpen && (
                  <div className="space-y-0.5 pl-2 max-h-40 overflow-y-auto no-scrollbar">
                    {projects.slice(0, 8).map((p) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 rounded-lg truncate transition-colors"
                      >
                        <CircleDot className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">{p.name || "Untitled Project"}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Bottom Profile Footer (Clerk Authentication) */}
        <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
          {isSignedIn ? (
            <>
              <SignOutButton>
                <button 
                  title="Log out"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 rounded-xl transition-colors cursor-pointer font-semibold border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {!isSidebarCollapsed && <span>Log out</span>}
                </button>
              </SignOutButton>

              <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors">
                <UserButton 
                  showName={!isSidebarCollapsed}
                  appearance={{
                    elements: {
                      userButtonBox: "flex flex-row-reverse items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200",
                      userButtonAvatarBox: "w-7 h-7 rounded-full shadow-xs"
                    }
                  }}
                />
                {!isSidebarCollapsed && (
                  <div className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md">
                    PRO
                  </div>
                )}
              </div>
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer">
                <LogIn className="w-3.5 h-3.5" />
                <span>Log in / Sign up</span>
              </button>
            </SignInButton>
          )}
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto relative bg-white dark:bg-zinc-950">
        
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === "home" && (
          <div className="flex flex-col items-center justify-center min-h-full px-6 py-20 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
              What do you want to create?
            </h1>

            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (promptInput.trim()) handleCreateProject();
                  }
                }}
                placeholder="Ask AI to build a landing page..."
                className="w-full min-h-25 max-h-48 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 border-0 focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Gemini 3.5 Flash</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                    <span>Project</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleCreateProject()}
                    disabled={!promptInput.trim() || isCreating}
                    className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-xl">
              {[
                "Startup AI SaaS",
                "Cafe Kopi Nusantara",
                "Gym & Fitness Center",
                "Skincare Organic Beauty"
              ].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setPromptInput(`Bikin landing page full untuk ${tag}`)}
                  className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROJECTS ================= */}
        {activeTab === "projects" && (
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Projects
              </h1>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={() => handleCreateProject()}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs sm:text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Project</span>
                </button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 text-sm">
                No projects found. Click "+ Project" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all relative p-2"
                  >
                    {/* Thumbnail Box - Clickable Container */}
                    <div
                      onClick={() => window.location.href = `/projects/${project.id}`}
                      className="h-44 w-full bg-zinc-100 dark:bg-zinc-900/80 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-center relative overflow-hidden group-hover:shadow-xs transition-all cursor-pointer"
                    >
                      <ProjectCardPreview project={project} />
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(project.id, e);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-full shadow-xs hover:scale-110 transition-transform cursor-pointer z-10"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(project.id) ? "text-amber-400 fill-amber-400" : "text-zinc-400"}`} />
                      </button>
                    </div>

                    {/* Card Footer: Info & 3-Dots Menu */}
                    <div className="flex items-center justify-between pt-3 px-1">
                      <div 
                        onClick={() => window.location.href = `/projects/${project.id}`}
                        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold shrink-0">
                          ▲
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-500 transition-colors">
                            {project.name || "Untitled Project"}
                          </h3>
                          <p className="text-[11px] text-zinc-400">
                            {getTimeAgo(project.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* 3-Dots Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveMenuProjectId(activeMenuProjectId === project.id ? null : project.id);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuProjectId === project.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40 cursor-default"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveMenuProjectId(null);
                              }}
                            />
                            <div 
                              className="absolute right-0 top-8 z-50 w-36 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-1 space-y-1"
                            >
                              <button
                                type="button"
                                onClick={(e) => openRenameModal(project, e)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Rename</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => openDeleteModal(project, e)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: CHATS ================= */}
        {activeTab === "chats" && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Recent Conversations
            </h1>
            <div className="space-y-3">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{p.name || "Untitled Project"}</h3>
                      <p className="text-xs text-zinc-500">ID: {p.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>{getTimeAgo(p.createdAt)}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: DESIGN SYSTEMS ================= */}
        {activeTab === "design" && (
          <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Design Systems
              </h1>
              <p className="mt-2 text-sm text-zinc-500">Color palettes, typography standards, and component libraries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Palette className="w-4 h-4 text-blue-500" />
                  <span>Preset Palet Warna</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 text-white"><span>Obsidian Dark</span><span>#121212</span></div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#2c1810] text-[#f5e6d3]"><span>Warm Coffee</span><span>#2c1810</span></div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d16] text-[#f8fafc]"><span>Deep Navy</span><span>#090d16</span></div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#052e16] text-[#ecfdf5]"><span>Emerald Eco</span><span>#052e16</span></div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Komponen Terdaftar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Navbar", "Hero", "Features", "Pricing", "Testimonials", "FAQ", "CTA", "Footer"].map((c) => (
                    <span key={c} className="px-3 py-1.5 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: TEMPLATES ================= */}
        {activeTab === "templates" && (
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Templates Gallery
              </h1>
              <p className="mt-2 text-sm text-zinc-500">Pilih template siap pakai untuk memulai landing page dalam 1-klik.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templatesList.map((tpl, idx) => (
                <div key={idx} className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 flex flex-col justify-between hover:border-blue-500 transition-all">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md">
                      {tpl.category}
                    </span>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white pt-1">{tpl.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{tpl.desc}</p>
                  </div>
                  <button
                    onClick={() => handleCreateProject(tpl.prompt)}
                    className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm cursor-pointer"
                  >
                    Gunakan Template Ini 🚀
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
