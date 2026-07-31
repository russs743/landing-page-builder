"use client";

import React, { useState } from "react";
import { CanvasRenderer } from "./CanvasRenderer";
import { SidebarChat } from "./SidebarChat";
import { ProjectHeaderActions } from "./ProjectHeaderActions";
import { Monitor, Smartphone, Tablet, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

export function WorkspaceArea({ project }: { project: any }) {
  const router = useRouter();
  const [view, setView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const components = (project.landingPage?.content as any)?.components || [];
  const [isLoading, setIsLoading] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themePresets = [
    {
      name: "Obsidian Dark",
      bgColor: "#121212",
      textColor: "#ffffff",
      dot: "#121212",
    },
    {
      name: "Warm Coffee",
      bgColor: "#2c1810",
      textColor: "#f5e6d3",
      dot: "#2c1810",
    },
    {
      name: "Deep Navy",
      bgColor: "#090d16",
      textColor: "#f8fafc",
      dot: "#090d16",
    },
    {
      name: "Emerald Eco",
      bgColor: "#052e16",
      textColor: "#ecfdf5",
      dot: "#052e16",
    },
    {
      name: "Cream Rose",
      bgColor: "#fdf6f0",
      textColor: "#881337",
      dot: "#fdf6f0",
    },
    {
      name: "Clean Light",
      bgColor: "#ffffff",
      textColor: "#111827",
      dot: "#ffffff",
    },
  ];

  const handleApplyTheme = async (theme: {
    bgColor: string;
    textColor: string;
  }) => {
    setIsLoading(true);
    setShowThemeMenu(false);
    try {
      await fetch("/api/page/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          action: "applyTheme",
          theme,
        }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Left Sidebar for Chat */}
      <div className="w-87.5 lg:w-100 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative z-20">
        <SidebarChat
          project={project}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <div className="h-16 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 z-50 relative">
          {/* Left Controls: 1-Click Theme Preset Bar */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-blue-500" />
              <span>Tema Warna</span>
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute top-full mt-2 left-0 z-50 w-56 p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase px-2 py-1 text-zinc-400">
                    Pilih Preset Tema
                  </div>
                  {themePresets.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyTheme(t)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer transition-colors"
                    >
                      <span className="font-medium">{t.name}</span>
                      <div
                        className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 shadow-sm shrink-0"
                        style={{ backgroundColor: t.dot }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Center Controls: Responsive Device Switcher */}
          <div className="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 space-x-1">
            <button
              onClick={() => setDevice("desktop")}
              title="Desktop View"
              className={`p-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${device === "desktop" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice("tablet")}
              title="Tablet View"
              className={`p-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${device === "tablet" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDevice("mobile")}
              title="Mobile View"
              className={`p-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${device === "mobile" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Right Controls: View mode & Actions */}
          <div className="flex items-center space-x-3">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 flex space-x-1">
              <button
                onClick={() => setView("preview")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${view === "preview" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
              >
                Preview
              </button>
              <button
                onClick={() => setView("code")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${view === "code" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
              >
                Code
              </button>
            </div>

            <ProjectHeaderActions projectId={project.id} />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-950 relative flex flex-col items-center p-0">
          {/* AI Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="flex flex-col items-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50">
                <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 border-4 border-zinc-100 dark:border-zinc-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-zinc-900 dark:border-white rounded-full border-t-transparent animate-spin"></div>
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                  Memproses Perubahan...
                </h3>
                <p className="text-sm text-zinc-500 max-w-62.5 text-center">
                  Mengatur komponen dan gaya visual landing page.
                </p>
              </div>
            </div>
          )}

          <div
            className={`w-full transition-all duration-300 flex flex-col ${
              device === "mobile"
                ? "max-w-97.5 h-187.5 my-auto rounded-[44px] border-12 border-zinc-900 shadow-2xl overflow-y-auto overflow-x-hidden bg-white dark:bg-zinc-950 relative shrink-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                : device === "tablet"
                  ? "max-w-3xl h-205 my-auto rounded-3xl border-10 border-zinc-900 shadow-2xl overflow-y-auto overflow-x-hidden bg-white dark:bg-zinc-950 relative shrink-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  : "w-full min-h-full"
            }`}
          >
            {view === "preview" ? (
              <CanvasRenderer components={components} projectId={project.id} />
            ) : (
              <div className="p-8 w-full min-h-full bg-zinc-950 text-emerald-400 overflow-auto font-mono text-xs leading-relaxed">
                <pre>{JSON.stringify(components, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
