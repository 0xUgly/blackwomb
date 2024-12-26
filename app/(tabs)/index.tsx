import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import { Product } from '@/context/CartContext';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 8;
const cardWidth = (width - gap * (numColumns + 1)) / numColumns;

export default function ProductsScreen() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#BBA7FF" />
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

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.cardContainer}>
      <ProductCard product={item} />
    </View>
  );

  return (
    <FlatList<Product>
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: gap,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: gap,
  },
  cardContainer: {
    width: cardWidth,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    margin: 16,
    fontSize: 16,
  },
});

