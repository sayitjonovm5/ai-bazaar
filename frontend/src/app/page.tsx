import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import BentoFeatures from "@/components/landing/BentoFeatures";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/PricingSection";
import CallToAction from "@/components/landing/CallToAction";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Sticky Frosted Header */}
      <LandingNavbar />

      {/* Hero Section with Aurora Mesh Glow and MacBook Mockup */}
      <HeroSection />

      {/* Key Stats and Platform Metrics */}
      <StatsSection />

      {/* Bento Grid Features */}
      <BentoFeatures />

      {/* 3-Step Pipeline Workflow */}
      <HowItWorks />

      {/* Pricing Tiers */}
      <PricingSection />

      {/* Pre-footer Call to Action */}
      <CallToAction />

      {/* Modern Minimalist Footer */}
      <LandingFooter />
    </div>
  );
}
