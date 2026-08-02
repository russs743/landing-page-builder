import React from 'react';
import { HeroProps as BaseHeroProps } from '@/lib/schema/components';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface HeroProps extends BaseHeroProps {
  badgeText?: string;
  accentColor?: string;
  layout?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
  variant?: "centered" | "split" | "minimal" | "bold";
}

// ─── Variant: Centered (default) ─────────────────────────────────────────────
const HeroCentered: React.FC<HeroProps> = ({ title, subtitle, primaryCta, secondaryCta, badgeText, accentColor, layout = "center", bgColor, textColor }) => {
  const alignmentClass = layout === "left" ? "text-left items-start" : layout === "right" ? "text-right items-end" : "text-center items-center";
  const justifyClass = layout === "left" ? "justify-start" : layout === "right" ? "justify-end" : "justify-center";

  return (
    <section
      className={cn("relative overflow-hidden pt-12 pb-16 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[320px] sm:w-150 h-80 sm:h-100 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: accentColor ? `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` : `radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)` }}
      />
      <div className="mx-auto max-w-7xl">
        <div className={cn("mx-auto max-w-3xl flex flex-col", alignmentClass)}>
          {badgeText && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="mb-4 sm:mb-6 inline-flex items-center gap-x-2 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md border border-white/20 shadow-sm max-w-full truncate"
              style={{ backgroundColor: accentColor ? `${accentColor}20` : "rgba(255,255,255,0.15)", color: accentColor || textColor || "inherit" }}
            >
              <span className="flex h-2 w-2 rounded-full bg-current animate-pulse shrink-0" />
              <span className="truncate">{badgeText}</span>
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] wrap-break-word"
            style={{ color: textColor }}
          >{title}</motion.h1>
          {subtitle && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className={cn("mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed sm:leading-8 max-w-2xl", !textColor && "text-zinc-600 dark:text-zinc-400")}
              style={{ color: textColor, opacity: textColor ? 0.9 : undefined }}
            >{subtitle}</motion.p>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className={cn("mt-6 sm:mt-10 flex items-center gap-3 sm:gap-x-6 flex-wrap", justifyClass)}
          >
            {primaryCta && (
              <a href={primaryCta.url}
                className="w-full sm:w-auto text-center rounded-full px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{ backgroundColor: accentColor || (textColor ? "rgba(255,255,255,0.2)" : undefined), color: accentColor ? "#ffffff" : undefined }}
                {...(!accentColor && !textColor && { className: "w-full sm:w-auto text-center rounded-full bg-zinc-900 px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95" })}
              >{primaryCta.label}</a>
            )}
            {secondaryCta && (
              <a href={secondaryCta.url}
                className={cn("w-full sm:w-auto text-center text-xs sm:text-sm font-semibold leading-6 hover:opacity-80 transition-opacity", !textColor && "text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors")}
                style={{ color: textColor }}
              >{secondaryCta.label} <span aria-hidden="true">→</span></a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Variant: Split ───────────────────────────────────────────────────────────
const HeroSplit: React.FC<HeroProps> = ({ title, subtitle, primaryCta, secondaryCta, badgeText, accentColor, bgColor, textColor, layout = "left" }) => {
  const isRight = layout === "right";
  const alignmentClass = isRight ? "items-end text-right" : "items-start text-left";
  const justifyClass = isRight ? "justify-end" : "justify-start";

  return (
    <section
      className={cn("relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="mx-auto max-w-7xl">
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center", isRight && "lg:flex-row-reverse")}>
          {/* Text Column */}
          <div className={cn("flex flex-col", alignmentClass, isRight && "lg:order-2")}>
            {badgeText && (
              <motion.div initial={{ opacity: 0, x: isRight ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                className={cn("mb-4 sm:mb-6 inline-flex items-center gap-x-2 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold border border-white/20", isRight ? "self-end" : "self-start")}
                style={{ backgroundColor: accentColor ? `${accentColor}25` : "rgba(255,255,255,0.1)", color: accentColor || textColor || "inherit" }}
              >
                <span className="flex h-2 w-2 rounded-full bg-current animate-pulse shrink-0" />
                <span>{badgeText}</span>
              </motion.div>
            )}
            <motion.h1 initial={{ opacity: 0, x: isRight ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight"
              style={{ color: textColor }}
            >{title}</motion.h1>
            {subtitle && (
              <motion.p initial={{ opacity: 0, x: isRight ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className={cn("mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed max-w-xl", !textColor && "text-zinc-600 dark:text-zinc-400")}
                style={{ color: textColor, opacity: textColor ? 0.85 : undefined }}
              >{subtitle}</motion.p>
            )}
            <motion.div initial={{ opacity: 0, x: isRight ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className={cn("mt-8 flex flex-wrap items-center gap-4", justifyClass)}
            >
              {primaryCta && (
                <a href={primaryCta.url}
                  className="rounded-full px-7 py-3 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: accentColor || (textColor ? "rgba(255,255,255,0.2)" : undefined), color: accentColor ? "#fff" : undefined }}
                  {...(!accentColor && !textColor && { className: "rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 transition-all hover:scale-105 active:scale-95" })}
                >{primaryCta.label}</a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.url}
                  className={cn("text-sm font-semibold hover:opacity-70 transition-opacity", !textColor && "text-zinc-700 dark:text-zinc-300")}
                  style={{ color: textColor }}
                >{secondaryCta.label} →</a>
              )}
            </motion.div>
          </div>
          {/* Stats Column */}
          <motion.div initial={{ opacity: 0, x: isRight ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className={cn("relative hidden lg:flex flex-col gap-4", isRight && "lg:order-1")}
          >
            <div className={cn("rounded-2xl p-8 flex flex-col gap-6", bgColor ? "bg-white/10 backdrop-blur-md border border-white/15" : "bg-zinc-50 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800")}>
              {[{ label: "Active Users", value: "50K+", icon: "👥" }, { label: "Uptime", value: "99.9%", icon: "⚡" }, { label: "Satisfaction", value: "4.9★", icon: "🏆" }].map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <div>
                    <div className="text-2xl font-extrabold" style={{ color: accentColor || textColor || undefined }}>{stat.value}</div>
                    <div className={cn("text-xs font-medium mt-0.5", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: accentColor || "#3b82f6" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Variant: Minimal ─────────────────────────────────────────────────────────
const HeroMinimal: React.FC<HeroProps> = ({ title, subtitle, primaryCta, secondaryCta, bgColor, textColor, accentColor, layout = "left" }) => {
  const isRight = layout === "right";
  const isCenter = layout === "center";

  return (
    <section
      className={cn("pt-16 pb-20 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className={cn("mx-auto max-w-4xl flex flex-col", isRight ? "items-end text-right" : isCenter ? "items-center text-center" : "items-start text-left")}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className={cn("text-xs font-semibold uppercase tracking-widest mb-6", !textColor && "text-zinc-400")}
          style={{ color: accentColor || textColor || undefined, opacity: 0.7 }}
        >— Landing Page</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] wrap-break-word"
          style={{ color: textColor }}
        >{title}</motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className={cn("mt-8 text-base sm:text-xl leading-relaxed max-w-2xl", isRight ? "border-r-4 pr-6" : "border-l-4 pl-6", !textColor && "text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800")}
            style={{ color: textColor, opacity: textColor ? 0.75 : undefined, borderColor: accentColor || undefined }}
          >{subtitle}</motion.p>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
          className={cn("mt-10 flex items-center gap-6", isRight ? "justify-end" : isCenter ? "justify-center" : "justify-start")}
        >
          {primaryCta && (
            <a href={primaryCta.url}
              className="group inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all"
              style={{ color: accentColor || textColor || undefined }}
              {...(!accentColor && !textColor && { className: "group inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white hover:gap-3 transition-all" })}
            >{primaryCta.label} <span className="transition-transform group-hover:translate-x-1">→</span></a>
          )}
          {secondaryCta && (
            <a href={secondaryCta.url}
              className={cn("text-sm font-medium opacity-60 hover:opacity-100 transition-opacity", !textColor && "text-zinc-600 dark:text-zinc-400")}
              style={{ color: textColor }}
            >{secondaryCta.label}</a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ─── Variant: Bold ────────────────────────────────────────────────────────────
const HeroBold: React.FC<HeroProps> = ({ title, subtitle, primaryCta, badgeText, accentColor, bgColor, textColor, layout = "center" }) => {
  const isRight = layout === "right";
  const isLeft = layout === "left";

  return (
    <section
      className={cn("relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-950 dark:bg-zinc-950")}
      style={{ backgroundColor: bgColor || "#09090b", color: textColor || "#ffffff" }}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: accentColor || "#3b82f6" }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className={cn("relative mx-auto max-w-6xl flex flex-col", isRight ? "items-end text-right" : isLeft ? "items-start text-left" : "items-center text-center")}>
        {badgeText && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border"
            style={{ borderColor: accentColor || "rgba(255,255,255,0.2)", color: accentColor || textColor || "#ffffff", backgroundColor: accentColor ? `${accentColor}15` : "rgba(255,255,255,0.05)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor || "#3b82f6" }} />
            {badgeText}
          </motion.div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9]"
          style={{ color: textColor || "#ffffff" }}
        >
          {title.split(' ').map((word, i, arr) =>
            i === Math.floor(arr.length / 2) ? (
              <span key={i} style={{ color: accentColor || undefined }}> {word} </span>
            ) : ` ${word} `
          )}
        </motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed"
            style={{ color: textColor || "rgba(255,255,255,0.65)" }}
          >{subtitle}</motion.p>
        )}
        {primaryCta && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className={cn("mt-12 flex flex-col sm:flex-row items-center gap-4", isRight ? "justify-end" : isLeft ? "justify-start" : "justify-center")}
          >
            <a href={primaryCta.url}
              className="w-full sm:w-auto rounded-full px-10 py-4 text-sm font-extrabold uppercase tracking-wide shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: accentColor || "#ffffff", color: accentColor ? "#ffffff" : "#09090b" }}
            >{primaryCta.label}</a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// ─── Main Component (variant selector) ───────────────────────────────────────
export const Hero: React.FC<HeroProps> = (props) => {
  switch (props.variant) {
    case "split":   return <HeroSplit {...props} />;
    case "minimal": return <HeroMinimal {...props} />;
    case "bold":    return <HeroBold {...props} />;
    default:        return <HeroCentered {...props} />;
  }
};
