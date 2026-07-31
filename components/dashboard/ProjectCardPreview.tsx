"use client";

import React from "react";
import { componentRegistry } from "@/components/registry";
import { Sparkles } from "lucide-react";

export function ProjectCardPreview({ project }: { project: any }) {
  const components = (project?.landingPage?.content as any)?.components || [];
  const validComponents = components.filter(
    (c: any) => c && c.type && componentRegistry[c.type]
  );

  // If no components exist yet, show a sleek placeholder frame
  if (validComponents.length === 0) {
    return (
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-10 h-10 rounded-2xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Draft Landing Page
        </span>
      </div>
    );
  }

  // Render top 3 sections (Navbar + Hero + Features) scaled down to 100% full width match
  const previewSections = validComponents.slice(0, 3);

  return (
    <div className="w-full h-full relative overflow-hidden bg-white dark:bg-zinc-950 select-none pointer-events-none">
      <div className="w-[357%] h-[357%] scale-[0.28] origin-top-left flex flex-col pointer-events-none shrink-0 overflow-hidden">
        {previewSections.map((comp: any, idx: number) => {
          const Comp = componentRegistry[comp.type];
          if (!Comp) return null;
          return <Comp key={comp.id || idx} {...comp.props} />;
        })}
      </div>
      {/* Subtle overlay gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
