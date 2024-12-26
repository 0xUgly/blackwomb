import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Product {
    id: string;
    name: string;
    brand: string;
    customer_price: number;
    wholesale_price: number;
    salon_price: number;
    image_url: string;
    category: string;
    description: string;
    stock: number;
  }

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
  }

interface CartProviderProps {
  children: ReactNode;
}
export interface ProductWithPrice extends Product {
    price: number;
  }
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setCart(
          data.map((item) => ({
            ...item.product,
            quantity: item.quantity,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Optionally show error using React Native Alert or a toast notification
    }
  };

  const addToCart = async (product: Product): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert(
          {
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          },
          {
            onConflict: 'user_id,product_id',
          }
        )
        .select();

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Optionally show error using React Native Alert or a toast notification
    }
  };

  // Example of additional cart functions you might want to add:
  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .match({ user_id: user.id, product_id: productId });

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId: string): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .match({ user_id: user.id, product_id: productId });

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .match({ user_id: user.id });

      if (error) throw error;
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value: CartContextType = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}