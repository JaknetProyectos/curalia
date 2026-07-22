// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { useLocale } from "next-intl"; // O el paquete que utilices para tu i18n
import { supabase } from "@/supabase/client";
import { Category } from "@/types/product";

export function useCategories() {
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await supabase
          .from("curalia_categories")
          .select(`
            slug,
            curalia_category_translations!inner(name)
          `)
          .eq("curalia_category_translations.language_code", locale);

        if (dbError) throw dbError;

        // Transformación al formato Category
        const formattedCategories: Category[] = (data || []).map((cat: any) => {
          const translation = Array.isArray(cat.curalia_category_translations)
            ? cat.curalia_category_translations[0]
            : cat.curalia_category_translations;

          return {
            slug: cat.slug,
            name: translation?.name || "",
          };
        });

        setCategories(formattedCategories);
      } catch (err: any) {
        setError(err.message || "Error al obtener categorías");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [locale]);

  return { categories, loading, error };
}