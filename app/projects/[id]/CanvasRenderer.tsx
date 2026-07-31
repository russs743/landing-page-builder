"use client";

import React from "react";
import { componentRegistry } from "@/components/registry";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CanvasRenderer({ components = [], projectId }: { components?: any[]; projectId?: string }) {
  const router = useRouter();
  const validComponents = components?.filter(c => c && c.type && componentRegistry[c.type]) || [];

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!projectId) return;
    const newComponents = [...validComponents];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newComponents.length) return;

    // Swap elements
    const temp = newComponents[index];
    newComponents[index] = newComponents[targetIndex];
    newComponents[targetIndex] = temp;

    try {
      await fetch('/api/page/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, components: newComponents, action: 'reorder' }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;
    const newComponents = validComponents.filter(c => c.id !== id);

    try {
      await fetch('/api/page/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, components: newComponents, action: 'delete' }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (validComponents.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-12 text-center my-auto">
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-12 max-w-lg">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Canvas Masih Kosong
          </h3>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm">
            Ketik perintah atau klik rekomendasi prompt di sidebar sebelah kiri untuk mulai membuat landing page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full flex flex-col">
      {validComponents.map((component, index) => {
        const Component = componentRegistry[component.type];

        if (!Component) {
          console.warn(
            `Component type "${component.type}" not found in registry.`,
          );
          return null;
        }

        return (
          <div key={component.id || index} className="relative group transition-all">
            {/* Section Control Toolbar on Hover */}
            <div className="absolute top-4 right-6 z-40 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 p-1.5 bg-zinc-900/90 dark:bg-white/90 backdrop-blur-md rounded-xl shadow-xl text-white dark:text-zinc-900 border border-white/20 dark:border-zinc-800 pointer-events-auto">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 opacity-80 border-r border-white/20 dark:border-zinc-300/50 mr-0.5 tracking-wider">
                {component.type}
              </span>
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                title="Naikkan posisi"
                className="p-1 hover:bg-white/20 dark:hover:bg-zinc-200 rounded-lg disabled:opacity-20 transition-colors cursor-pointer"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === validComponents.length - 1}
                title="Turunkan posisi"
                className="p-1 hover:bg-white/20 dark:hover:bg-zinc-200 rounded-lg disabled:opacity-20 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(component.id)}
                title="Hapus section ini"
                className="p-1 hover:bg-red-500 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <Component {...component.props} />
          </div>
        );
      })}
    </div>
  );
}
