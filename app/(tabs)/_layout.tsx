// app/_layout.tsx
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { User } from 'lucide-react-native';
import AppHeader from '@/components/ui/AppHeader';
import CustomDrawerContent from '@/components/ui/CustomDrawerContent';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Drawer
          screenOptions={{
            header: () => <AppHeader />,
            drawerStyle: {
              width: '75%',
            },
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: 'Home',
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              title: 'My Profile',
              drawerIcon: ({ color }) => <User size={20} color={color} />
            }}
          />
          <Drawer.Screen
            name="cart"
            options={{
              title: 'Cart'
            }}
          />
        </Drawer>
      </CartProvider>
    </AuthProvider>
  );
}