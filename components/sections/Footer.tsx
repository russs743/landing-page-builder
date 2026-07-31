import React from "react";
import { cn } from "@/lib/utils";

export interface FooterProps {
  companyName?: string;
  text?: string;
  links?: { label: string; url: string }[];
  bgColor?: string;
  textColor?: string;
}

export function Footer({ companyName = "Company", text = `© ${new Date().getFullYear()} ${companyName || 'Company'}. Hak cipta dilindungi.`, links = [], bgColor, textColor }: FooterProps) {
  return (
    <footer className={cn("py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center", !bgColor && "bg-zinc-950 text-zinc-400")} style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="mx-auto max-w-7xl flex flex-col items-center">
        <h2 className={cn("text-base sm:text-lg font-bold tracking-tight", !textColor && "text-white")} style={{ color: textColor }}>{companyName}</h2>
        <p className="mt-2 text-xs sm:text-sm opacity-80 max-w-md leading-relaxed" style={{ color: textColor }}>{text}</p>
        {links.length > 0 && (
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {(Array.isArray(links) ? links : []).map((link, idx) => (
              <a key={idx} href={link.url} className="text-xs sm:text-sm opacity-80 hover:opacity-100 transition-opacity" style={{ color: textColor }}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
