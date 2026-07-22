"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl"; // Importa useLocale de tu librería de i18n (ej. next-intl)
import { supabase } from "@/supabase/client";

// --- INTERFACES ---
export type Category = {
  slug: string;
  name: string;
};

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  slug: string;
  category: string;
  image: string;
}

// --- HELPER MAPPING FUNCTIONS ---
function mapProduct(item: any): Product {
  const trans = Array.isArray(item.curalia_product_translations)
    ? item.curalia_product_translations[0]
    : item.curalia_product_translations;

  const cat = Array.isArray(item.curalia_categories)
    ? item.curalia_categories[0]
    : item.curalia_categories;

  return {
    id: item.id,
    sku: item.sku,
    slug: item.slug,
    price: Number(item.price),
    image: item.image ?? "",
    category: cat?.slug ?? "",
    name: trans?.name ?? "",
    description: trans?.description ?? "",
  };
}

function mapCategory(item: any): Category {
  const trans = Array.isArray(item.curalia_category_translations)
    ? item.curalia_category_translations[0]
    : item.curalia_category_translations;

  return {
    slug: item.slug,
    name: trans?.name ?? "",
  };
}

// --- HOOK GENÉRICO ---
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);
  const requestId = useRef(0);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const id = ++requestId.current;
    let active = true;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (active && id === requestId.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (active && id === requestId.current) {
          setError(err);
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { data, loading, error, refetch };
}

// --- HOOKS DE PRODUCTOS ---

/** Obtiene el catálogo completo de productos con traducción según el idioma activo. */
export function useProducts() {
  const locale = useLocale();

  const state = useAsync<Product[]>(async () => {
    const { data, error } = await supabase
      .from("curalia_products")
      .select(`
        id, sku, slug, price, image,
        curalia_categories ( slug ),
        curalia_product_translations!inner ( name, description )
      `)
      .eq("curalia_product_translations.language_code", locale);

    if (error) throw new Error(error.message);
    return (data || []).map(mapProduct);
  }, [locale]);

  return { ...state, products: state.data ?? [] };
}

/** Obtiene los productos pertenecientes a una categoría por su slug. */
export function useProductsByCategory(categorySlug: string | undefined) {
  const locale = useLocale();

  const state = useAsync<Product[]>(async () => {
    if (!categorySlug) return [];

    const { data, error } = await supabase
      .from("curalia_products")
      .select(`
        id, sku, slug, price, image,
        curalia_categories!inner ( slug ),
        curalia_product_translations!inner ( name, description )
      `)
      .eq("curalia_categories.slug", categorySlug)
      .eq("curalia_product_translations.language_code", locale);

    if (error) throw new Error(error.message);
    return (data || []).map(mapProduct);
  }, [categorySlug, locale]);

  return { ...state, products: state.data ?? [] };
}

/** Obtiene un solo producto por su slug. */
export function useProduct(slug: string | undefined) {
  const locale = useLocale();

  const state = useAsync<Product>(async () => {
    if (!slug) throw new Error("Slug requerido");

    const { data, error } = await supabase
      .from("curalia_products")
      .select(`
        id, sku, slug, price, image,
        curalia_categories ( slug ),
        curalia_product_translations!inner ( name, description )
      `)
      .eq("slug", slug)
      .eq("curalia_product_translations.language_code", locale)
      .single();

    if (error) throw new Error(error.message);
    return mapProduct(data);
  }, [slug, locale]);

  return { ...state, product: state.data };
}

/** Obtiene los productos destacados de la página de inicio. */
export function useFeaturedProducts(limit = 8) {
  const locale = useLocale();

  const state = useAsync<Product[]>(async () => {
    const { data, error } = await supabase
      .from("curalia_products")
      .select(`
        id, sku, slug, price, image,
        curalia_categories ( slug ),
        curalia_product_translations!inner ( name, description )
      `)
      .eq("curalia_product_translations.language_code", locale)
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data || []).map(mapProduct);
  }, [limit, locale]);

  return { ...state, products: state.data ?? [] };
}

// --- HOOKS DE CATEGORÍAS ---

/** Obtiene la lista completa de categorías. */
export function useCategories() {
  const locale = useLocale();

  const state = useAsync<Category[]>(async () => {
    const { data, error } = await supabase
      .from("curalia_categories")
      .select(`
        slug,
        curalia_category_translations!inner ( name )
      `)
      .eq("curalia_category_translations.language_code", locale);

    if (error) throw new Error(error.message);
    return (data || []).map(mapCategory);
  }, [locale]);

  return { ...state, categories: state.data ?? [] };
}

/** Obtiene una sola categoría por su slug. */
export function useCategory(slug: string | undefined) {
  const locale = useLocale();

  const state = useAsync<Category>(async () => {
    if (!slug) throw new Error("Slug requerido");

    const { data, error } = await supabase
      .from("curalia_categories")
      .select(`
        slug,
        curalia_category_translations!inner ( name )
      `)
      .eq("slug", slug)
      .eq("curalia_category_translations.language_code", locale)
      .single();

    if (error) throw new Error(error.message);
    return mapCategory(data);
  }, [slug, locale]);

  return { ...state, category: state.data };
}

