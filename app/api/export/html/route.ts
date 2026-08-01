import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// Generates a self-contained HTML file from the page's component JSON
// Uses Tailwind CDN + inline styles — no React runtime needed

function componentToHtml(type: string, props: any): string {
  const bg = props.bgColor ? `style="background-color:${props.bgColor};color:${props.textColor || 'inherit'}"` : "";
  const textStyle = props.textColor ? `style="color:${props.textColor}"` : "";
  const mutedStyle = props.textColor ? `style="color:${props.textColor};opacity:0.75"` : "";

  switch (type) {
    case "Navbar": {
      const links = (props.links || []).map((l: any) =>
        `<a href="${l.url || "#"}" class="text-sm font-medium hover:opacity-70 transition-opacity" ${textStyle}>${l.label}</a>`
      ).join("");
      return `
<nav class="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b ${!props.bgColor ? "bg-white/90 border-zinc-200 dark:bg-zinc-950/90 dark:border-zinc-800" : "border-white/10"}" ${bg}>
  <div class="text-lg font-extrabold tracking-tight" ${textStyle}>${props.logoText || "Brand"}</div>
  <nav class="hidden md:flex items-center gap-6">${links}</nav>
  ${props.ctaText ? `<a href="#" class="rounded-full px-4 py-2 text-sm font-semibold ${!props.bgColor ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-white/20"}" ${textStyle}>${props.ctaText}</a>` : ""}
</nav>`;
    }

    case "Hero": {
      const variant = props.variant || "centered";
      const alignClass = variant === "split" ? "text-left" : "text-center mx-auto";
      const accentGlow = props.accentColor
        ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:300px;border-radius:50%;background:radial-gradient(circle,${props.accentColor}40 0%,transparent 70%);filter:blur(60px);pointer-events:none;z-index:0"></div>`
        : "";
      return `
<section class="relative overflow-hidden py-24 lg:py-32 px-6 lg:px-8 ${!props.bgColor ? "bg-white dark:bg-zinc-950" : ""}" ${bg}>
  ${accentGlow}
  <div class="relative z-10 max-w-4xl ${alignClass}">
    ${props.badgeText ? `<div class="inline-flex items-center gap-2 mb-6 text-xs font-semibold px-4 py-2 rounded-full border border-white/20" style="background:${props.accentColor ? props.accentColor + "20" : "rgba(255,255,255,0.1)"};color:${props.accentColor || props.textColor || "inherit"}">● ${props.badgeText}</div>` : ""}
    <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight" ${textStyle}>${props.title || ""}</h1>
    ${props.subtitle ? `<p class="mt-6 text-lg leading-relaxed max-w-2xl ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${props.subtitle}</p>` : ""}
    <div class="mt-10 flex flex-wrap gap-4 ${variant !== "split" ? "justify-center" : ""}">
      ${props.primaryCta ? `<a href="${props.primaryCta.url || "#"}" class="rounded-full px-8 py-3.5 text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity" style="background:${props.accentColor || (props.textColor ? "rgba(255,255,255,0.2)" : "#18181b")};color:${props.accentColor ? "#fff" : props.textColor || "#fff"}">${props.primaryCta.label}</a>` : ""}
      ${props.secondaryCta ? `<a href="${props.secondaryCta.url || "#"}" class="text-sm font-semibold hover:opacity-70 transition-opacity" ${textStyle}>${props.secondaryCta.label} →</a>` : ""}
    </div>
  </div>
</section>`;
    }

    case "Features": {
      const items = (props.items || []).map((f: any) =>
        `<div class="rounded-2xl p-8 ${!props.bgColor ? "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800" : "bg-white/10 border border-white/15"}">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl ${!props.bgColor ? "bg-zinc-900 dark:bg-zinc-100" : "bg-white/20"}">${f.icon ? "✦" : "✓"}</div>
          <h3 class="text-base font-semibold mb-2 ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${f.title}</h3>
          <p class="text-sm leading-relaxed ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${f.description}</p>
        </div>`
      ).join("");
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-zinc-50 dark:bg-zinc-900" : ""}" ${bg}>
  <div class="max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-4xl font-bold tracking-tight ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${props.title || ""}</h2>
      ${props.subtitle ? `<p class="mt-4 text-lg ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${props.subtitle}</p>` : ""}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${items}</div>
  </div>
</section>`;
    }

    case "Pricing": {
      const plans = (props.plans || []).map((p: any) =>
        `<div class="rounded-3xl p-8 flex flex-col ${p.isPopular ? "ring-2 ring-zinc-900 dark:ring-white scale-105" : "ring-1 ring-zinc-200 dark:ring-zinc-800"} ${!props.bgColor ? "bg-white dark:bg-zinc-950" : "bg-white/10 border border-white/15"}">
          <h3 class="text-lg font-semibold ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${p.name}</h3>
          ${p.isPopular ? `<span class="mt-1 text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white self-start">Popular</span>` : ""}
          <p class="mt-2 text-sm ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${p.description || ""}</p>
          <p class="mt-6 text-4xl font-black ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${p.price}</p>
          <ul class="mt-8 space-y-3 flex-1">
            ${(p.features || []).map((f: string) => `<li class="flex items-start gap-2 text-sm ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}><span>✓</span><span>${f}</span></li>`).join("")}
          </ul>
          <a href="#" class="mt-8 block text-center rounded-full py-3 px-4 text-sm font-semibold transition-all hover:opacity-90 ${p.isPopular ? (!props.textColor ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white/20") : (!props.textColor ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "bg-white/10")}">${p.ctaText || "Pilih Paket"}</a>
        </div>`
      ).join("");
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-white dark:bg-zinc-950" : ""}" ${bg}>
  <div class="max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <p class="text-xs font-semibold uppercase tracking-wider ${!props.textColor ? "text-zinc-500" : ""}" ${mutedStyle}>Pricing</p>
      <h2 class="mt-2 text-4xl font-bold ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${props.title || ""}</h2>
      ${props.subtitle ? `<p class="mt-4 text-lg ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${props.subtitle}</p>` : ""}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">${plans}</div>
  </div>
</section>`;
    }

    case "Testimonials": {
      const items = (props.items || []).map((t: any) =>
        `<figure class="rounded-2xl p-8 ${!props.bgColor ? "bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800" : "bg-white/10 border border-white/15"}">
          <blockquote class="text-sm leading-relaxed italic ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>"${t.quote}"</blockquote>
          <figcaption class="mt-6 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-zinc-100 dark:bg-zinc-800" ${textStyle}>${t.author.charAt(0)}</div>
            <div>
              <div class="text-sm font-semibold ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${t.author}</div>
              ${t.role ? `<div class="text-xs ${!props.textColor ? "text-zinc-500 dark:text-zinc-400" : ""}" ${mutedStyle}>${t.role}</div>` : ""}
            </div>
          </figcaption>
        </figure>`
      ).join("");
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-zinc-50 dark:bg-zinc-900" : ""}" ${bg}>
  <div class="max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-4xl font-bold ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${props.title || ""}</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${items}</div>
  </div>
</section>`;
    }

    case "FAQ": {
      const items = (props.items || []).map((f: any) =>
        `<details class="group py-5 border-b ${!props.bgColor ? "border-zinc-200 dark:border-zinc-800" : "border-white/15"}">
          <summary class="flex items-center justify-between cursor-pointer text-sm font-semibold ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${f.question}<span class="ml-4">↓</span></summary>
          <p class="mt-3 text-sm leading-relaxed ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${f.answer}</p>
        </details>`
      ).join("");
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-white dark:bg-zinc-950" : ""}" ${bg}>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-4xl font-bold mb-4 ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${props.title || ""}</h2>
    ${props.subtitle ? `<p class="mb-12 text-lg ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${props.subtitle}</p>` : ""}
    <div>${items}</div>
  </div>
</section>`;
    }

    case "CTA": {
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-white dark:bg-zinc-950" : ""}" ${bg}>
  <div class="max-w-7xl mx-auto">
    <div class="rounded-3xl py-20 px-8 text-center shadow-2xl ${!props.bgColor ? "bg-zinc-900" : "bg-white/10 border border-white/20"}">
      <h2 class="text-4xl font-bold ${!props.textColor ? "text-white" : ""}" ${textStyle}>${props.title || ""}</h2>
      ${props.subtitle ? `<p class="mt-4 text-base ${!props.textColor ? "text-zinc-300" : ""}" ${mutedStyle}>${props.subtitle}</p>` : ""}
      <div class="mt-8">
        <a href="${props.buttonUrl || "#"}" class="inline-block rounded-full px-10 py-3.5 text-sm font-bold transition-all hover:opacity-90 ${!props.textColor ? "bg-white text-zinc-900" : "bg-white/20"}" ${textStyle}>${props.buttonText || "Mulai Sekarang"}</a>
      </div>
    </div>
  </div>
</section>`;
    }

    case "Gallery": {
      const images = (props.images || []).map((img: any) =>
        `<div class="rounded-2xl overflow-hidden aspect-video ${!props.bgColor ? "bg-zinc-200 dark:bg-zinc-800" : "bg-white/10"}">
          <img src="${img.src || img}" alt="${img.alt || ""}" class="w-full h-full object-cover" />
        </div>`
      ).join("");
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-zinc-50 dark:bg-zinc-900" : ""}" ${bg}>
  <div class="max-w-7xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-16 ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${props.title || "Gallery"}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${images}</div>
  </div>
</section>`;
    }

    case "Team": {
      const members = (props.members || []).map((m: any) =>
        `<div class="text-center">
          <div class="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold ${!props.bgColor ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "bg-white/20"}" ${textStyle}>${m.name.charAt(0)}</div>
          <h3 class="font-semibold ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${m.name}</h3>
          <p class="text-sm ${!props.textColor ? "text-zinc-500 dark:text-zinc-400" : ""}" ${mutedStyle}>${m.role || ""}</p>
        </div>`
      ).join("");
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-white dark:bg-zinc-950" : ""}" ${bg}>
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-16 ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${props.title || "Team"}</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">${members}</div>
  </div>
</section>`;
    }

    case "Contact": {
      return `
<section class="py-24 px-6 lg:px-8 ${!props.bgColor ? "bg-zinc-50 dark:bg-zinc-900" : ""}" ${bg}>
  <div class="max-w-xl mx-auto text-center">
    <h2 class="text-4xl font-bold mb-4 ${!props.textColor ? "text-zinc-900 dark:text-white" : ""}" ${textStyle}>${props.title || "Contact"}</h2>
    ${props.subtitle ? `<p class="mb-10 text-lg ${!props.textColor ? "text-zinc-600 dark:text-zinc-400" : ""}" ${mutedStyle}>${props.subtitle}</p>` : ""}
    <form class="space-y-4 text-left">
      <input type="text" placeholder="Nama" class="w-full px-4 py-3 rounded-xl border text-sm ${!props.bgColor ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" : "border-white/20 bg-white/10"}" ${textStyle} />
      <input type="email" placeholder="Email" class="w-full px-4 py-3 rounded-xl border text-sm ${!props.bgColor ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" : "border-white/20 bg-white/10"}" ${textStyle} />
      <textarea placeholder="Pesan" rows="4" class="w-full px-4 py-3 rounded-xl border text-sm ${!props.bgColor ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" : "border-white/20 bg-white/10"}" ${textStyle}></textarea>
      <button type="submit" class="w-full rounded-full py-3 text-sm font-semibold ${!props.bgColor ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white/20"}" ${textStyle}>Kirim Pesan</button>
    </form>
  </div>
</section>`;
    }

    case "Footer": {
      const links = (props.links || []).map((l: any) =>
        `<a href="${l.url || "#"}" class="text-sm hover:opacity-70 transition-opacity" ${mutedStyle}>${l.label}</a>`
      ).join("");
      return `
<footer class="py-12 px-6 ${!props.bgColor ? "bg-zinc-950 text-white" : ""}" ${bg}>
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    <p class="text-sm" ${mutedStyle}>${props.text || `© ${new Date().getFullYear()} ${props.companyName || "Company"}`}</p>
    ${links ? `<nav class="flex gap-6">${links}</nav>` : ""}
  </div>
</footer>`;
    }

    default:
      return "";
  }
}

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("id");
    if (!projectId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { landingPage: true },
    });

    if (!project || !project.landingPage) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const components: any[] = (project.landingPage.content as any)?.components || [];

    // Generate HTML for each section
    const sectionsHtml = components
      .map((c) => componentToHtml(c.type, c.props || {}))
      .join("\n");

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name || "Landing Page"}</title>
  <meta name="description" content="Created with AI Landing Page Builder" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; margin: 0; }
    details summary::-webkit-details-marker { display: none; }
  </style>
  <script>tailwind.config = { darkMode: 'class' }</script>
</head>
<body>
${sectionsHtml}
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${project.name?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "landing-page"}.html"`,
      },
    });
  } catch (err) {
    console.error("[export/html]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
