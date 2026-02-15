import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { SectionDivider } from '@/components/landing/SectionDivider';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TechStack } from '@/components/landing/TechStack';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingScreen() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="font-serif">
        <Hero />
        <SectionDivider />
        <HowItWorks />
        <TechStack />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
