// app/order-confirmation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderItem {
 id: string;
 quantity: number;
 price: number;
 product: {
   name: string;
 };
}

interface Order {
 id: string;
 order_number: string;
 total: number;
 address: {
   street: string;
   city: string;
   state: string;
   zipCode: string;
   country: string;
 };
 order_items: OrderItem[];
}

export default function OrderConfirmationScreen() {
 const [orderDetails, setOrderDetails] = useState<Order | null>(null);
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(true);
 const { user } = useAuth();
 const { clearCart } = useCart();
 const router = useRouter();
 const orderFetched = useRef(false);

 useEffect(() => {
   const fetchOrderDetails = async () => {
     if (orderFetched.current) return;

     try {
       const orderId = await AsyncStorage.getItem('lastOrderId');
       
       if (!user || !orderId) {
         setError('No order found. Please try again.');
         setIsLoading(false);
         return;
       }

       const { data: order, error } = await supabase
         .from('orders')
         .select(`
           *,
           order_items (
             *,
             product:products (*)
           )
         `)
         .eq('id', orderId)
         .single();

       if (error) throw error;

       if (order) {
         setOrderDetails(order);
         clearCart();
         await AsyncStorage.removeItem('lastOrderId');
       } else {
         setError('Order not found. Please contact customer support.');
       }
     } catch (error) {
       console.error('Error:', error);
       setError('Error fetching order details. Please try again.');
     } finally {
       setIsLoading(false);
       orderFetched.current = true;
     }
   };

   fetchOrderDetails();
 }, [user, clearCart]);

 if (isLoading) {
   return (
     <SafeAreaView style={styles.container}>
       <View style={styles.centerContent}>
         <Text>Loading...</Text>
       </View>
     </SafeAreaView>
   );
 }

 if (error) {
   return (
     <SafeAreaView style={styles.container}>
       <View style={styles.centerContent}>
         <Text style={styles.errorText}>{error}</Text>
         <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
           <Text style={styles.buttonText}>Return to Home</Text>
         </TouchableOpacity>
       </View>
     </SafeAreaView>
   );
 }

 if (!orderDetails) {
   return (
     <SafeAreaView style={styles.container}>
       <View style={styles.centerContent}>
         <Text>No order details found.</Text>
         <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
           <Text style={styles.buttonText}>Return to Home</Text>
         </TouchableOpacity>
       </View>
     </SafeAreaView>
   );
 }

 return (
   <SafeAreaView style={styles.container}>
     <ScrollView>
       <View style={styles.content}>
         <Text style={styles.title}>Order Confirmation</Text>
         
         <View style={styles.section}>
           <Text style={styles.thankYou}>Thank you for your order!</Text>
           <Text style={styles.orderNumber}>Order number: #{orderDetails.order_number}</Text>
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Order Summary</Text>
           {orderDetails.order_items.map((item) => (
             <View key={item.id} style={styles.orderItem}>
               <Text>{item.product.name} x {item.quantity}</Text>
               <Text>₹{(item.price * item.quantity).toFixed(2)}</Text>
             </View>
           ))}
           <View style={styles.totalContainer}>
             <Text style={styles.totalText}>Total</Text>
             <Text style={styles.totalText}>₹{orderDetails.total.toFixed(2)}</Text>
           </View>
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Shipping Address</Text>
           <Text>{orderDetails.address.street}</Text>
           <Text>{orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zipCode}</Text>
           <Text>{orderDetails.address.country}</Text>
         </View>

         <Text style={styles.emailNote}>
           We'll send you an email with your order details and tracking information once your order ships.
         </Text>

         <TouchableOpacity 
           style={styles.button}
           onPress={() => router.push('/')}
         >
           <Text style={styles.buttonText}>Continue Shopping</Text>
         </TouchableOpacity>
       </View>
     </ScrollView>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: 'white',
 },
 content: {
   padding: 16,
 },
 centerContent: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 16,
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   textAlign: 'center',
   marginBottom: 24,
 },
 section: {
   marginBottom: 24,
 },
 thankYou: {
   fontSize: 18,
   textAlign: 'center',
   marginBottom: 8,
 },
 orderNumber: {
   fontSize: 16,
   textAlign: 'center',
   fontWeight: '500',
 },
 sectionTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   marginBottom: 16,
 },
 orderItem: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 8,
 },
 totalContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   borderTopWidth: 1,
   borderTopColor: '#E5E7EB',
   paddingTop: 8,
   marginTop: 8,
 },
 totalText: {
   fontWeight: 'bold',
 },
 emailNote: {
   textAlign: 'center',
   marginBottom: 24,
   color: '#6B7280',
 },
 button: {
   backgroundColor: '#BBA7FF',
   padding: 16,
   borderRadius: 12,
   alignItems: 'center',
 },
 buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: '500',
 },
 errorText: {
   color: '#EF4444',
   marginBottom: 16,
 },
});