import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { Pricing } from './sections/Pricing';
import { Testimonials } from './sections/Testimonials';
import { FAQ } from './sections/FAQ';
import { CTA } from './sections/CTA';
import { Footer } from './sections/Footer';
import { Gallery } from './sections/Gallery';
import { Team } from './sections/Team';
import { Contact } from './sections/Contact';

export const componentRegistry: Record<string, React.FC<any>> = {
  Navbar: Navbar,
  Hero: Hero,
  Features: Features,
  Pricing: Pricing,
  Testimonials: Testimonials,
  FAQ: FAQ,
  CTA: CTA,
  Footer: Footer,
  Gallery: Gallery,
  Team: Team,
  Contact: Contact,
};
