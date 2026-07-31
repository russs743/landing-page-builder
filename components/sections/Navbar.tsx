import React from "react";
import { NavbarProps as BaseNavbarProps } from "@/lib/schema/components";
import { cn } from "@/lib/utils";

export interface NavbarProps extends BaseNavbarProps {
  bgColor?: string;
  textColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  logoText = "Company",
  links = [],
  ctaText = "Get Started",
  bgColor,
  textColor,
}) => {
  return (
    <header
      className={cn("w-full z-30 transition-all", bgColor ? "relative" : "absolute inset-x-0 top-0")}
      style={{ backgroundColor: bgColor }}
      data-custom-text={!!textColor}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8 flex-wrap gap-y-3"
        aria-label="Global"
      >
        <div className="flex items-center gap-2">
          <a href="#" className="flex items-center gap-2">
            <span className="sr-only">{logoText}</span>
            <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0">
              <span className="text-white dark:text-zinc-900 font-bold text-lg leading-none">
                {logoText.charAt(0)}
              </span>
            </div>
            <span
              className="font-bold text-lg sm:text-xl tracking-tight truncate max-w-37.5 sm:max-w-none"
              style={{ color: textColor || "inherit" }}
            >
              {logoText}
            </span>
          </a>
        </div>

        <div className="flex items-center gap-x-4 sm:gap-x-8 flex-wrap">
          {(Array.isArray(links) ? links : []).map((item) => (
            <a
              key={item.label}
              href={item.url}
              className="text-xs sm:text-sm font-semibold leading-6 transition-colors hover:opacity-80"
              style={{ color: textColor || "inherit" }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {ctaText && (
          <div className="hidden sm:flex items-center">
            <a
              href="#"
              className="rounded-full bg-zinc-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95"
            >
              {ctaText}
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};
