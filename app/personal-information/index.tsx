import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PersonalInformationScreen() {
  const [userData] = useState({
    firstName: 'Kin Clark',
    surname: 'Perez',
    email: 'clarkperez906@gmail.com',
    dateOfBirth: 'March 15, 1995',
    phoneNumber: '+63 912 345 6789',
    memberSince: 'August 2024',
    address: '123 Main Street, Quezon City, Philippines',
    emergencyContact: '+63 998 765 4321',
  });



  const personalInfoItems = [
    {
      icon: 'person-outline',
      label: 'Full Name',
      value: `${userData.firstName} ${userData.surname}`,
    },
    {
      icon: 'mail-outline',
      label: 'Email Address',
      value: userData.email,
    },
    {
      icon: 'call-outline',
      label: 'Phone Number',
      value: userData.phoneNumber,
    },
    {
      icon: 'calendar-outline',
      label: 'Date of Birth',
      value: userData.dateOfBirth,
    },
    {
      icon: 'location-outline',
      label: 'Address',
      value: userData.address,
    },
    {
      icon: 'call-outline',
      label: 'Emergency Contact',
      value: userData.emergencyContact,
    },
    {
      icon: 'time-outline',
      label: 'Member Since',
      value: userData.memberSince,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>


        {/* Profile Summary */}
        <View style={styles.profileSummary}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.firstName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.userName}>{userData.firstName} {userData.surname}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        {/* Information List */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          
          {personalInfoItems.map((item, index) => (
            <View key={index} style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={16} color="#666666" />
                </View>
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Edit Button */}
        <View style={styles.editSection}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={16} color="#ffffff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },

  profileSummary: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  editSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});
