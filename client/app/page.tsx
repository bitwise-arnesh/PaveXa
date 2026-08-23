import { Hero } from "@/components/home/hero";
import { PortalSection } from "@/components/home/portal-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { ScrollToTop } from "@/components/home/scroll-to-top";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="landing-page">
        <Hero />
        <PortalSection />
        <HowItWorks />
        <CtaSection />
      </main>

      <Footer />

      <ScrollToTop />
    </>
  );
}