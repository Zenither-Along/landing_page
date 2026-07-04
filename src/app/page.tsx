import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import LinksSection from "@/components/LinksSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      {/* Constrain to mobile width, centered */}
      <div className="w-full max-w-md mx-auto flex flex-col">
        <HeroSection />
        <div className="px-0 pt-6 pb-2">
          <CTAButton />
        </div>
        <LinksSection />
        <Footer />
      </div>
    </main>
  );
}
