// ui/CustomDrawerContent.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['blacwom01@gmail.com'];

export default function CustomDrawerContent(props:any) {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      props.navigation.closeDrawer();
      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const getShortenedEmail = (email: string) => {
    if (!email) return '';
    const [username] = email.split('@');
    return username.length > 10 ? `${username.slice(0, 10)}...` : username;
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <View style={styles.userSection}>
          {user ? (
            <>
              <Text style={styles.userEmail}>{getShortenedEmail(user.email)}</Text>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/profile')}
              >
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => router.push('/signin')}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/')}
          >
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/deals')}
          >
            <Text style={styles.menuText}>Deals</Text>
          </TouchableOpacity>
          

          {user && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/orders')}
              >
                <Text style={styles.menuText}>My Orders</Text>
              </TouchableOpacity>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.push('/admin/orders')}
                >
                  <Text style={styles.menuText}>Admin Dashboard</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  authButtons: {
    gap: 8,
  },
  signInButton: {
    paddingVertical: 8,
  },
  signUpButton: {
    backgroundColor: '#BBA7FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  signInText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '500',
  },
  signUpText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 16,
    color: '#4B5563',
  },
  signOutButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});