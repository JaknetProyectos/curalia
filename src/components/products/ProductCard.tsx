"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShoppingCart, Eye } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("productCard");
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(t("addedToCart"), {
      description: product.name,
    });
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10">
      <div>
        {/* Top badges */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-lg bg-orange-50 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-orange-600 border border-orange-100">
            {product.sku}
          </span>
        </div>

        {/* Image container con overlay interactivo */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-50/80 p-4 flex items-center justify-center border border-zinc-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          {/* Botón flotante al hacer Hover para ver detalle */}
          <Link
            href={`/producto/${product.slug}`}
            className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-label={t("viewDetails", { name: product.name })}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-md transition-transform duration-300 hover:scale-110">
              <Eye className="h-5 w-5 text-orange-500" />
            </span>
          </Link>
        </div>

        {/* Product Title */}
        <Link href={`/producto/${product.slug}`} className="mt-4 block">
          <h3 className="line-clamp-2 text-center font-display text-sm font-bold uppercase leading-snug tracking-wide text-zinc-900 transition-colors group-hover:text-orange-600">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Price + Add to cart button */}
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-zinc-100 pt-4">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {t("priceLabel")}
          </span>
          <p className="font-display text-lg font-black tracking-tight text-zinc-900">
            {formatPrice(product.price)}
             <span className="ml-1 text-[10px] font-normal text-zinc-500">
              {t("currencyPlusVat")}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={t("addToCart", { name: product.name })}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-orange-500/25 active:scale-95"
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="h-5 w-16 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-100" />
        </div>
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-100" />
        <div className="mt-4 space-y-2">
          <div className="mx-auto h-4 w-4/5 animate-pulse rounded-lg bg-zinc-100" />
          <div className="mx-auto h-4 w-3/5 animate-pulse rounded-lg bg-zinc-100" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
        <div className="space-y-1">
          <div className="h-3 w-10 animate-pulse rounded bg-zinc-100" />
          <div className="h-6 w-20 animate-pulse rounded-lg bg-zinc-100" />
        </div>
        <div className="h-11 w-11 animate-pulse rounded-2xl bg-zinc-100" />
      </div>
    </div>
  );
}