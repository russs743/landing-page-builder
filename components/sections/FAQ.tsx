import React, { useState } from 'react';
import { FaqProps as BaseFaqProps } from '@/lib/schema/components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FaqProps extends BaseFaqProps {
  bgColor?: string;
  textColor?: string;
}

export const FAQ: React.FC<FaqProps> = ({ title, subtitle, items = [], bgColor, textColor }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</h2>
          {subtitle && (
            <p className={cn("mt-3 text-xs sm:text-base leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>
              {subtitle}
            </p>
          )}
        </div>
        
        <dl className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
          {(Array.isArray(items) ? items : []).map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all border",
                bgColor 
                  ? "bg-white/10 backdrop-blur-md border-white/15" 
                  : "bg-zinc-50 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800"
              )}
            >
              <dt>
                <button
                  type="button"
                  className={cn("flex w-full items-center justify-between text-left gap-x-4 cursor-pointer", !textColor && "text-zinc-900 dark:text-white")}
                  style={{ color: textColor }}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-xs sm:text-base font-semibold leading-relaxed">{item.question}</span>
                  <span className="flex h-6 w-6 items-center justify-center shrink-0">
                    <ChevronDown
                      className={cn(
                        openIndex === index ? '-rotate-180' : 'rotate-0',
                        'h-4 w-4 sm:h-5 sm:w-5 transform transition-transform duration-200 opacity-70'
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </dt>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.dd 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className={cn("mt-3 text-xs sm:text-sm leading-relaxed pt-2 border-t border-white/10 dark:border-zinc-800", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.85 : undefined }}>
                      {item.answer}
                    </p>
                  </motion.dd>
                )}
              </AnimatePresence>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
