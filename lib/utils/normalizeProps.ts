/**
 * normalizeProps
 *
 * Sanitizes and auto-fills component props coming from the AI tool call.
 * Handles alias mistakes, missing required fields, color extraction from
 * the user's raw message, and ensures array fields are always arrays.
 *
 * @param props         - Raw props object from AI
 * @param componentType - The section type string (e.g. "Navbar", "Hero")
 * @param message       - Original user message, used to extract hex colors / brand name
 */
export function normalizeProps(
  props: any,
  componentType?: string,
  message: string = ""
): any {
  if (!props || typeof props !== "object") props = {};
  const out: any = { ...props };

  // --- Extract hints from user message ---
  const brandMatch = message.match(
    /(?:brand|bernama|perusahaan|startup|untuk)\s+([A-Za-z0-9_\-]{2,20})/i
  );
  const extractedBrand = brandMatch ? brandMatch[1].trim() : undefined;

  const hexMatches = message.match(/#[0-9a-fA-F]{6}\b/g);
  const promptBgColor = hexMatches?.[0];
  const promptTextColor = hexMatches?.[1];

  // --- Fix common alias mistakes ---
  if (out.brandName && !out.logoText) {
    out.logoText = out.brandName;
    delete out.brandName;
  }
  if (out.brand && !out.logoText) {
    out.logoText = out.brand;
    delete out.brand;
  }
  if (
    out.companyName &&
    !out.logoText &&
    componentType === "Navbar"
  ) {
    out.logoText = out.companyName;
  }
  if (out.name && !out.logoText && componentType === "Navbar") {
    out.logoText = out.name;
  }
  if (out.imageSrc && !out.imageUrl) {
    out.imageUrl = out.imageSrc;
    delete out.imageSrc;
  }
  // Hero should never have imageUrl unless explicitly requested
  if (componentType === "Hero" && out.imageUrl) {
    delete out.imageUrl;
  }

  // --- Inject hex colors extracted from prompt ---
  if (promptBgColor && !out.bgColor) out.bgColor = promptBgColor;
  if (promptTextColor && !out.textColor) out.textColor = promptTextColor;

  // --- Auto-fill fallback props per component type ---
  if (componentType === "Navbar") {
    if (!out.logoText) out.logoText = extractedBrand || "BrandName";
    if (!out.links || !Array.isArray(out.links) || out.links.length === 0) {
      out.links = [
        { label: "Beranda", url: "#" },
        { label: "Fitur", url: "#features" },
        { label: "Kontak", url: "#contact" },
      ];
    }
  }

  if (componentType === "Hero") {
    if (!out.title)
      out.title = `Solusi Terbaik ${
        extractedBrand ? "untuk " + extractedBrand : "Bisnis Anda"
      }`;
    if (!out.subtitle)
      out.subtitle =
        "Tingkatkan produktivitas dan pertumbuhan bisnis Anda dengan layanan modern dan terpercaya.";
    if (!out.primaryCta)
      out.primaryCta = { label: "Mulai Sekarang", url: "#" };
  }

  if (componentType === "Features") {
    if (!out.title) out.title = "Fitur Unggulan Kami";
    if (!out.items || !Array.isArray(out.items) || out.items.length === 0) {
      out.items = [
        {
          icon: "Zap",
          title: "Performa Cepat",
          description: "Proses cepat dan efisien untuk hasil maksimal.",
        },
        {
          icon: "Shield",
          title: "Keamanan Terjamin",
          description: "Perlindungan data tingkat tinggi untuk bisnis Anda.",
        },
        {
          icon: "Star",
          title: "Kualitas Terbaik",
          description:
            "Pengalaman pengguna terbaik dengan standar profesional.",
        },
      ];
    }
  }

  if (componentType === "Footer") {
    if (!out.companyName) out.companyName = extractedBrand || "Company";
    if (!out.text)
      out.text = `© ${new Date().getFullYear()} ${out.companyName}. Hak cipta dilindungi.`;
  }

  // --- Parse accidentally stringified JSON ---
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (
      typeof val === "string" &&
      (val.startsWith("[") || val.startsWith("{"))
    ) {
      try {
        out[key] = JSON.parse(val.replace(/'/g, '"'));
      } catch (_) {
        // keep original string if parsing fails
      }
    }
  }

  // --- Ensure array fields are always arrays ---
  const arrayFields = ["links", "items", "plans", "images", "members"];
  for (const field of arrayFields) {
    if (out[field] !== undefined && !Array.isArray(out[field])) {
      out[field] =
        typeof out[field] === "object" ? Object.values(out[field]) : [];
    }
  }

  // --- Normalize plan features ---
  if (Array.isArray(out.plans)) {
    out.plans = out.plans.map((plan: any) => ({
      ...plan,
      features: Array.isArray(plan.features)
        ? plan.features
        : typeof plan.features === "string"
          ? plan.features.split(",").map((f: string) => f.trim())
          : [],
    }));
  }

  return out;
}
