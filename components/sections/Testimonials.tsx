import React from 'react';
import { TestimonialsProps as BaseTestimonialsProps } from '@/lib/schema/components';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TestimonialsProps extends BaseTestimonialsProps {
  bgColor?: string;
  textColor?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ title, subtitle, items = [], bgColor, textColor }) => {
  return (
    <section className={cn("py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8", !bgColor && "bg-zinc-50 dark:bg-zinc-900")} style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="@container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={cn("text-xs sm:text-sm font-semibold uppercase tracking-wider", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>Testimonials</h2>
          <p className={cn("mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>
            {title}
          </p>
          {subtitle && (
            <p className={cn("mt-3 sm:mt-4 text-xs sm:text-lg leading-relaxed", !textColor && "text-zinc-600 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.8 : undefined }}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="mx-auto mt-10 sm:mt-16 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {(Array.isArray(items) ? items : []).map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col"
            >
              <figure className={cn(
                "rounded-2xl p-6 sm:p-8 text-xs sm:text-sm leading-relaxed shadow-sm h-full flex flex-col justify-between",
                bgColor 
                  ? "bg-white/10 backdrop-blur-md border border-white/15" 
                  : "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800"
              )}>
                <blockquote className={cn("text-xs sm:text-sm leading-relaxed italic", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>
                  <p>{`"${testimonial.quote}"`}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-3">
                  {testimonial.avatarUrl ? (
                    <img
                      className="h-9 w-9 rounded-full bg-zinc-50 dark:bg-zinc-900 shrink-0"
                      src={testimonial.avatarUrl}
                      alt={testimonial.author}
                    />
                  ) : (
                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 text-current font-bold text-sm shrink-0" style={{ color: textColor }}>
                      {testimonial.author.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className={cn("font-semibold text-xs sm:text-sm truncate", !textColor && "text-zinc-900 dark:text-white")} style={{ color: textColor }}>{testimonial.author}</div>
                    {testimonial.role && (
                      <div className={cn("text-[11px] sm:text-xs truncate", !textColor && "text-zinc-500 dark:text-zinc-400")} style={{ color: textColor, opacity: textColor ? 0.7 : undefined }}>{testimonial.role}</div>
                    )}
                  </div>
                </figcaption>
              </figure>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
