import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { About, Quality, VisionObjectives } from "@/components/home/About";
import { CategoryCatalog } from "@/components/home/CategoryCatalog";
import { CompetitiveAdvantages } from "@/components/home/CompetitiveAdvantages";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Faq } from "@/components/home/Faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <About />
      <Quality />
      <VisionObjectives />
      <CategoryCatalog />
      <CompetitiveAdvantages />
      <FeaturedProducts />
      <CtaBanner />
      <Faq />
    </>
  );
}
