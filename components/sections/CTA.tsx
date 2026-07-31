import React from 'react';
import { CtaProps as BaseCtaProps } from '@/lib/schema/components';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CtaProps extends BaseCtaProps {
  bgColor?: string;
  textColor?: string;
}

export const CTA: React.FC<CtaProps> = ({ title, subtitle, buttonText, buttonUrl, bgColor, textColor }) => {
  return (
    <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            "relative isolate overflow-hidden px-6 py-12 sm:py-20 text-center shadow-2xl rounded-2xl sm:rounded-3xl",
            bgColor ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-zinc-900 dark:bg-zinc-900"
          )}
        >
          <h2 className={cn("mx-auto max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-white")} style={{ color: textColor }}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn("mx-auto mt-4 max-w-xl text-xs sm:text-base leading-relaxed", !textColor && "text-zinc-300")} style={{ color: textColor, opacity: textColor ? 0.85 : undefined }}>
              {subtitle}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center">
            <a
              href={buttonUrl || '#'}
              className={cn(
                "w-full sm:w-auto rounded-full px-8 py-3 text-xs sm:text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer",
                textColor ? "bg-white/20 hover:bg-white/30 text-current" : "bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-white dark:text-zinc-900"
              )}
              style={{ color: textColor || undefined }}
            >
              {buttonText || 'Mulai Sekarang'}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
