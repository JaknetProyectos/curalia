"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Minus,
  Plus,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

import { ProductCard } from "@/components/products/ProductCard";
import { useProduct, useProductsByCategory } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { useCategories } from "@/hooks/useCategories";

export default function ProductPage() {
  const t = useTranslations("productPage");
  const locale = useLocale();
  const { categories, loading: catsloading } = useCategories();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { product, loading, error } = useProduct(slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading || catsloading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <div className="container-brand flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
          <Package className="h-8 w-8" />
        </div>
        <h1 className="heading-title text-2xl font-bold text-zinc-900">
          {t("notFound.title")}
        </h1>
        <p className="max-w-md text-sm text-zinc-500">
          {t("notFound.description")}
        </p>
        <Link
          href="/tienda"
          className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
        >
          {t("notFound.button")}
        </Link>
      </div>
    );
  }

  // Obtener nombre traducido de la categoría dinámica
  const foundCat = categories.find((c) => c.slug === product.category);
  const categoryName = foundCat
    ? typeof foundCat.name === "object"
      ? foundCat.name[locale] || foundCat.name || foundCat.name
      : foundCat.name
    : t("breadcrumb.store");

  const handleAdd = () => {
    addItem(product, quantity);
    toast.success(t("toast.success"), {
      description: `${quantity} × ${product.name}`,
    });
  };

  return (
    <div className="bg-zinc-50/60 pb-24 pt-8 text-zinc-900">
      <div className="container-brand px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-400">
          <Link href="/" className="transition-colors hover:text-orange-500">
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          <Link href="/tienda" className="transition-colors hover:text-orange-500">
            {t("breadcrumb.store")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          <Link
            href={`/categoria-producto/${product.category}`}
            className="transition-colors hover:text-orange-500"
          >
            {categoryName}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          <span className="truncate max-w-[200px] text-zinc-600">{product.name}</span>
        </nav>

        {/* Grid Principal del Producto */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Tarjeta de Imagen de Producto */}
          <div className="relative flex aspect-square items-center justify-center rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("available")}
            </span>
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[80%] w-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Tarjeta de Información y Venta */}
          <div className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <div>
              <div className="inline-block rounded-lg bg-orange-100/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
                {categoryName}
              </div>

              <h1 className="heading-title mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-2 border-b border-zinc-100 pb-6">
                <span className="text-3xl font-black text-zinc-900 md:text-4xl">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  {t("priceSuffix")}
                </span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-zinc-600 md:text-base">
                {product.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                <span className="uppercase text-zinc-400">SKU:</span>
                <span className="font-mono font-bold text-zinc-800">{product.sku}</span>
              </div>
            </div>

            {/* Selector de cantidad y Botón de añadir */}
            <div className="mt-10 pt-6 border-t border-zinc-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Selector de cantidad */}
                <div className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-1">
                  <button
                    type="button"
                    aria-label={t("decreaseQuantity")}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-white hover:text-orange-500 hover:shadow-sm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-12 bg-transparent text-center font-mono text-sm font-bold text-zinc-900 outline-none"
                  />
                  <button
                    type="button"
                    aria-label={t("increaseQuantity")}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-white hover:text-orange-500 hover:shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Botón Naranja de Añadir al carrito */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 px-8 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{t("addToCart")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        <RelatedProducts categorySlug={product.category} excludeId={product.id} />
      </div>
    </div>
  );
}

function RelatedProducts({
  categorySlug,
  excludeId,
}: {
  categorySlug: string;
  excludeId: string;
}) {
  const t = useTranslations("productPage.related");
  const { products, loading } = useProductsByCategory(categorySlug);
  const related = products.filter((p: Product) => p.id !== excludeId).slice(0, 4);

  if (!loading && related.length === 0) return null;

  return (
    <section className="mt-20 border-t border-zinc-200/80 pt-16">
      <div className="mb-8 text-center">
        <h2 className="heading-title text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {loading
          ? null
          : related.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-zinc-50 pb-20 pt-10">
      <div className="container-brand px-4 md:px-8">
        <div className="mb-8 h-4 w-48 animate-pulse rounded-lg bg-zinc-200" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-zinc-200" />
          <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="h-6 w-24 animate-pulse rounded-lg bg-zinc-200" />
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-zinc-200" />
            <div className="h-8 w-1/3 animate-pulse rounded-lg bg-zinc-200" />
            <div className="h-24 w-full animate-pulse rounded-lg bg-zinc-200" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}