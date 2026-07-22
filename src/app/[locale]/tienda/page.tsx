"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";

export default function TiendaPage() {
  const t = useTranslations("storePage");
  const { products, loading, error, refetch } = useProducts();
  const [active, setActive] = useState("todos");

  const filtered = useMemo(() => {
    if (active === "todos") return products;
    return products.filter((p) => p.category === active || p.category === active);
  }, [products, active]);

  return (
    <div className="min-h-screen bg-white pb-24 pt-12 text-zinc-900">
      <div className="container-brand px-4 md:px-8">
        {/* Encabezado Principal */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-orange-600">
            {t("badge")}
          </span>
          <h1 className="heading-title font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl md:text-[42px]">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            {t("subtitle")}
          </p>
        </div>

        {/* Filtro de Categorías */}
        <div className="mb-10 flex justify-center">
          <CategoryFilter active={active} onChange={setActive} />
        </div>

        {/* Control de Errores */}
        {error ? (
          <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-zinc-50 py-16 text-center shadow-sm">
            <p className="text-sm font-medium text-zinc-600">
              {t("error.message")}
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t("error.retry")}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Grid de Productos */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
                : filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Estado Vacío */}
            {!loading && filtered.length === 0 && (
              <div className="mx-auto my-12 max-w-md rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300" />
                <p className="mt-4 text-sm font-medium text-zinc-500">
                  {t("empty.message")}
                </p>
                <button
                  type="button"
                  onClick={() => setActive("todos")}
                  className="mt-5 rounded-2xl bg-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
                >
                  {t("empty.resetButton")}
                </button>
              </div>
            )}

            {/* Contador de Productos */}
            {!loading && filtered.length > 0 && (
              <div className="mt-12 flex items-center justify-center">
                <span className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-600">
                  {t("count", { count: filtered.length })}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}