import React from 'react';
import { FeaturesProps as BaseFeaturesProps } from '@/lib/schema/components';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeaturesProps extends BaseFeaturesProps {
  bgColor?: string;
  textColor?: string;
  variant?: "grid" | "alternating" | "list";
}

// ─── Variant: Grid (default) ──────────────────────────────────────────────────
const FeaturesGrid: React.FC<FeaturesProps> = ({ title, subtitle, items = [], bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-50 dark:bg-zinc-900")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="@container mx-auto max-w-7xl">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</h2>
        {subtitle && <p className={cn("mt-3 sm:mt-6 text-sm sm:text-lg leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      <div className="mx-auto mt-10 sm:mt-16 lg:mt-20">
        <dl className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {(Array.isArray(items) ? items : []).map((feature, index) => {
            const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.CheckCircle;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn("flex flex-col rounded-2xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md", bgColor ? "bg-white/10 backdrop-blur-md border border-white/15" : "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800")}
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

// ─── Variant: Alternating ─────────────────────────────────────────────────────
const FeaturesAlternating: React.FC<FeaturesProps> = ({ title, subtitle, items = [], bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="mx-auto max-w-5xl">
      <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-20">
        <h2 className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</h2>
        {subtitle && <p className={cn("mt-3 sm:mt-6 text-sm sm:text-lg leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      <div className="space-y-12 sm:space-y-20">
        {(Array.isArray(items) ? items : []).map((feature, index) => {
          const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.CheckCircle;
          const isEven = index % 2 === 0;
          return (
            <motion.div key={index} initial={{ opacity: 0, x: isEven ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className={cn("flex flex-col sm:flex-row items-center gap-8 sm:gap-16", !isEven && "sm:flex-row-reverse")}
            >
              <div className={cn("flex-1 flex justify-center")}>
                <div className={cn("w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center shadow-xl", bgColor ? "bg-white/15 border border-white/20" : "bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800")}>
                  <Icon className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: textColor || undefined }} aria-hidden="true"
                    {...(!textColor && { className: "w-12 h-12 sm:w-16 sm:h-16 text-zinc-900 dark:text-white" })}
                  />
                </div>
              </div>
              <div className="flex-2 text-center sm:text-left">
                <h3 className={cn("text-xl sm:text-2xl font-bold mb-3", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{feature.title}</h3>
                <p className={cn("text-sm sm:text-base leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── Variant: List ────────────────────────────────────────────────────────────
const FeaturesList: React.FC<FeaturesProps> = ({ title, subtitle, items = [], bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-50 dark:bg-zinc-900")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 sm:mb-16">
        <h2 className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</h2>
        {subtitle && <p className={cn("mt-3 text-sm sm:text-lg leading-relaxed max-w-2xl", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      <ol className="space-y-0">
        {(Array.isArray(items) ? items : []).map((feature, index) => {
          const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.CheckCircle;
          return (
            <motion.li key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.4 }}
              className={cn("flex gap-6 py-6", index > 0 && "border-t", bgColor ? "border-white/15" : "border-zinc-200 dark:border-zinc-800")}
            >
              <div className={cn("text-3xl sm:text-4xl font-black tabular-nums w-10 shrink-0 pt-1", !textColor && "text-zinc-200 dark:text-zinc-800")}
                style={{ color: textColor ? `${textColor}30` : undefined }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 shrink-0" style={{ color: textColor || undefined }} aria-hidden="true"
                    {...(!textColor && { className: "w-5 h-5 text-zinc-900 dark:text-white shrink-0" })} />
                  <h3 className={cn("text-base sm:text-lg font-semibold", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{feature.title}</h3>
                </div>
                <p className={cn("text-sm leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{feature.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  </section>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Features: React.FC<FeaturesProps> = (props) => {
  switch (props.variant) {
    case "alternating": return <FeaturesAlternating {...props} />;
    case "list":        return <FeaturesList {...props} />;
    default:            return <FeaturesGrid {...props} />;
  }
};
