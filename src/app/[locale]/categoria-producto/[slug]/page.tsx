"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronRight, RefreshCw, ShoppingBag } from "lucide-react";
import { useProductsByCategory, useCategory } from "@/hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";

export default function CategoryPage() {
  const t = useTranslations("categoryPage");
  const locale = useLocale();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();

  const { category, loading: categoryLoading, error: categoryError } = useCategory(slug);
  const { products, loading: productsLoading, error: productsError, refetch } = useProductsByCategory(slug);

  const handleFilterChange = (next: string) => {
    if (next === "todos") {
      router.push("/tienda");
    } else {
      router.push(`/categoria-producto/${next}`);
    }
  };

  // Helper para obtener el nombre traducido de la categoría desde la respuesta del hook
  const getCategoryTitle = () => {
    if (!category) return t("defaultTitle");
    
    return category.name;
  };

  // Estado de categoría no encontrada
  if (!categoryLoading && (categoryError || !category)) {
    return (
      <div className="bg-white py-24">
        <div className="container-brand flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center md:px-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {t("notFound.title")}
          </h1>
          <p className="max-w-md text-sm text-zinc-500">
            {t("notFound.description")}
          </p>
          <Link
            href="/tienda"
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
          >
            {t("notFound.button")}
          </Link>
        </div>
      </div>
    );
  }

  const title = getCategoryTitle();

  return (
    <div className="bg-white pb-24 pt-8 text-zinc-900">
      <div className="container-brand px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-400">
          <Link href="/" className="transition-colors hover:text-orange-600">
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          <Link href="/tienda" className="transition-colors hover:text-orange-600">
            {t("breadcrumb.store")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          <span className="font-bold text-zinc-900">
            {categoryLoading ? "..." : title}
          </span>
        </nav>

        {/* Header de Categoría */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-zinc-900 sm:text-4xl md:text-[42px]">
            {categoryLoading ? "..." : title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-500">
            {t("subtitlePrefix")}{" "}
            <span className="font-medium text-zinc-800">{categoryLoading ? "..." : title}</span>.
          </p>
        </div>

        {/* Filtro de Categorías */}
        <div className="mb-12">
          <CategoryFilter active={slug ?? ""} onChange={handleFilterChange} />
        </div>

        {/* Manejo de Error al Cargar Productos */}
        {productsError ? (
          <div className="my-12 flex flex-col items-center gap-4 rounded-3xl border border-zinc-100 bg-zinc-50/50 py-16 text-center">
            <p className="text-sm font-medium text-zinc-600">
              {t("error.message")}
            </p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t("error.retry")}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Grid de Productos */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {productsLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>

            {/* Sin productos */}
            {!productsLoading && products.length === 0 && (
              <div className="my-16 rounded-3xl border border-dashed border-zinc-200 py-20 text-center">
                <p className="text-sm font-medium text-zinc-500">
                  {t("empty")}
                </p>
              </div>
            )}

            {/* Contador de Productos */}
            {!productsLoading && products.length > 0 && (
              <p className="mt-12 text-center text-xs font-semibold text-zinc-400">
                {t("count", { count: products.length })}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}