import React from 'react';
import { PricingProps as BasePricingProps } from '@/lib/schema/components';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface PricingProps extends BasePricingProps {
  bgColor?: string;
  textColor?: string;
}

export const Pricing: React.FC<PricingProps> = ({ title, subtitle, plans = [], bgColor, textColor }) => {
  return (
    <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="@container mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className={cn("text-xs sm:text-sm font-semibold uppercase tracking-wider", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>Pricing</h2>
          <p className={cn("mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>
            {title}
          </p>
          {subtitle && (
            <p className={cn("mx-auto mt-4 max-w-2xl text-sm sm:text-lg leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="isolate mx-auto mt-10 sm:mt-16 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {(Array.isArray(plans) ? plans : []).map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                plan.isPopular ? 'ring-2 ring-zinc-900 dark:ring-white scale-100 lg:scale-105 z-10' : 'ring-1 ring-zinc-200 dark:ring-zinc-800',
                'rounded-3xl p-6 sm:p-8 flex flex-col justify-between',
                bgColor 
                  ? 'bg-white/10 backdrop-blur-md border border-white/15' 
                  : 'bg-white dark:bg-zinc-950'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={cn('text-base sm:text-lg font-semibold leading-8', !textColor && 'text-zinc-900 dark:text-white')} style={{ color: textColor }}>
                    {plan.name}
                  </h3>
                  {plan.isPopular && (
                    <p className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold leading-5 text-zinc-900 dark:text-white shrink-0">
                      Popular
                    </p>
                  )}
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
              <a
                href="#"
                className={cn(
                  'mt-8 block rounded-full py-2.5 px-3 text-center text-xs sm:text-sm font-semibold leading-6 transition-all hover:scale-105 active:scale-95 cursor-pointer',
                  plan.isPopular
                    ? (textColor ? 'bg-white/20 hover:bg-white/30 text-current' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900')
                    : (textColor ? 'bg-white/10 hover:bg-white/20 text-current' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white')
                )}
                style={{ color: textColor || undefined }}
              >
                {plan.ctaText || 'Pilih Paket'}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
