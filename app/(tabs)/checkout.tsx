// app/checkout.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, ShoppingBag } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

interface Address {
 street: string;
 city: string;
 state: string;
 zipCode: string;
 country: string;
}

export default function CheckoutScreen() {
 const { user } = useAuth();
 const { cart } = useCart();
 const router = useRouter();
 const [userType, setUserType] = useState(null);
 const [address, setAddress] = useState<Address>({
   street: '',
   city: '',
   state: '',
   zipCode: '',
   country: ''
 });
 const [saveAddress, setSaveAddress] = useState(false);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
   if (user) {
     fetchSavedAddress();
     fetchUserType();
   }
 }, [user]);

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

 const getItemPrice = (item:any) => {
   if (!user) return item.customer_price;
   switch (userType) {
     case 'wholesale': return item.wholesale_price;
     case 'salon': return item.salon_price;
     default: return item.customer_price;
   }
 };

 const total = cart.reduce((sum, item) => {
   const itemPrice = getItemPrice(item);
   return sum + (itemPrice * (item.quantity || 0));
 }, 0);

 const fetchSavedAddress = async () => {
   if (user) {
     const { data, error } = await supabase
       .from('users')
       .select('address')
       .eq('id', user.id)
       .single();

     if (!error && data?.address) {
       setAddress(data.address);
     }
   }
 };

 const handleCheckout = async () => {
   if (!user) {
     router.push('/signin');
     return;
   }

   setLoading(true);
   try {
     if (saveAddress) {
       const { error: addressError } = await supabase
         .from('users')
         .update({ address })
         .eq('id', user.id);

       if (addressError) throw addressError;
     }

     const { data: orderData, error: orderError } = await supabase
       .from('orders')
       .insert({
         user_id: user.id,
         total: total,
         address: address,
         status: 'pending'
       })
       .select()
       .single();

     if (orderError) throw orderError;

     const orderItems = cart.map(item => ({
       order_id: orderData.id,
       product_id: item.id,
       quantity: item.quantity,
       price: getItemPrice(item)
     }));

     const { error: itemsError } = await supabase
       .from('order_items')
       .insert(orderItems);

     if (itemsError) throw itemsError;

     router.push('/orderconfirmation');
   } catch (error) {
     Alert.alert('Error', 'Failed to process checkout. Please try again.');
   } finally {
     setLoading(false);
   }
 };

 return (
   <SafeAreaView style={styles.container}>
     <ScrollView>
       <Text style={styles.title}>Checkout</Text>

       <View style={styles.card}>
         <View style={styles.headerRow}>
           <MapPin size={20} color="#B388FF" />
           <Text style={styles.cardTitle}>Shipping Address</Text>
         </View>
         
         <View style={styles.inputGroup}>
           <Text style={styles.label}>Street Address</Text>
           <TextInput
             style={styles.input}
             value={address.street}
             onChangeText={(text) => setAddress(prev => ({...prev, street: text}))}
             placeholder="Enter street address"
           />
         </View>

         <View style={styles.row}>
           <View style={styles.halfWidth}>
             <Text style={styles.label}>City</Text>
             <TextInput
               style={styles.input}
               value={address.city}
               onChangeText={(text) => setAddress(prev => ({...prev, city: text}))}
               placeholder="Enter city"
             />
           </View>
           <View style={styles.halfWidth}>
             <Text style={styles.label}>State</Text>
             <TextInput
               style={styles.input}
               value={address.state}
               onChangeText={(text) => setAddress(prev => ({...prev, state: text}))}
               placeholder="Enter state"
             />
           </View>
         </View>

         <View style={styles.row}>
           <View style={styles.halfWidth}>
             <Text style={styles.label}>Zip Code</Text>
             <TextInput
               style={styles.input}
               value={address.zipCode}
               onChangeText={(text) => setAddress(prev => ({...prev, zipCode: text}))}
               placeholder="Enter zip code"
             />
           </View>
           <View style={styles.halfWidth}>
             <Text style={styles.label}>Country</Text>
             <TextInput
               style={styles.input}
               value={address.country}
               onChangeText={(text) => setAddress(prev => ({...prev, country: text}))}
               placeholder="Enter country"
             />
           </View>
         </View>

         <View style={styles.checkboxContainer}>
           <Checkbox
             value={saveAddress}
             onValueChange={setSaveAddress}
             color={saveAddress ? '#B388FF' : undefined}
           />
           <Text style={styles.checkboxLabel}>Save this address for future use</Text>
         </View>
       </View>

       <View style={styles.card}>
         <View style={styles.headerRow}>
           <CreditCard size={20} color="#B388FF" />
           <Text style={styles.cardTitle}>Payment Method</Text>
         </View>
         <Text style={styles.paymentText}>Payment integration to be implemented</Text>
       </View>

       <View style={styles.card}>
         <View style={styles.headerRow}>
           <ShoppingBag size={20} color="#B388FF" />
           <Text style={styles.cardTitle}>Order Summary</Text>
         </View>

         {cart.map((item) => (
           <View key={item.id} style={styles.orderItem}>
             <View>
               <Text style={styles.productName}>{item.name || 'Unnamed Product'}</Text>
               <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
               {userType && userType !== 'customer' && (
                 <Text style={styles.userTypePrice}>
                   {userType === 'wholesale' ? 'Wholesale' : 'Salon'} Price
                 </Text>
               )}
             </View>
             <Text style={styles.itemTotal}>
               ₹{(getItemPrice(item) * (item.quantity || 0)).toFixed(2)}
             </Text>
           </View>
         ))}

         <View style={styles.totalContainer}>
           <Text style={styles.totalLabel}>Total</Text>
           <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
         </View>

         <TouchableOpacity
           style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
           onPress={handleCheckout}
           disabled={loading}
         >
           <Text style={styles.checkoutButtonText}>
             {loading ? 'Processing...' : 'Complete Checkout'}
           </Text>
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
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   padding: 16,
 },
 card: {
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
 headerRow: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 16,
   gap: 8,
 },
 cardTitle: {
   fontSize: 20,
   fontWeight: 'bold',
 },
 inputGroup: {
   marginBottom: 16,
 },
 label: {
   fontSize: 14,
   fontWeight: '500',
   marginBottom: 8,
   color: '#374151',
 },
 input: {
   borderWidth: 1,
   borderColor: '#D1D5DB',
   borderRadius: 8,
   padding: 12,
   fontSize: 16,
 },
 row: {
   flexDirection: 'row',
   gap: 16,
   marginBottom: 16,
 },
 halfWidth: {
   flex: 1,
 },
 checkboxContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 8,
 },
 checkboxLabel: {
   fontSize: 14,
   color: '#6B7280',
 },
 paymentText: {
   color: '#6B7280',
 },
 orderItem: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingVertical: 12,
   borderBottomWidth: 1,
   borderBottomColor: '#E5E7EB',
 },
 productName: {
   fontSize: 16,
   fontWeight: '500',
 },
 quantity: {
   fontSize: 14,
   color: '#6B7280',
 },
 userTypePrice: {
   fontSize: 14,
   color: '#059669',
 },
 itemTotal: {
   fontSize: 16,
   fontWeight: '500',
 },
 totalContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingTop: 16,
   marginTop: 16,
   borderTopWidth: 1,
   borderTopColor: '#E5E7EB',
 },
 totalLabel: {
   fontSize: 18,
   fontWeight: 'bold',
 },
 totalAmount: {
   fontSize: 18,
   fontWeight: 'bold',
 },
 checkoutButton: {
   backgroundColor: '#BBA7FF',
   padding: 16,
   borderRadius: 12,
   alignItems: 'center',
   marginTop: 16,
 },
 checkoutButtonDisabled: {
   opacity: 0.5,
 },
 checkoutButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: '500',
 },
});