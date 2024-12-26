// app/profile.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // Implement image upload logic here
        console.log('Selected image:', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (!user) {
    router.replace('/signin');
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Profile</Text>
        
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: user.photoURL || 'https://placeholder.com/150' }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleImageUpload}
              >
                <Camera size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <User size={20} color="#9CA3AF" />
                <Text style={styles.infoText}>
                  {user.displayName || 'No name set'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Mail size={20} color="#9CA3AF" />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Phone size={20} color="#9CA3AF" />
                <Text style={styles.infoText}>
                  {user.phoneNumber || 'No phone number set'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={20} color="#9CA3AF" />
                <Text style={styles.infoText}>No address set</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Account Settings</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => Alert.alert('Coming Soon', 'This feature is not yet available')}
            >
              <Text style={styles.settingButtonText}>Change Password</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => Alert.alert('Coming Soon', 'This feature is not yet available')}
            >
              <Text style={styles.settingButtonText}>Update Email</Text>
            </TouchableOpacity>
          </View>
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
  profileHeader: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#B388FF',
    padding: 8,
    borderRadius: 20,
  },
  infoContainer: {
    width: '100%',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
  },
  settingsCard: {
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
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsList: {
    gap: 8,
  },
  settingButton: {
    padding: 8,
  },
  settingButtonText: {
    color: '#B388FF',
    fontSize: 16,
  },
});