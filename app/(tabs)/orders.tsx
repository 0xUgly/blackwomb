// app/orders.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';

interface Order {
 id: string;
 order_number: string;
 created_at: string;
 status: string;
 cancellation_reason?: string;
}

export default function OrdersScreen() {
 const [orders, setOrders] = useState<Order[]>([]);
 const [loading, setLoading] = useState(true);
 const { user } = useAuth();

 useEffect(() => {
   fetchOrders();
 }, []);

 const fetchOrders = async () => {
   if (!user) return;

   try {
     const { data, error } = await supabase
       .from('orders')
       .select('*')
       .eq('user_id', user.id)
       .order('created_at', { ascending: false });

     if (error) throw error;
     setOrders(data || []);
   } catch (error) {
     console.error('Error:', error);
   } finally {
     setLoading(false);
   }
 };

 const handleCancelOrder = async (orderId: string, reason: string) => {
   try {
     const { error } = await supabase
       .from('orders')
       .update({
         status: 'cancelled',
         cancellation_reason: reason,
         cancelled_at: new Date().toISOString(),
         cancelled_by: user?.email
       })
       .eq('id', orderId)
       .eq('user_id', user?.id);

     if (error) throw error;
     
     setOrders(orders.map(order => 
       order.id === orderId 
         ? { 
             ...order, 
             status: 'cancelled',
             cancellation_reason: reason,
           }
         : order
     ));
   } catch (error) {
     console.error('Error:', error);
   }
 };

 const getStatusStyle = (status: string) => {
   switch(status) {
     case 'delivered':
       return styles.statusDelivered;
     case 'processing':
       return styles.statusProcessing;
     case 'shipped':
       return styles.statusShipped;
     case 'cancelled':
       return styles.statusCancelled;
     default:
       return styles.statusPending;
   }
 };
 const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
 if (loading) {
   return (
     <SafeAreaView style={styles.container}>
       <View style={styles.centerContent}>
         <Text>Loading orders...</Text>
       </View>
     </SafeAreaView>
   );
 }

 return (
   <SafeAreaView style={styles.container}>
     <ScrollView style={styles.content}>
       <Text style={styles.title}>My Orders</Text>
       
       {orders.length === 0 ? (
         <Text style={styles.noOrders}>No orders found.</Text>
       ) : (
         <View style={styles.ordersList}>
           {orders.map((order) => (
             <View key={order.id} style={styles.orderCard}>
               <View style={styles.orderHeader}>
                 <View>
                   <Text style={styles.orderNumber}>Order #{order.order_number}</Text>
                   <Text style={styles.orderDate}>
                   {formatDate(order.created_at)}                   </Text>
                 </View>
                 
                 <View>
                   <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                     <Text style={styles.statusText}>{order.status || 'pending'}</Text>
                   </View>
                   
                   {order.status !== 'cancelled' && order.status !== 'delivered' && (
                     <TouchableOpacity
                       onPress={() => handleCancelOrder(order.id, 'Customer requested cancellation')}
                       style={styles.cancelButton}
                     >
                       <Text style={styles.cancelButtonText}>Cancel Order</Text>
                     </TouchableOpacity>
                   )}
                 </View>
               </View>

               {order.status === 'cancelled' && order.cancellation_reason && (
                 <View style={styles.cancellationBox}>
                   <Text style={styles.cancellationTitle}>Cancellation Reason:</Text>
                   <Text style={styles.cancellationReason}>{order.cancellation_reason}</Text>
                 </View>
               )}
             </View>
           ))}
         </View>
       )}
     </ScrollView>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: 'white',
 },
 centerContent: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 content: {
   padding: 16,
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 16,
 },
 noOrders: {
   color: '#6B7280',
 },
 ordersList: {
   gap: 16,
 },
 orderCard: {
   borderWidth: 1,
   borderColor: '#E5E7EB',
   borderRadius: 12,
   padding: 16,
   marginBottom: 16,
 },
 orderHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'flex-start',
   marginBottom: 16,
 },
 orderNumber: {
   fontSize: 16,
   fontWeight: '600',
 },
 orderDate: {
   color: '#6B7280',
 },
 statusBadge: {
   paddingHorizontal: 12,
   paddingVertical: 6,
   borderRadius: 16,
 },
 statusDelivered: {
   backgroundColor: '#DEF7EC',
 },
 statusProcessing: {
   backgroundColor: '#E1EFFE',
 },
 statusShipped: {
   backgroundColor: '#EDE9FE',
 },
 statusCancelled: {
   backgroundColor: '#FDE8E8',
 },
 statusPending: {
   backgroundColor: '#F3F4F6',
 },
 statusText: {
   fontSize: 12,
   fontWeight: '500',
 },
 cancelButton: {
   marginTop: 8,
 },
 cancelButtonText: {
   color: '#EF4444',
   fontSize: 14,
 },
 cancellationBox: {
   backgroundColor: '#FEF2F2',
   padding: 16,
   borderRadius: 8,
 },
 cancellationTitle: {
   color: '#B91C1C',
   fontWeight: '500',
   marginBottom: 4,
 },
 cancellationReason: {
   color: '#DC2626',
 },
});