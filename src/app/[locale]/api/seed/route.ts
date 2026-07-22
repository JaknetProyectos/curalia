import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";
import { categories, products } from "@/data/products";

export async function GET() {
  try {
    // 1. Insertar / Actualizar Categorías (Slugs)
    const categoriesPayload = categories.map((cat) => ({
      slug: cat.slug,
    }));

    const { data: insertedCategories, error: catError } = await supabase
      .from("curalia_categories")
      .upsert(categoriesPayload, { onConflict: "slug" })
      .select("id, slug");

    if (catError) throw catError;

    // Crear un mapa auxiliar (slug -> id)
    const categoryMap = new Map<string, string>();
    insertedCategories?.forEach((cat) => {
      categoryMap.set(cat.slug, cat.id);
    });

    // 2. Insertar / Actualizar Traducciones de Categorías (Español)
    const categoryTranslationsPayload = categories.map((cat) => ({
      category_id: categoryMap.get(cat.slug)!,
      language_code: "es",
      name: cat.name,
    }));

    const { error: catTransError } = await supabase
      .from("curalia_category_translations")
      .upsert(categoryTranslationsPayload, {
        onConflict: "category_id,language_code",
      });

    if (catTransError) throw catTransError;

    // 3. Insertar / Actualizar Productos
    const productsPayload = products.map((prod) => ({
      id: prod.id,
      sku: prod.sku,
      slug: prod.slug,
      price: prod.price,
      category_id: categoryMap.get(prod.category) || null,
      image: prod.image,
    }));

    const { error: prodError } = await supabase
      .from("curalia_products")
      .upsert(productsPayload, { onConflict: "id" });

    if (prodError) throw prodError;

    // 4. Insertar / Actualizar Traducciones de Productos (Español)
    const productTranslationsPayload = products.map((prod) => ({
      product_id: prod.id,
      language_code: "es",
      name: prod.name,
      description: prod.description,
    }));

    const { error: prodTransError } = await supabase
      .from("curalia_product_translations")
      .upsert(productTranslationsPayload, {
        onConflict: "product_id,language_code",
      });

    if (prodTransError) throw prodTransError;

    return NextResponse.json({
      success: true,
      message: "Seed ejecutado con éxito. Categorías y productos creados en español.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}