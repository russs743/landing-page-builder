"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MoreHorizontal, 
  Share, 
  Pencil, 
  Trash2,
  X,
  FileCode,
  FileDown,
  Download,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export function ProjectHeaderActions({ projectId }: { projectId: string }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [renameInput, setRenameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [isExportingJsx, setIsExportingJsx] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openRename = () => {
    setIsDropdownOpen(false);
    setShowRenameModal(true);
  };

  const openDelete = () => {
    setIsDropdownOpen(false);
    setShowDeleteModal(true);
  };

  const handleRenameSubmit = async () => {
    if (!renameInput.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/project/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rename", projectId, name: renameInput.trim() }),
      });
      setShowRenameModal(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/project/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", projectId }),
      });
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/share/${projectId}`;
    navigator.clipboard.writeText(url);
    alert("Public link copied to clipboard!");
  };

  const handleExportHtml = async () => {
    setIsExportingHtml(true);
    setShowExportDropdown(false);
    try {
      const a = document.createElement("a");
      a.href = `/api/export/html?id=${projectId}`;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setIsExportingHtml(false), 1500);
    }
  };

  const handleExportJsx = async () => {
    setIsExportingJsx(true);
    setShowExportDropdown(false);
    try {
      const a = document.createElement("a");
      a.href = `/api/export/jsx?id=${projectId}`;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setIsExportingJsx(false), 1500);
    }
  };

  return (
    <div className="flex items-center space-x-2 pointer-events-auto">
      
      {/* Custom Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Rename Project</h3>
              <button 
                onClick={() => setShowRenameModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500">Masukkan nama baru untuk project ini:</p>
            <input
              type="text"
              autoFocus
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
              }}
              placeholder="Project Name..."
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleRenameSubmit}
                disabled={isSubmitting || !renameInput.trim()}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95 text-left">
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
                onClick={() => setShowDeleteModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
              Apakah Anda yakin ingin menghapus project ini secara permanen?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-40"
              >
                {isSubmitting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Container */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
            isDropdownOpen 
              ? "bg-zinc-100 border-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" 
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          }`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 p-1 space-y-1 z-50">
            <button 
              onClick={openRename} 
              className="group flex w-full items-center px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <Pencil className="mr-2 h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-600" />
              <span>Rename</span>
            </button>
            <button 
              onClick={openDelete} 
              className="group flex w-full items-center px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Export Dropdown */}
      <div className="relative" ref={exportDropdownRef}>
        <button
          onClick={() => setShowExportDropdown(!showExportDropdown)}
          title="Export"
          className={`flex h-9 items-center gap-1.5 px-3 rounded-md border text-xs font-semibold transition-colors cursor-pointer ${
            showExportDropdown
              ? "bg-zinc-100 border-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          }`}
        >
          {isExportingHtml || isExportingJsx ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span>Export</span>
        </button>

        {showExportDropdown && (
          <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 p-1 space-y-1 z-50">
            <button
              onClick={handleExportHtml}
              disabled={isExportingHtml}
              className="group flex w-full items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileDown className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-600 shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Download HTML</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Self-contained .html file</div>
              </div>
            </button>
            <button
              onClick={handleExportJsx}
              disabled={isExportingJsx}
              className="group flex w-full items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileCode className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-600 shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Export JSX (.zip)</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Vite + React project</div>
              </div>
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={handleShare} 
        title="Share Project Link"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
      >
        <Share className="h-4 w-4" />
      </button>
    </div>
  );
}
