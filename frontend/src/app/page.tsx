import OverflowNavbar from "@/components/landing/OverflowNavbar";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofLogos from "@/components/landing/SocialProofLogos";
import ScrollMacbookShowcase from "@/components/landing/ScrollMacbookShowcase";
import FeatureWalkthrough from "@/components/landing/FeatureWalkthrough";
import StatsSection from "@/components/landing/StatsSection";
import PricingSection from "@/components/landing/PricingSection";
import CallToAction from "@/components/landing/CallToAction";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* 1. Overflow-style Sticky Top Navigation */}
      <OverflowNavbar />

      {/* 2. Hero Section with Signature Aurora Mesh Gradient & Dual Pill CTAs */}
      <HeroSection />

      {/* 3. Social Proof Logos Banner */}
      <SocialProofLogos />

      {/* 4. Signature Sticky Scroll-Driven MacBook Showcase (Flow -> Prototype -> Story) */}
      <ScrollMacbookShowcase />

      {/* 5. 2-Column Alternating Feature Walkthrough: "Discover Superpowers" */}
      <FeatureWalkthrough />

      {/* 6. Live Metrics & Reliability Stats */}
      <StatsSection />

      {/* 7. Transparent Pricing Tiers */}
      <PricingSection />

      {/* 8. Pre-footer Call to Action */}
      <CallToAction />

      {/* 9. Modern Minimalist Footer */}
      <LandingFooter />
    </div>
  );
}
