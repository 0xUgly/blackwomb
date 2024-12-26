// app/cart.tsx
import React, { useState, useEffect } from 'react';
import {
 View,
 Text,
 Image,
 TouchableOpacity,
 ScrollView,
 StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Minus, Plus, X } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
 const { cart, removeFromCart, updateQuantity } = useCart();
 const { user } = useAuth();
 const [userType, setUserType] = useState(null);
 const router = useRouter();

 useEffect(() => {
   const fetchUserType = async () => {
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
   };

   fetchUserType();
 }, [user]);

 const getItemPrice = (item:any) => {
   if (!user) return item.customer_price;

   switch (userType) {
     case 'wholesale':
       return item.wholesale_price;
     case 'salon':
       return item.salon_price;
     default:
       return item.customer_price;
   }
 };

 const total = cart.reduce((sum, item) => {
   const itemPrice = getItemPrice(item);
   const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
   return sum + (itemPrice * itemQuantity);
 }, 0);

 if (cart.length === 0) {
   return (
     <SafeAreaView style={styles.emptyContainer}>
       <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
       <TouchableOpacity onPress={() => router.push('/')}>
         <Text style={styles.continueText}>Continue Shopping</Text>
       </TouchableOpacity>
     </SafeAreaView>
   );
 }

 return (
   <SafeAreaView style={styles.container}>
     <ScrollView>
       <Text style={styles.title}>Shopping Cart</Text>
       
       <View style={styles.cartItems}>
         {cart.map((item) => (
           <View key={item.id} style={styles.cartItem}>
             <View style={styles.imageContainer}>
               <Image 
                 source={{ uri: item.image_url || 'https://placeholder.com/300x300' }}
                 style={styles.image}
                 resizeMode="contain"
               />
             </View>
             
             <View style={styles.itemDetails}>
               <View style={styles.itemHeader}>
                 <Text style={styles.itemName}>{item.name || 'Unnamed Product'}</Text>
                 <TouchableOpacity
                   onPress={() => removeFromCart(item.id)}
                   style={styles.removeButton}
                 >
                   <X size={20} color="#9CA3AF" />
                 </TouchableOpacity>
               </View>
               
               <Text style={styles.itemPrice}>
                 ₹{getItemPrice(item).toFixed(2)}
               </Text>
               
               {userType && userType !== 'customer' && (
                 <Text style={styles.userTypePrice}>
                   {userType === 'wholesale' ? 'Wholesale' : 'Salon'} Price
                 </Text>
               )}

               <View style={styles.quantityControl}>
                 <TouchableOpacity
                   onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                   style={styles.quantityButton}
                 >
                   <Minus size={16} color="#4B5563" />
                 </TouchableOpacity>
                 
                 <Text style={styles.quantityText}>{item.quantity}</Text>
                 
                 <TouchableOpacity
                   onPress={() => updateQuantity(item.id, item.quantity + 1)}
                   style={styles.quantityButton}
                 >
                   <Plus size={16} color="#4B5563" />
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         ))}
       </View>

       <View style={styles.summary}>
         <Text style={styles.summaryTitle}>Order Summary</Text>
         
         <View style={styles.summaryRow}>
           <Text style={styles.summaryLabel}>Subtotal</Text>
           <Text style={styles.summaryValue}>₹{total.toFixed(2)}</Text>
         </View>
         
         <View style={styles.summaryRow}>
           <Text style={styles.summaryLabel}>Shipping</Text>
           <Text style={styles.summaryValue}>Calculated at checkout</Text>
         </View>
         
         <View style={[styles.summaryRow, styles.totalRow]}>
           <Text style={styles.totalLabel}>Total</Text>
           <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
         </View>
         
         <TouchableOpacity
           style={styles.checkoutButton}
           onPress={() => router.push('/checkout')}
         >
           <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
         </TouchableOpacity>
         
         <TouchableOpacity
           style={styles.continueShoppingButton}
           onPress={() => router.push('/')}
         >
           <Text style={styles.continueShoppingText}>Continue Shopping</Text>
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
 emptyContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: 'white',
 },
 emptyTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 16,
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   padding: 16,
 },
 cartItems: {
   padding: 16,
 },
 cartItem: {
   backgroundColor: 'white',
   borderRadius: 16,
   padding: 16,
   marginBottom: 16,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.05,
   shadowRadius: 4,
   elevation: 2,
 },
 imageContainer: {
   height: 120,
   marginBottom: 12,
 },
 image: {
   width: '100%',
   height: '100%',
   borderRadius: 8,
 },
 itemDetails: {
   gap: 8,
 },
 itemHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'flex-start',
 },
 itemName: {
   fontSize: 16,
   fontWeight: '500',
   flex: 1,
 },
 removeButton: {
   padding: 4,
 },
 itemPrice: {
   fontSize: 16,
   color: '#4B5563',
   fontWeight: '500',
 },
 userTypePrice: {
   fontSize: 14,
   color: '#059669',
 },
 quantityControl: {
   flexDirection: 'row',
   alignItems: 'center',
   backgroundColor: '#F3F4F6',
   borderRadius: 8,
   padding: 4,
   alignSelf: 'flex-start',
 },
 quantityButton: {
   padding: 8,
   borderRadius: 6,
 },
 quantityText: {
   width: 32,
   textAlign: 'center',
   fontWeight: '500',
 },
 summary: {
   backgroundColor: 'white',
   borderRadius: 16,
   padding: 16,
   margin: 16,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.05,
   shadowRadius: 4,
   elevation: 2,
 },
 summaryTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   marginBottom: 16,
 },
 summaryRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 12,
 },
 summaryLabel: {
   color: '#6B7280',
 },
 summaryValue: {
   fontWeight: '500',
 },
 totalRow: {
   borderTopWidth: 1,
   borderTopColor: '#E5E7EB',
   paddingTop: 12,
   marginTop: 12,
 },
 totalLabel: {
   fontSize: 18,
   fontWeight: 'bold',
 },
 totalValue: {
   fontSize: 18,
   fontWeight: 'bold',
 },
 checkoutButton: {
   backgroundColor: '#B388FF',
   borderRadius: 12,
   padding: 16,
   alignItems: 'center',
   marginTop: 16,
 },
 checkoutButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: '500',
 },
 continueShoppingButton: {
   alignItems: 'center',
   marginTop: 12,
 },
 continueShoppingText: {
   color: '#B388FF',
   fontSize: 16,
   fontWeight: '500',
 },
 continueText: {
   color: '#B388FF',
   fontSize: 16,
   fontWeight: '500',
 },
});