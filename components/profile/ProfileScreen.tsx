import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from '../ui/Card';





export default function ProfileScreen() {
  const [userData] = useState({
    firstName: 'Kin Clark',
    surname: 'Perez',
    email: 'clarkperez906@gmail.com',
    memberSince: 'August 2024',
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const { logout } = useAuth();

  const handleEditProfile = () => {
    router.push('/personal-information' as any);
  };

  const handlePaymentMethods = () => {
    router.push('/payment-methods' as any);
  };

  const handleNotifications = () => {
    router.push('/notifications' as any);
  };

  const handlePrivacy = () => {
    router.push('/privacy-security' as any);
  };

  const handleHelp = () => {
    router.push('/help-support' as any);
  };

  const handleAbout = () => {
    router.push('/about' as any);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            logout();
            // Navigate to login page after logout
            router.replace('/login');
          }
        }
      ]
    );
  };

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showArrow: boolean = true,
    showSwitch?: boolean,
    switchValue?: boolean,
    onSwitchChange?: (value: boolean) => void
  ) => (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Card variant="filled" padding="large" style={styles.settingItem}>
        <View style={styles.settingItemLeft}>
          <View style={styles.settingIconContainer}>
            <Ionicons name={icon} size={20} color={Colors.primary[500]} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        <View style={styles.settingItemRight}>
          {showSwitch && onSwitchChange && (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[300] }}
              thumbColor={switchValue ? Colors.primary[500] : Colors.neutral[500]}
            />
          )}
          {showArrow && (
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
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



        {/* Profile Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          {renderSettingItem('person-outline', 'Personal Information', 'Update your personal information', handleEditProfile)}
          {renderSettingItem('card-outline', 'Payment Methods', 'Manage your payment options', handlePaymentMethods)}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem(
            'notifications-outline', 
            'Push Notifications', 
            'Receive notifications about bookings and messages',
            undefined,
            false,
            true,
            notificationsEnabled,
            setNotificationsEnabled
          )}
          {renderSettingItem(
            'mail-outline', 
            'Email Notifications', 
            'Get updates via email',
            undefined,
            false,
            true,
            emailNotifications,
            setEmailNotifications
          )}
        </View>

        {/* Security & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          {renderSettingItem('shield-outline', 'Privacy & Security', 'Control your data and visibility', handlePrivacy)}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem('help-circle-outline', 'Help & Support', 'Get help and contact support', handleHelp)}
          {renderSettingItem('information-circle-outline', 'About', 'App version and legal information', handleAbout)}
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Card variant="filled" padding="large" style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>
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
    paddingHorizontal: Spacing.lg,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.lg,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 12,
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
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  memberSince: {
    fontSize: 12,
    color: '#999999',
  },




  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  settingSubtitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  logoutText: {
    ...TextStyles.body.medium,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  versionText: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },


});
