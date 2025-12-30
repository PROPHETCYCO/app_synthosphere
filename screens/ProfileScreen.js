import React from 'react';
import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
export default function ProfileScreen() {
   const { user, isAuthenticated } = useContext(AuthContext);
    useEffect(() => {
        if (!isAuthenticated) return;
    }, [isAuthenticated]);
     const userId = user.userId;
     const userName = user.name;
     const email = user.email;
     const phone = user.phone;
     const status = user.status;
  return (
    <View style={styles.container}>
      {/* Header */}
     <LinearGradient
  colors={['#6A3CBC', '#B83280']}
  style={styles.header}
>
  {/* Avatar + Username */}
  <View style={styles.avatarWrapper}>
    <Image
      source={require('../assets/user.png')}
      style={styles.avatar}
    />

    <Text
      style={styles.userName}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      Test user
    </Text>
  </View>
</LinearGradient>


      {/* Form */}
     <ScrollView style={styles.profileCard}>
        <InfoRow label="Name" value={userName} />
          <InfoRow label="Userid" value={userId} />
        <InfoRow label="E-mail" value={email} />
        <InfoRow label="Phone" value={phone} />
        <InfoRow label="Status" value={status} style={styles.statusBadge} />
      
      </ScrollView>
    </View>
  );
}
const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  
  header: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
 
   avatarWrapper: {
    alignItems: 'center',
    width: '100%', // keeps avatar centered
  },
 
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  profileCard: {
    marginTop: -20,
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
   userName: {
    marginTop: 10,
    maxWidth: 220,        // prevents layout shift
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#6A3CBC',
    padding: 8,
    borderRadius: 20,
  },
  form: {
    backgroundColor: '#f2f2f2',
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
