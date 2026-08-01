import { componentRegistry } from "@/components/registry";

const REQUIRED_SECTIONS = [
  "Navbar",
  "Hero",
  "Features",
  "Pricing",
  "Testimonials",
  "FAQ",
  "CTA",
  "Footer",
  "Gallery",
  "Team",
  "Contact",
] as const;

describe("componentRegistry", () => {
  it("exports a non-empty registry object", () => {
    expect(componentRegistry).toBeDefined();
    expect(typeof componentRegistry).toBe("object");
    expect(Object.keys(componentRegistry).length).toBeGreaterThan(0);
  });

  it("contains at least 6 different section types (requirement)", () => {
    expect(Object.keys(componentRegistry).length).toBeGreaterThanOrEqual(6);
  });

  it.each(REQUIRED_SECTIONS)(
    "registry contains '%s' section",
    (sectionName) => {
      expect(componentRegistry[sectionName]).toBeDefined();
    }
  );

  it("every registered component is a callable function", () => {
    for (const [name, component] of Object.entries(componentRegistry)) {
      expect(typeof component).toBe("function");
    }
  });

  it("does not contain unknown section types", () => {
    const allowedTypes = new Set(REQUIRED_SECTIONS);
    for (const key of Object.keys(componentRegistry)) {
      expect(allowedTypes.has(key as any)).toBe(true);
    }
  });
});
