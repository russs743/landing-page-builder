import React from 'react';
import { CtaProps as BaseCtaProps } from '@/lib/schema/components';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CtaProps extends BaseCtaProps {
  bgColor?: string;
  textColor?: string;
  variant?: "contained" | "banner" | "minimal";
}

// ─── Variant: Contained (default) ─────────────────────────────────────────────
const CTAContained: React.FC<CtaProps> = ({ title, subtitle, buttonText, buttonUrl, bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="mx-auto max-w-7xl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        className={cn("relative isolate overflow-hidden px-6 py-12 sm:py-20 text-center shadow-2xl rounded-2xl sm:rounded-3xl", bgColor ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-zinc-900 dark:bg-zinc-900")}
      >
        <h2 className={cn("mx-auto max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-white")} style={{ color: textColor }}>{title}</h2>
        {subtitle && <p className={cn("mx-auto mt-4 max-w-xl text-xs sm:text-base leading-relaxed", !textColor && "text-zinc-300")} style={{ color: textColor, opacity: textColor ? 0.85 : undefined }}>{subtitle}</p>}
        <div className="mt-8 flex items-center justify-center">
          <a href={buttonUrl || '#'}
            className={cn("w-full sm:w-auto rounded-full px-8 py-3 text-xs sm:text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer",
              textColor ? "bg-white/20 hover:bg-white/30 text-current" : "bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-white dark:text-zinc-900")}
            style={{ color: textColor || undefined }}
          >{buttonText || 'Mulai Sekarang'}</a>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── Variant: Banner (full-width inline) ──────────────────────────────────────
const CTABanner: React.FC<CtaProps> = ({ title, subtitle, buttonText, buttonUrl, bgColor, textColor }) => (
  <section
    className={cn("py-10 sm:py-14 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-900 dark:bg-zinc-900")}
    style={{ backgroundColor: bgColor || "#18181b", color: textColor || "#ffffff" }}
  >
    <div className="mx-auto max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10"
      >
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: textColor || "#ffffff" }}>{title}</h2>
          {subtitle && <p className="mt-2 text-xs sm:text-sm leading-relaxed" style={{ color: textColor ? `${textColor}cc` : "rgba(255,255,255,0.65)" }}>{subtitle}</p>}
        </div>
        <a href={buttonUrl || '#'}
          className="shrink-0 rounded-full px-8 py-3 sm:px-10 sm:py-3.5 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          style={{ backgroundColor: textColor ? `${textColor}20` : "#ffffff", color: textColor || "#18181b" }}
          {...(!textColor && { className: "shrink-0 rounded-full bg-white px-8 py-3 sm:px-10 sm:py-3.5 text-sm font-bold text-zinc-900 shadow-lg hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap" })}
        >{buttonText || 'Mulai Sekarang'}</a>
      </motion.div>
    </div>
  </section>
);

// ─── Variant: Minimal (text + link, no box) ───────────────────────────────────
const CTAMinimal: React.FC<CtaProps> = ({ title, subtitle, buttonText, buttonUrl, bgColor, textColor }) => (
  <section className={cn("py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 text-center", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className={cn("text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</h2>
        {subtitle && <p className={cn("mt-6 text-sm sm:text-lg leading-relaxed", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.75 : undefined }}>{subtitle}</p>}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={buttonUrl || '#'}
            className={cn("group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg",
              !textColor && "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100")}
            style={{ backgroundColor: textColor ? `${textColor}` : undefined, color: textColor ? (bgColor || "#ffffff") : undefined }}
          >{buttonText || 'Mulai Sekarang'} <span className="transition-transform group-hover:translate-x-1">→</span></a>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const CTA: React.FC<CtaProps> = (props) => {
  switch (props.variant) {
    case "banner":  return <CTABanner {...props} />;
    case "minimal": return <CTAMinimal {...props} />;
    default:        return <CTAContained {...props} />;
  }
};
