// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/context/CartContext';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          brand,
          customer_price,
          wholesale_price,
          salon_price,
          image_url,
          category,
          description,
          stock
        `);

      if (error) throw error;
      setProducts(data || []);
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error };
}