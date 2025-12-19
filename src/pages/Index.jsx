import Header from "@/components/Header.jsx";
import HeroSection from "@/components/HeroSection.jsx";
import FeaturesSection from "@/components/FeaturesSection.jsx";
import BenefitsSection from "@/components/BenefitsSection.jsx";
import Footer from "@/components/Footer.jsx";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
