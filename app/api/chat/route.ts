import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import OpenAI from "openai";
import { normalizeProps } from "@/lib/utils/normalizeProps";

export async function POST(req: NextRequest) {
  try {
    const { projectId, message } = await req.json();

    if (!projectId || !message) {
      return NextResponse.json({ error: "Missing projectId or message" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured in .env file." }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const modelName = "gemini-3.5-flash";

    console.log(`[API CHAT] Calling Google Gemini API (${modelName}) for prompt: "${message}"`);

    // 1. Fetch project data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        landingPage: true,
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!project || !project.landingPage) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const conversation = project.conversations[0];
    const currentPageData = (project.landingPage.content as any)?.components || [];

    // 2. Save user message
    await prisma.message.create({
      data: {
        role: "user",
        content: message,
        conversationId: conversation.id,
      },
    });

    // 3. Build system prompt
    const systemPrompt = `You are an elite AI landing page builder, award-winning copywriter, and senior UX designer.
Your purpose is to create stunning, professional, high-converting landing pages.

=== LANGUAGE & SLANG DICTIONARY ===
- Always respond in friendly, natural Indonesian.
- Action Intent Mapping:
  * "bikin", "buat", "tambah", "pasangin", "taro", "bikiniln" -> ADD component
  * "ganti", "ubah", "gantiin", "tukar", "set", "kasih" -> UPDATE component
  * "hapus", "apusin", "ilangin", "nuke", "buang", "bersihin", "kosongin", "reset" -> REMOVE or CLEAR components
- Color Intent Mapping:
  * "item", "hitam", "gelap", "dark", "tua" -> #0a0f1e / #121212
  * "ijo", "hijau" -> #16a34a
  * "biru", "biru tua", "navy" -> #0a0f2e / #2563eb
  * "krem", "cream" -> #f5e6d3
  * "coklat", "cokelat", "coklat tua" -> #2c1810
  * "merah" -> #dc2626
  * "putih", "terang", "light" -> #ffffff / #f8fafc

=== CREATIVITY & QUALITY ===
- You are a CREATIVE PARTNER. Write compelling, professional copy. Never use placeholder text.
- When asked for a full page, create multiple components: Navbar, Hero, Features, CTA, Footer at minimum.
- When changing colors/themes, update EVERY component's bgColor and textColor to match.
- Choose harmonious, professional color palettes.
- DO NOT add imageUrl to Hero unless user EXPLICITLY asks for a photo/image.
- ALWAYS choose the variant that best fits the brand context. Don't always use default variants.

=== HANDLING UNKNOWN OR UNSUPPORTED REQUESTS ===
- If the user asks for a feature, layout, or component that is NOT supported in our component registry (e.g. 3D models, video backgrounds, custom shopping cart, etc.):
  * DO NOT invent fake props or pretend the feature works if it doesn't.
  * In `replyToUser`, clearly and politely explain that the feature is not supported in the registry, and list the available options they CAN choose instead (e.g. "Fitur X belum didukung, namun opsi yang tersedia saat ini: 1. Variasi Layout Hero (centered, split, minimal, bold), 2. Kustomisasi warna & badge, 3. Ubah susunan section").
  * If no layout changes can be made, return `changes: []`. If a close alternative exists (e.g. switching to Hero variant "bold"), apply that alternative in `changes` AND explain it in `replyToUser`.

=== VARIANT GUIDE — choose smartly based on context ===
- Hero variant:
  * "centered" (default) — balanced, glowing, works for most brands
  * "split" — shows stats on the right, great for SaaS/tech/data-driven brands
  * "minimal" — editorial, typographic, ideal for creative agencies/portfolios
  * "bold" — dark full-bleed, accent stripe, works for gaming/hype/launch pages
- Features variant:
  * "grid" (default) — 3-col cards, works universally
  * "alternating" — row layout with large icons, great for detailed product explanations
  * "list" — numbered editorial list, ideal for how-it-works or process steps
- Pricing variant:
  * "cards" (default) — vertical plan cards, classic SaaS layout
  * "compact" — horizontal table, good when plans have many features to compare
- Testimonials variant:
  * "grid" (default) — balanced cards for most use cases
  * "masonry" — large quotes with featured first testimonial, great for luxury/premium brands
  * "marquee" — auto-scrolling rows, great for high volume of testimonials / social proof
- CTA variant:
  * "contained" (default) — dark box, high contrast call to action
  * "banner" — full-width inline, less intrusive, good for mid-page CTAs
  * "minimal" — large typographic, no box, feels premium and editorial

=== PROP SCHEMA ===
- Navbar: { logoText, links: [{label, url}], ctaText?, bgColor?, textColor? }
- Hero: { variant?: "centered"|"split"|"minimal"|"bold", title, subtitle?, badgeText?, accentColor?, primaryCta?: {label, url}, secondaryCta?: {label, url}, layout?: "left"|"center"|"right", bgColor?, textColor? }
- Features: { variant?: "grid"|"alternating"|"list", title, subtitle?, items: [{icon, title, description}], bgColor?, textColor? }
- Pricing: { variant?: "cards"|"compact", title, subtitle?, plans: [{name, price, description, features: string[], isPopular?, ctaText}], bgColor?, textColor? }
- Testimonials: { variant?: "grid"|"masonry"|"marquee", title, subtitle?, items: [{quote, author, role}], bgColor?, textColor? }
- FAQ: { title, subtitle?, items: [{question, answer}], bgColor?, textColor? }
- CTA: { variant?: "contained"|"banner"|"minimal", title, subtitle?, buttonText, buttonUrl, bgColor?, textColor? }
- Footer: { companyName, text?, links?: [{label, url}], bgColor?, textColor? }

=== FEW-SHOT EXAMPLES ===
Example 1: User says "bikin landing page brand kopi BrewMaster tema coklat tua #2c1810 dan teks krem #f5e6d3"
Tool Call Output:
{
  "replyToUser": "Landing page BrewMaster telah berhasil dibuat dengan tema coklat tua & krem!",
  "changes": [
    { "action": "add", "type": "Navbar", "props": { "logoText": "BrewMaster", "bgColor": "#2c1810", "textColor": "#f5e6d3", "links": [{"label": "Beranda", "url": "#"}, {"label": "Menu", "url": "#menu"}] } },
    { "action": "add", "type": "Hero", "props": { "variant": "minimal", "title": "Cita Rasa Kopi Asli Nusantara", "subtitle": "Disangrai presisi oleh master roaster pilihan.", "bgColor": "#2c1810", "textColor": "#f5e6d3", "primaryCta": {"label": "Pesan Sekarang", "url": "#"} } },
    { "action": "add", "type": "Features", "props": { "variant": "alternating", "title": "Keunggulan BrewMaster", "bgColor": "#2c1810", "textColor": "#f5e6d3", "items": [{"icon": "Coffee", "title": "Biji Pilihan", "description": "100% Arabika Asli"}, {"icon": "Star", "title": "Roast Presisi", "description": "Aroma sempurna"}] } },
    { "action": "add", "type": "CTA", "props": { "variant": "banner", "title": "Pesan Sekarang", "buttonText": "Order Sekarang", "buttonUrl": "#", "bgColor": "#2c1810", "textColor": "#f5e6d3" } },
    { "action": "add", "type": "Footer", "props": { "companyName": "BrewMaster Coffee", "bgColor": "#2c1810", "textColor": "#f5e6d3" } }
  ]
}

CURRENT PAGE STATE:
${JSON.stringify(currentPageData, null, 2)}`;


    const messagesForAi = [
      { role: "system", content: systemPrompt },
      ...conversation.messages.slice(-6).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // 4. Call AI
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: messagesForAi as any,
      max_tokens: 4096,
      tools: [
        {
          type: "function",
          function: {
            name: "apply_page_changes",
            description: "Apply changes to the landing page. MUST populate all props with real content.",
            parameters: {
              type: "object",
              properties: {
                replyToUser: {
                  type: "string",
                  description: "A friendly reply in the same language as the user.",
                },
                changes: {
                  type: "array",
                  description: "List of changes. Can be empty if only chatting.",
                  items: {
                    type: "object",
                    properties: {
                      action: {
                        type: "string",
                        enum: ["add", "update", "remove", "clear"],
                        description: "'clear' removes ALL components. 'add' adds a new one. 'update' modifies by id. 'remove' deletes by id.",
                      },
                      type: {
                        type: "string",
                        enum: ["Navbar", "Hero", "Features", "Pricing", "Testimonials", "FAQ", "CTA", "Footer", "Gallery", "Team", "Contact"],
                      },
                      id: { type: "string", description: "Required for update/remove." },
                      index: { type: "number", description: "Optional insertion index for add." },
                      props: {
                        type: "object",
                        description: "Component props. DO NOT LEAVE EMPTY {}.",
                        properties: {
                          logoText: { type: "string", description: "Brand name for Navbar (e.g. BrewMaster)" },
                          title: { type: "string", description: "Main headline/title" },
                          subtitle: { type: "string", description: "Subtitle description" },
                          badgeText: { type: "string", description: "Badge tag pill for Hero (e.g. ✨ PROMO SPECIAL)" },
                          accentColor: { type: "string", description: "Hex accent color for buttons & badges (e.g. #3b82f6)" },
                          bgColor: { type: "string", description: "Hex background color code e.g. #2c1810" },
                          textColor: { type: "string", description: "Hex text color code e.g. #f5e6d3" },
                          companyName: { type: "string", description: "Company name for Footer" },
                          text: { type: "string", description: "Footer copyright/description" },
                          ctaText: { type: "string", description: "CTA button label" },
                          buttonText: { type: "string", description: "Button label" },
                          buttonUrl: { type: "string", description: "Button link URL" },
                          layout: { type: "string", enum: ["left", "center", "right"] },
                          variant: { type: "string", description: "Layout variant for the component. Hero: centered|split|minimal|bold. Features: grid|alternating|list. Pricing: cards|compact. Testimonials: grid|masonry|marquee. CTA: contained|banner|minimal." },
                          primaryCta: {
                            type: "object",
                            properties: { label: { type: "string" }, url: { type: "string" } },
                          },
                          secondaryCta: {
                            type: "object",
                            properties: { label: { type: "string" }, url: { type: "string" } },
                          },
                          links: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: { label: { type: "string" }, url: { type: "string" } },
                            },
                          },
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                icon: { type: "string" },
                                title: { type: "string" },
                                description: { type: "string" },
                                quote: { type: "string" },
                                author: { type: "string" },
                                role: { type: "string" },
                                question: { type: "string" },
                                answer: { type: "string" },
                              },
                            },
                          },
                          plans: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: { type: "string" },
                                price: { type: "string" },
                                description: { type: "string" },
                                features: { type: "array", items: { type: "string" } },
                                isPopular: { type: "boolean" },
                                ctaText: { type: "string" },
                              },
                            },
                          },
                        },
                        additionalProperties: true,
                      },
                    },
                    required: ["action"],
                  },
                },
              },
              required: ["replyToUser", "changes"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "apply_page_changes" } },
    });

    if (!completion.choices || completion.choices.length === 0) {
      const apiError = (completion as any).error?.message || "No response from AI model.";
      throw new Error(apiError);
    }

    const aiMessage = completion.choices[0].message;
    let replyText = "I have updated the page for you.";
    let updatedComponents = [...currentPageData];

    if (!aiMessage.tool_calls || aiMessage.tool_calls.length === 0) {
      throw new Error(`Model '${modelName}' tidak mendukung Tool Calling (Function Calling) di OpenRouter.`);
    }

    for (const toolCall of aiMessage.tool_calls) {
      if (toolCall.type === "function" && toolCall.function.name === "apply_page_changes") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          if (args.replyToUser) replyText = args.replyToUser;

          // normalizeProps is imported from @/lib/utils/normalizeProps

          for (const change of (args.changes || [])) {
            const parsedProps = normalizeProps(change.props, change.type, message);

            if (change.action === "clear") {
              updatedComponents = [];
            } else if (change.action === "add") {
              const newId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
              const newComponent = { id: newId, type: change.type, props: parsedProps };
              if (typeof change.index === "number" && change.index >= 0) {
                updatedComponents.splice(change.index, 0, newComponent);
              } else {
                updatedComponents.push(newComponent);
              }
            } else if (change.action === "update") {
              let idx = updatedComponents.findIndex((c: any) => c.id === change.id);
              if (idx === -1 && change.type) {
                idx = updatedComponents.findIndex((c: any) => c.type === change.type);
              }
              if (idx !== -1) {
                updatedComponents[idx] = {
                  ...updatedComponents[idx],
                  props: { ...updatedComponents[idx].props, ...parsedProps },
                };
              }
            } else if (change.action === "remove") {
              let targetId = change.id;
              if (!targetId && change.type) {
                const found = updatedComponents.find((c: any) => c.type === change.type);
                if (found) targetId = found.id;
              }
              if (targetId) {
                updatedComponents = updatedComponents.filter((c: any) => c.id !== targetId);
              }
            }
          }
        } catch (e) {
          console.error("Error processing tool call:", e);
        }
      }
    }

    // 6. Save updated page
    await prisma.landingPage.update({
      where: { id: project.landingPage.id },
      data: { content: { components: updatedComponents } },
    });

    // 7. Save AI reply
    await prisma.message.create({
      data: {
        role: "assistant",
        content: replyText,
        conversationId: conversation.id,
      },
    });

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
