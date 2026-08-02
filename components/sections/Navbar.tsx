import React from "react";
import { NavbarProps as BaseNavbarProps } from "@/lib/schema/components";
import { cn } from "@/lib/utils";

function isDarkColor(color?: string) {
  if (!color) return false;
  const hex = color.replace("#", "");
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

export interface NavbarProps extends BaseNavbarProps {
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  logoText = "Company",
  links = [],
  ctaText = "Get Started",
  bgColor,
  textColor,
  accentColor,
}) => {
  const isDarkBg = isDarkColor(bgColor);

  const buttonBg = accentColor || (isDarkBg ? "#ffffff" : "#111827");
  const buttonTextColor = accentColor ? "#ffffff" : (isDarkBg ? "#111827" : "#ffffff");

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
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: accentColor || (isDarkBg ? "rgba(255,255,255,0.2)" : "#111827"),
                color: "#ffffff",
              }}
            >
              <span className="font-bold text-lg leading-none">
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
              className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: buttonBg,
                color: buttonTextColor,
              }}
            >
              {ctaText}
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};
