import { normalizeProps } from "@/lib/utils/normalizeProps";

describe("normalizeProps", () => {
  // ── Alias fixes ───────────────────────────────────────────────────────────

  describe("alias normalization", () => {
    it("converts brandName → logoText for Navbar", () => {
      const result = normalizeProps({ brandName: "BrewMaster" }, "Navbar");
      expect(result.logoText).toBe("BrewMaster");
      expect(result.brandName).toBeUndefined();
    });

    it("converts brand → logoText for Navbar", () => {
      const result = normalizeProps({ brand: "NovaAI" }, "Navbar");
      expect(result.logoText).toBe("NovaAI");
      expect(result.brand).toBeUndefined();
    });

    it("converts companyName → logoText when used as Navbar", () => {
      const result = normalizeProps({ companyName: "Lumina" }, "Navbar");
      expect(result.logoText).toBe("Lumina");
    });

    it("converts imageSrc → imageUrl", () => {
      const result = normalizeProps({ imageSrc: "/img.png" }, "Features");
      expect(result.imageUrl).toBe("/img.png");
      expect(result.imageSrc).toBeUndefined();
    });

    it("removes imageUrl from Hero (never show AI-hallucinated images)", () => {
      const result = normalizeProps({ imageUrl: "/photo.jpg" }, "Hero");
      expect(result.imageUrl).toBeUndefined();
    });
  });

  // ── Color extraction from user message ───────────────────────────────────

  describe("color extraction from message", () => {
    it("injects first hex as bgColor when bgColor is absent", () => {
      const result = normalizeProps({}, "Navbar", "tema #2c1810 teks #f5e6d3");
      expect(result.bgColor).toBe("#2c1810");
    });

    it("injects second hex as textColor when textColor is absent", () => {
      const result = normalizeProps({}, "Navbar", "tema #2c1810 teks #f5e6d3");
      expect(result.textColor).toBe("#f5e6d3");
    });

    it("does NOT overwrite bgColor already provided by AI", () => {
      const result = normalizeProps(
        { bgColor: "#ffffff" },
        "Navbar",
        "tema #2c1810"
      );
      expect(result.bgColor).toBe("#ffffff");
    });
  });

  // ── Auto-fill fallbacks ───────────────────────────────────────────────────

  describe("Navbar auto-fill", () => {
    it("sets default links when links array is empty", () => {
      const result = normalizeProps({ logoText: "Test", links: [] }, "Navbar");
      expect(result.links.length).toBeGreaterThan(0);
      expect(result.links[0]).toHaveProperty("label");
      expect(result.links[0]).toHaveProperty("url");
    });

    it("sets fallback logoText when missing", () => {
      const result = normalizeProps({}, "Navbar");
      expect(result.logoText).toBe("BrandName");
    });

    it("extracts brand from message for logoText fallback", () => {
      const result = normalizeProps(
        {},
        "Navbar",
        "bikin landing page bernama IronPulse tema dark"
      );
      expect(result.logoText).toBe("IronPulse");
    });
  });

  describe("Hero auto-fill", () => {
    it("sets default title when missing", () => {
      const result = normalizeProps({}, "Hero");
      expect(result.title).toContain("Bisnis Anda");
    });

    it("sets default subtitle when missing", () => {
      const result = normalizeProps({}, "Hero");
      expect(typeof result.subtitle).toBe("string");
      expect(result.subtitle.length).toBeGreaterThan(0);
    });

    it("sets default primaryCta when missing", () => {
      const result = normalizeProps({}, "Hero");
      expect(result.primaryCta).toHaveProperty("label");
      expect(result.primaryCta).toHaveProperty("url");
    });
  });

  describe("Features auto-fill", () => {
    it("sets default items when missing", () => {
      const result = normalizeProps({}, "Features");
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items.length).toBeGreaterThan(0);
    });

    it("sets default title when missing", () => {
      const result = normalizeProps({}, "Features");
      expect(typeof result.title).toBe("string");
    });
  });

  describe("Footer auto-fill", () => {
    it("sets default companyName when missing", () => {
      const result = normalizeProps({}, "Footer");
      expect(typeof result.companyName).toBe("string");
    });

    it("sets default copyright text when missing", () => {
      const result = normalizeProps({ companyName: "BrewMaster" }, "Footer");
      expect(result.text).toContain("BrewMaster");
      expect(result.text).toContain(new Date().getFullYear().toString());
    });
  });

  // ── Array enforcement ─────────────────────────────────────────────────────

  describe("array field enforcement", () => {
    it("converts object-valued links to array", () => {
      const result = normalizeProps(
        { logoText: "X", links: { 0: { label: "A", url: "#" } } },
        "Navbar"
      );
      expect(Array.isArray(result.links)).toBe(true);
    });

    it("normalizes plan.features from comma-separated string to array", () => {
      const result = normalizeProps(
        {
          plans: [
            { name: "Pro", price: "$9", features: "Fitur A, Fitur B, Fitur C" },
          ],
        },
        "Pricing"
      );
      expect(Array.isArray(result.plans[0].features)).toBe(true);
      expect(result.plans[0].features).toHaveLength(3);
    });
  });

  // ── Null/undefined safety ─────────────────────────────────────────────────

  describe("null / undefined safety", () => {
    it("handles null props gracefully", () => {
      expect(() => normalizeProps(null, "Navbar")).not.toThrow();
    });

    it("handles undefined props gracefully", () => {
      expect(() => normalizeProps(undefined, "Hero")).not.toThrow();
    });

    it("handles empty object gracefully", () => {
      expect(() => normalizeProps({}, "CTA")).not.toThrow();
    });
  });
});
