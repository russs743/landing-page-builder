import { z } from 'zod';

// Shared sub-schemas
const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

// 1. Hero Schema
export const heroSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  primaryCta: linkSchema.optional(),
  secondaryCta: linkSchema.optional(),
  imageUrl: z.string().url().optional(),
});
export type HeroProps = z.infer<typeof heroSchema>;

// 2. Features Schema
export const featureItemSchema = z.object({
  icon: z.string().describe('Name of lucide-react icon (e.g. Zap, Shield, Star)'),
  title: z.string(),
  description: z.string(),
});
export const featuresSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(featureItemSchema),
});
export type FeaturesProps = z.infer<typeof featuresSchema>;

// 3. Pricing Schema
export const pricingPlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string().optional(),
  features: z.array(z.string()),
  isPopular: z.boolean().optional(),
  ctaText: z.string(),
});
export const pricingSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  plans: z.array(pricingPlanSchema),
});
export type PricingProps = z.infer<typeof pricingSchema>;

// 4. Testimonials Schema
export const testimonialItemSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});
export const testimonialsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(testimonialItemSchema),
});
export type TestimonialsProps = z.infer<typeof testimonialsSchema>;

// 5. FAQ Schema
export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export const faqSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(faqItemSchema),
});
export type FaqProps = z.infer<typeof faqSchema>;

// 6. CTA Schema
export const ctaSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  buttonText: z.string(),
  buttonUrl: z.string(),
});
export type CtaProps = z.infer<typeof ctaSchema>;

// 7. Navbar Schema (Extra, often needed)
export const navbarSchema = z.object({
  logoText: z.string(),
  links: z.array(linkSchema),
  ctaText: z.string().optional(),
});
export type NavbarProps = z.infer<typeof navbarSchema>;

// Union of all component schemas for the page builder
export const componentDataSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('Navbar'), id: z.string(), props: navbarSchema }),
  z.object({ type: z.literal('Hero'), id: z.string(), props: heroSchema }),
  z.object({ type: z.literal('Features'), id: z.string(), props: featuresSchema }),
  z.object({ type: z.literal('Pricing'), id: z.string(), props: pricingSchema }),
  z.object({ type: z.literal('Testimonials'), id: z.string(), props: testimonialsSchema }),
  z.object({ type: z.literal('FAQ'), id: z.string(), props: faqSchema }),
  z.object({ type: z.literal('CTA'), id: z.string(), props: ctaSchema }),
]);

export type ComponentData = z.infer<typeof componentDataSchema>;

// The full page schema
export const landingPageSchema = z.object({
  components: z.array(componentDataSchema),
});
export type LandingPageData = z.infer<typeof landingPageSchema>;
