import React from "react";

export interface GalleryProps {
  title?: string;
  subtitle?: string;
  images?: { url: string; alt: string }[];
  bgColor?: string;
  textColor?: string;
}

export function Gallery({ title = "Our Gallery", subtitle, images = [], bgColor, textColor }: GalleryProps) {
  return (
    <section className="bg-white py-24 sm:py-32 dark:bg-zinc-950" style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(Array.isArray(images) ? images : []).map((img, idx) => (
            <div key={idx} className="relative h-64 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
