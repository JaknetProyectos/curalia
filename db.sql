-- 1. Tabla principal de Categorías
CREATE TABLE curalia_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Traducciones para Categorías
CREATE TABLE curalia_category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES curalia_categories(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL, -- Ej: 'es', 'en'
  name TEXT NOT NULL,
  UNIQUE (category_id, language_code)
);

-- 2. Tabla principal de Productos
CREATE TABLE curalia_products (
  id TEXT PRIMARY KEY, -- Usamos TEXT para mantener tus IDs actuales (ej: "356")
  sku TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category_id UUID REFERENCES curalia_categories(id) ON DELETE SET NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Traducciones para Productos
CREATE TABLE curalia_product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES curalia_products(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL, -- Ej: 'es', 'en'
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE (product_id, language_code)
);