import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Product } from '@/context/CartContext';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 8;
const cardWidth = (width - gap * (numColumns + 1)) / numColumns;

export default function ProductsScreen() {
  const { products, loading, error, refetch } = useProducts();

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <View style={styles.cardContainer}>
      <ProductCard product={item} />
    </View>
  ), []);

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Oops! Something went wrong.</Text>
        <Text style={styles.errorDetails}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList<Product>
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text>No products available</Text>
        </View>
      }
      ListFooterComponent={
        loading ? (
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="large" color="#BBA7FF" />
          </View>
        ) : null
      }
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews={true}
      accessibilityLabel="Products list"
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorDetails: {
    color: '#EF4444',
    textAlign: 'center',
    marginHorizontal: 16,
    fontSize: 14,
  },
  loadingFooter: {
    paddingVertical: 20,
  },
});