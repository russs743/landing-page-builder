import React from "react";

export interface ContactProps {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  bgColor?: string;
  textColor?: string;
}

export function Contact({ title = "Contact Us", subtitle, email, phone, address, bgColor, textColor }: ContactProps) {
  return (
    <section className="bg-white py-24 sm:py-32 dark:bg-zinc-950 text-center" style={{ backgroundColor: bgColor, color: textColor }} data-custom-text={!!textColor}>
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{subtitle}</p>}
        <div className="mt-10 space-y-4 text-zinc-600 dark:text-zinc-300">
          {email && <p><strong>Email:</strong> {email}</p>}
          {phone && <p><strong>Phone:</strong> {phone}</p>}
          {address && <p><strong>Address:</strong> {address}</p>}
        </div>
      </div>
    </section>
  );
}
