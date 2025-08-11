import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProfileMenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle?: string;
  hasArrow?: boolean;
  isDestructive?: boolean;
}

const profileMenuItems: ProfileMenuItem[] = [
  {
    id: '1',
    title: 'Personal Information',
    icon: 'person-outline',
    subtitle: 'View your profile details',
    hasArrow: true,
  },
  {
    id: '2',
    title: 'Payment Methods',
    icon: 'card-outline',
    subtitle: 'Manage your payment options',
    hasArrow: true,
  },

  {
    id: '3',
    title: 'Notifications',
    icon: 'notifications-outline',
    subtitle: 'Manage your notifications',
    hasArrow: true,
  },
  {
    id: '4',
    title: 'Privacy & Security',
    icon: 'shield-outline',
    subtitle: 'Manage your privacy settings',
    hasArrow: true,
  },
  {
    id: '5',
    title: 'Help & Support',
    icon: 'help-circle-outline',
    subtitle: 'Get help and contact support',
    hasArrow: true,
  },
  {
    id: '6',
    title: 'About',
    icon: 'information-circle-outline',
    subtitle: 'App version and legal information',
    hasArrow: true,
  },
  {
    id: '7',
    title: 'Log Out',
    icon: 'log-out-outline',
    isDestructive: true,
  },
];

const ProfileMenuItemComponent: React.FC<{ item: ProfileMenuItem; onPress: () => void }> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[
          styles.iconContainer,
          item.isDestructive && styles.destructiveIconContainer
        ]}>
          <Ionicons 
            name={item.icon} 
            size={20} 
            color={item.isDestructive ? '#FF6B6B' : '#0066CC'} 
          />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={[
            styles.menuItemTitle,
            item.isDestructive && styles.destructiveText
          ]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      {item.hasArrow && (
        <Ionicons name="chevron-forward" size={16} color="#999999" />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const [userData] = useState({
    firstName: 'Kin Clark',
    surname: 'Perez',
    email: 'clarkperez906@gmail.com',
    memberSince: 'August 2024',
  });



  const handleMenuItemPress = (item: ProfileMenuItem) => {
    switch (item.title) {
      case 'Personal Information':
        console.log('Navigating to personal information...');
        router.push('/personal-information' as any);
        break;
      case 'Payment Methods':
        console.log('Navigating to payment methods...');
        router.push('/payment-methods' as any);
        break;
      case 'Notifications':
        console.log('Navigating to notifications...');
        router.push('/notifications' as any);
        break;
      case 'Privacy & Security':
        console.log('Navigating to privacy & security...');
        router.push('/privacy-security' as any);
        break;
      case 'Help & Support':
        console.log('Navigating to help & support...');
        router.push('/help-support' as any);
        break;
      case 'About':
        console.log('Navigating to about...');
        router.push('/about' as any);
        break;
      case 'Log Out':
        console.log('Log out pressed');
        break;
      default:
        console.log('Menu item pressed:', item.title);
    }
  };

  return (
    <SafeAreaView style={styles.container}>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.firstName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.firstName} {userData.surname}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Rentals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>



        <View style={styles.menuSection}>
          <FlatList
            data={profileMenuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProfileMenuItemComponent item={item} onPress={() => handleMenuItemPress(item)} />
            )}
            scrollEnabled={false}
          />
        </View>



        <View style={styles.bottomSpacing} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00A86B',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
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
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#999999',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },



  menuSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIconContainer: {
    backgroundColor: '#FFF5F5',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#999999',
  },
  destructiveText: {
    color: '#FF6B6B',
  },

  bottomSpacing: {
    height: 20,
  },


});
