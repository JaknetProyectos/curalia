"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";

export function FeaturedProducts() {
  const t = useTranslations("featuredProducts");
  const { products, loading } = useProducts();
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-brand px-4 md:px-8">
        {/* Encabezado de la sección */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700 mb-3">
            <Award className="h-3.5 w-3.5 text-orange-600" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="heading-title text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl md:text-[38px]">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-zinc-600 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative group">
          {/* Botón Navegación Izquierda */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label={t("previous")}
            className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900 p-3 text-white shadow-xl transition-all duration-200 hover:bg-orange-500 hover:scale-110 active:scale-95 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Carrusel de Productos */}
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pt-2"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[calc(85%)] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.map((product) => (
                  <div
                    key={product.id}
                    className="w-[calc(85%)] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          {/* Botón Navegación Derecha */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label={t("next")}
            className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900 p-3 text-white shadow-xl transition-all duration-200 hover:bg-orange-500 hover:scale-110 active:scale-95 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}