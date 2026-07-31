import React from 'react';
import { FeaturesProps as BaseFeaturesProps } from '@/lib/schema/components';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeaturesProps extends BaseFeaturesProps {
  bgColor?: string;
  textColor?: string;
}

export const Features: React.FC<FeaturesProps> = ({ title, subtitle, items = [], bgColor, textColor }) => {
  return (
    <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-50 dark:bg-zinc-900")} style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="@container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn("mt-3 sm:mt-6 text-sm sm:text-lg leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="mx-auto mt-10 sm:mt-16 lg:mt-20">
          <dl className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {(Array.isArray(items) ? items : []).map((feature, index) => {
              const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.CheckCircle;
              
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    "flex flex-col rounded-2xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md",
                    bgColor 
                      ? "bg-white/10 backdrop-blur-md border border-white/15" 
                      : "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800"
                  )}
                >
                  <dt className={cn("flex items-center gap-x-3 text-sm sm:text-base font-semibold leading-7", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>
                    <div className={cn("flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0", textColor ? "bg-white/20" : "bg-zinc-900 dark:bg-zinc-100")}>
                      <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", textColor ? "text-current" : "text-white dark:text-zinc-900")} aria-hidden="true" style={{ color: textColor }} />
                    </div>
                    <span>{feature.title}</span>
                  </dt>
                  <dd className={cn("mt-3 flex flex-auto flex-col text-xs sm:text-sm leading-relaxed sm:leading-7", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.85 : undefined }}>
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
};
