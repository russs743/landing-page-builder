import React from 'react';
import { PricingProps as BasePricingProps } from '@/lib/schema/components';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface PricingProps extends BasePricingProps {
  bgColor?: string;
  textColor?: string;
  variant?: "cards" | "compact";
}

// ─── Variant: Cards (default) ─────────────────────────────────────────────────
const PricingCards: React.FC<PricingProps> = ({ title, subtitle, plans = [], bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="@container mx-auto max-w-7xl">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className={cn("text-xs sm:text-sm font-semibold uppercase tracking-wider", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>Pricing</h2>
        <p className={cn("mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</p>
        {subtitle && <p className={cn("mx-auto mt-4 max-w-2xl text-sm sm:text-lg leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      <div className="isolate mx-auto mt-10 sm:mt-16 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {(Array.isArray(plans) ? plans : []).map((plan, index) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}
            className={cn(plan.isPopular ? 'ring-2 ring-zinc-900 dark:ring-white scale-100 lg:scale-105 z-10' : 'ring-1 ring-zinc-200 dark:ring-zinc-800', 'rounded-3xl p-6 sm:p-8 flex flex-col justify-between', bgColor ? 'bg-white/10 backdrop-blur-md border border-white/15' : 'bg-white dark:bg-zinc-950')}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className={cn('text-base sm:text-lg font-semibold leading-8', !textColor && 'text-zinc-900 dark:text-white')} style={{ color: textColor }}>{plan.name}</h3>
                {plan.isPopular && <p className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold leading-5 text-zinc-900 dark:text-white shrink-0">Popular</p>}
              </div>
              <p className={cn("mt-2 text-xs sm:text-sm leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{plan.description}</p>
              <p className="mt-4 sm:mt-6 flex items-baseline gap-x-1">
                <span className={cn("text-3xl sm:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{plan.price}</span>
              </p>
              <ul role="list" className={cn("mt-6 sm:mt-8 space-y-3 text-xs sm:text-sm leading-6", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor }}>
                {(Array.isArray(plan.features) ? plan.features : []).map((feature: string) => (
                  <li key={feature} className="flex gap-x-3 items-start">
                    <Check className={cn("h-5 w-5 flex-none shrink-0", textColor ? "text-current" : "text-zinc-900 dark:text-white")} style={{ color: textColor }} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href="#"
              className={cn('mt-8 block rounded-full py-2.5 px-3 text-center text-xs sm:text-sm font-semibold leading-6 transition-all hover:scale-105 active:scale-95 cursor-pointer',
                plan.isPopular
                  ? (textColor ? 'bg-white/20 hover:bg-white/30 text-current' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900')
                  : (textColor ? 'bg-white/10 hover:bg-white/20 text-current' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'))}
              style={{ color: textColor || undefined }}
            >{plan.ctaText || 'Pilih Paket'}</a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Variant: Compact (horizontal table) ─────────────────────────────────────
const PricingCompact: React.FC<PricingProps> = ({ title, subtitle, plans = [], bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-50 dark:bg-zinc-900")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-10 sm:mb-16">
        <p className={cn("text-2xl sm:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</p>
        {subtitle && <p className={cn("mt-3 text-sm sm:text-lg", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      <div className={cn("rounded-2xl overflow-hidden", bgColor ? "border border-white/20" : "ring-1 ring-zinc-200 dark:ring-zinc-800")}>
        {(Array.isArray(plans) ? plans : []).map((plan, index) => (
          <motion.div key={plan.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-6 sm:p-8",
              index > 0 && (bgColor ? "border-t border-white/10" : "border-t border-zinc-200 dark:border-zinc-800"),
              plan.isPopular && (bgColor ? "bg-white/10" : "bg-zinc-50 dark:bg-zinc-800/50"),
              bgColor ? "" : "bg-white dark:bg-zinc-950"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className={cn("text-base sm:text-lg font-bold", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{plan.name}</h3>
                {plan.isPopular && <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">Popular</span>}
              </div>
              <p className={cn("mt-1 text-xs sm:text-sm", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>{plan.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {(Array.isArray(plan.features) ? plan.features : []).map((f: string) => (
                  <span key={f} className={cn("flex items-center gap-1 text-xs", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>
                    <Check className="w-3 h-3 shrink-0" aria-hidden="true" /> {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
              <span className={cn("text-2xl sm:text-3xl font-black", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{plan.price}</span>
              <a href="#" className={cn("rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all hover:scale-105 cursor-pointer",
                plan.isPopular
                  ? (textColor ? "bg-white/20 hover:bg-white/30" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900")
                  : (textColor ? "bg-white/10 hover:bg-white/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"))}
                style={{ color: textColor || undefined }}
              >{plan.ctaText || 'Pilih'}</a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Pricing: React.FC<PricingProps> = (props) => {
  switch (props.variant) {
    case "compact": return <PricingCompact {...props} />;
    default:        return <PricingCards {...props} />;
  }
};
