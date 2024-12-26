import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface Product {
  id: number | string;
  name: string;
  category: string;
  image?: string;
  rating: number;
  maxRating: number;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

interface ProductGridProps {
  products: Product[] | null;
  loading: boolean;
  error?: string;
}

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 16;
const cardWidth = (width - gap * (numColumns + 1)) / numColumns;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={product.image ? { uri: product.image } : require('../../assets/placeholder.png')}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.heartButton}>
          <Text style={styles.heartIcon}>♡</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.rating}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>
              {product.rating}
            </Text>
            <Text style={styles.maxRating}>
              /{product.maxRating}
            </Text>
          </View>
          <Text style={styles.price}>
            ${product.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Trending Now!</Text>
      <View style={styles.grid}>
        {products?.map((product) => (
          <View key={product.id} style={styles.cardWrapper}>
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -gap / 2,
  },
  cardWrapper: {
    width: cardWidth,
    marginHorizontal: gap / 2,
    marginBottom: gap,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 20,
    color: '#666',
  },
  contentContainer: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFB800',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  maxRating: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#22C55E',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
  },
});

export default ProductGrid;