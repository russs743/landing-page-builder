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
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, primaryCta, secondaryCta, imageUrl, badgeText, accentColor, layout = "center", bgColor, textColor }) => {
  const alignmentClass = layout === "left" ? "text-left items-start" : layout === "right" ? "text-right items-end" : "text-center items-center";
  const justifyClass = layout === "left" ? "justify-start" : layout === "right" ? "justify-end" : "justify-center";

  return (
    <section 
      className={cn("relative overflow-hidden pt-12 pb-16 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")}
      style={{ backgroundColor: bgColor, color: textColor }}
      data-custom-text={!!textColor}
    >
      {/* Dynamic ambient glow decoration */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[320px] sm:w-150 h-80 sm:h-100 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{
          background: accentColor 
            ? `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` 
            : `radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)`
        }}
      />
      
      <div className="mx-auto max-w-7xl">
        <div className={cn("mx-auto max-w-3xl flex flex-col", alignmentClass)}>
          {badgeText && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 sm:mb-6 inline-flex items-center gap-x-2 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md border border-white/20 shadow-sm max-w-full truncate"
              style={{
                backgroundColor: accentColor ? `${accentColor}20` : "rgba(255, 255, 255, 0.15)",
                color: accentColor || textColor || "inherit"
              }}
            >
              <span className="flex h-2 w-2 rounded-full bg-current animate-pulse shrink-0" />
              <span className="truncate">{badgeText}</span>
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] wrap-break-word"
            style={{ color: textColor }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed sm:leading-8 max-w-2xl"
              style={{ color: textColor || undefined, opacity: textColor ? 0.9 : undefined }}
              {...(!textColor && { className: "mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400" })}
            >
              {subtitle}
            </motion.p>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn("mt-6 sm:mt-10 flex items-center gap-3 sm:gap-x-6 flex-wrap", justifyClass)}
          >
            {primaryCta && (
              <a
                href={primaryCta.url}
                className="w-full sm:w-auto text-center rounded-full px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: accentColor || (textColor ? "rgba(255, 255, 255, 0.2)" : undefined),
                  color: accentColor ? "#ffffff" : undefined
                }}
                {...(!accentColor && !textColor && { className: "w-full sm:w-auto text-center rounded-full bg-zinc-900 px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95" })}
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a 
                href={secondaryCta.url} 
                className="w-full sm:w-auto text-center text-xs sm:text-sm font-semibold leading-6 hover:opacity-80 transition-opacity"
                style={{ color: textColor }}
                {...(!textColor && { className: "w-full sm:w-auto text-center text-xs sm:text-sm font-semibold leading-6 text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" })}
              >
                {secondaryCta.label} <span aria-hidden="true">→</span>
              </a>
            )}
          </motion.div>
        </div>
        
        {imageUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 sm:mt-16 flow-root"
          >
            <div className="rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <img
                src={imageUrl}
                alt="App screenshot"
                width={2432}
                height={1442}
                className="rounded-lg sm:rounded-xl shadow-2xl border border-white/10 w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
