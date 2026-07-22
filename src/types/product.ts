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

export type Category = { slug: string; name: string };