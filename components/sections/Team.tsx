import React from "react";

export interface TeamProps {
  title?: string;
  subtitle?: string;
  members?: { name: string; role: string; imageUrl: string }[];
  bgColor?: string;
  textColor?: string;
}

export function Team({ title = "Meet the Team", subtitle, members = [], bgColor, textColor }: TeamProps) {
  return (
    <section className="bg-zinc-50 py-24 sm:py-32 dark:bg-zinc-900" style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {(Array.isArray(members) ? members : []).map((member, idx) => (
            <div key={idx} className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mx-auto h-40 w-40 rounded-full object-cover mb-4" src={member.imageUrl} alt={member.name} />
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
