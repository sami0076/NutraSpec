import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { BentoShowcase } from '@/components/landing/BentoShowcase'
import { TechStack } from '@/components/landing/TechStack'
import { About } from '@/components/landing/About'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'

export default function LandingScreen() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="font-serif">
        <Hero />
        <Features />
        <HowItWorks />
        <BentoShowcase />
        <TechStack />
        <About />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
