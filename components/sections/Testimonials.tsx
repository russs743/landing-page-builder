import React from 'react';
import { TestimonialsProps as BaseTestimonialsProps } from '@/lib/schema/components';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TestimonialsProps extends BaseTestimonialsProps {
  bgColor?: string;
  textColor?: string;
  variant?: "grid" | "masonry" | "marquee";
}

// ─── Variant: Grid (default) ──────────────────────────────────────────────────
const TestimonialsGrid: React.FC<TestimonialsProps> = ({ title, subtitle, items = [], bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-50 dark:bg-zinc-900")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="@container mx-auto max-w-7xl">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className={cn("text-xs sm:text-sm font-semibold uppercase tracking-wider", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>Testimonials</h2>
        <p className={cn("mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</p>
        {subtitle && <p className={cn("mt-3 sm:mt-4 text-xs sm:text-lg leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      <div className="mx-auto mt-10 sm:mt-16 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {(Array.isArray(items) ? items : []).map((testimonial, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }} className="flex flex-col">
            <figure className={cn("rounded-2xl p-6 sm:p-8 text-xs sm:text-sm leading-relaxed shadow-sm h-full flex flex-col justify-between", bgColor ? "bg-white/10 backdrop-blur-md border border-white/15" : "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800")}>
              <blockquote className={cn("text-xs sm:text-sm leading-relaxed italic", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>
                <p>{`"${testimonial.quote}"`}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-current font-bold text-sm shrink-0" style={{ color: textColor }}>
                  {testimonial.author.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className={cn("font-semibold text-xs sm:text-sm truncate", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{testimonial.author}</div>
                  {testimonial.role && <div className={cn("text-[11px] sm:text-xs truncate", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>{testimonial.role}</div>}
                </div>
              </figcaption>
            </figure>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Variant: Masonry (big centered quotes) ───────────────────────────────────
const TestimonialsMasonry: React.FC<TestimonialsProps> = ({ title, subtitle, items = [], bgColor, textColor }) => (
  <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-white dark:bg-zinc-950")} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-20">
        <p className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</p>
        {subtitle && <p className={cn("mt-3 text-sm sm:text-lg", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(Array.isArray(items) ? items : []).map((testimonial, index) => (
          <motion.figure key={index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12, duration: 0.5 }}
            className={cn("relative p-8 sm:p-10 rounded-3xl", index === 0 && "sm:col-span-2", bgColor ? "bg-white/10 backdrop-blur-md border border-white/15" : "bg-zinc-50 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800")}
          >
            <span className={cn("absolute top-6 left-8 text-6xl font-black leading-none select-none", !textColor && "text-zinc-200 dark:text-zinc-800")} style={{ color: textColor ? `${textColor}20` : undefined }}>"</span>
            <blockquote className={cn("relative text-base sm:text-xl leading-relaxed font-medium mt-4", !textColor && "text-zinc-800 dark:text-zinc-200")} style={{ color: textColor }}>
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6 pt-6 flex items-center gap-4 border-t" style={{ borderColor: textColor ? `${textColor}20` : undefined }}
              {...(!textColor && { className: "mt-6 pt-6 flex items-center gap-4 border-t border-zinc-200 dark:border-zinc-800" })}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: textColor ? `${textColor}20` : undefined, color: textColor }}
                {...(!textColor && { className: "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white" })}
              >{testimonial.author.charAt(0)}</div>
              <div>
                <div className={cn("font-semibold text-sm", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{testimonial.author}</div>
                {testimonial.role && <div className={cn("text-xs mt-0.5", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>{testimonial.role}</div>}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

// ─── Variant: Marquee (auto-scroll) ───────────────────────────────────────────
const TestimonialsMarquee: React.FC<TestimonialsProps> = ({ title, subtitle, items = [], bgColor, textColor }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const doubled = [...safeItems, ...safeItems]; // duplicate for seamless loop

  return (
    <section className={cn("py-12 sm:py-20 lg:py-28 overflow-hidden", !bgColor && "bg-zinc-50 dark:bg-zinc-900")} style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16 text-center">
        <p className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{title}</p>
        {subtitle && <p className={cn("mt-3 text-sm sm:text-lg", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>{subtitle}</p>}
      </div>
      {/* Row 1: left scroll */}
      <div className="relative flex overflow-hidden mb-4">
        <div className="flex gap-4 animate-marquee-left whitespace-nowrap">
          {doubled.map((t, i) => (
            <div key={i} className={cn("inline-flex flex-col min-w-72 sm:min-w-80 p-5 sm:p-6 rounded-2xl shrink-0", bgColor ? "bg-white/10 border border-white/15" : "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800")}>
              <p className={cn("text-xs sm:text-sm italic leading-relaxed", !textColor && "text-zinc-700 dark:text-zinc-300")} style={{ color: textColor }}>"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: textColor ? `${textColor}25` : undefined, color: textColor }}
                  {...(!textColor && { className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" })}
                >{t.author.charAt(0)}</div>
                <div>
                  <span className={cn("text-xs font-semibold", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{t.author}</span>
                  {t.role && <span className={cn("text-[10px] ml-1.5", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.65 : undefined }}>· {t.role}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Row 2: right scroll */}
      <div className="relative flex overflow-hidden">
        <div className="flex gap-4 animate-marquee-right whitespace-nowrap">
          {[...doubled].reverse().map((t, i) => (
            <div key={i} className={cn("inline-flex flex-col min-w-72 sm:min-w-80 p-5 sm:p-6 rounded-2xl shrink-0", bgColor ? "bg-white/10 border border-white/15" : "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800")}>
              <p className={cn("text-xs sm:text-sm italic leading-relaxed", !textColor && "text-zinc-700 dark:text-zinc-300")} style={{ color: textColor }}>"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: textColor ? `${textColor}25` : undefined, color: textColor }}
                  {...(!textColor && { className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" })}
                >{t.author.charAt(0)}</div>
                <div>
                  <span className={cn("text-xs font-semibold", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{t.author}</span>
                  {t.role && <span className={cn("text-[10px] ml-1.5", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.65 : undefined }}>· {t.role}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const Testimonials: React.FC<TestimonialsProps> = (props) => {
  switch (props.variant) {
    case "masonry": return <TestimonialsMasonry {...props} />;
    case "marquee": return <TestimonialsMarquee {...props} />;
    default:        return <TestimonialsGrid {...props} />;
  }
};
