import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Star, Info } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Product, ProductWithPrice } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    async function getUserType() {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserType(data.user_type);
        }
      }
    }

    getUserType();
  }, [user]);

  const getPrice = (): number => {
    if (!user || !userType) return product.customer_price;

    switch (userType) {
      case 'wholesale':
        return product.wholesale_price;
      case 'salon':
        return product.salon_price;
      default:
        return product.customer_price;
    }
  };

  const handleAddToCart = () => {
    const productWithPrice: ProductWithPrice = {
      ...product,
      price: getPrice()
    };
    addToCart(productWithPrice);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < Math.floor(rating) ? '#FBBF24' : '#E5E7EB'}
        color={index < Math.floor(rating) ? '#FBBF24' : '#E5E7EB'}
      />
    ));
  };

  return (
   
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: product.image_url || 'https://placeholder.com/300x300'
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setShowDetails(true)}
        >
          <Info size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          
          <Text style={styles.brand}>{product.brand}</Text>
        </View>

       

        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.price}>
              ₹{getPrice().toFixed(2)}
            </Text>
            {userType && userType !== 'customer' && (
              <Text style={styles.userTypePrice}>
                {userType === 'wholesale' ? 'Wholesale' : 'Salon'} Price
              </Text>
            )}
          </View>
          {product.stock <= 10 && (
            <Text style={styles.stockWarning}>
              Almost Sold Out
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowDetails(true)}
          >
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    margin: 8,
  },
  imageContainer: {
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  brand: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userTypePrice: {
    fontSize: 14,
    color: '#059669',
  },
  stockWarning: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#BBA7FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: '500',
  },
  detailsButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBA7FF',
    alignItems: 'center',
  },
  detailsText: {
    color: '#BBA7FF',
    fontWeight: '500',
  },
});