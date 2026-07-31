import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTextColor(textColor: string | undefined, defaultClass: string, isMuted = false) {
  if (!textColor) return defaultClass;
  return isMuted ? "text-inherit opacity-80" : "text-inherit";
}
