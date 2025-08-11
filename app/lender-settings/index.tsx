import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function LenderSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(false);
  const [instantPayouts, setInstantPayouts] = useState(true);

  const handleEditProfile = () => {
    console.log('Edit Profile');
  };

  const handlePaymentMethods = () => {
    console.log('Payment Methods');
  };

  const handleSecurity = () => {
    console.log('Security Settings');
  };

  const handlePrivacy = () => {
    console.log('Privacy Settings');
  };

  const handleHelp = () => {
    console.log('Help & Support');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') }
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
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          {renderSettingItem('person-outline', 'Edit Profile', 'Update your personal information', handleEditProfile)}
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

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem(
            'checkmark-circle-outline', 
            'Auto-accept Bookings', 
            'Automatically accept booking requests',
            undefined,
            false,
            true,
            autoAcceptBookings,
            setAutoAcceptBookings
          )}
          {renderSettingItem(
            'wallet-outline', 
            'Instant Payouts', 
            'Receive payments immediately after rental',
            undefined,
            false,
            true,
            instantPayouts,
            setInstantPayouts
          )}
        </View>

        {/* Security & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          {renderSettingItem('shield-outline', 'Security Settings', 'Password and authentication', handleSecurity)}
          {renderSettingItem('lock-closed-outline', 'Privacy Settings', 'Control your data and visibility', handlePrivacy)}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem('help-circle-outline', 'Help & Support', 'Get help and contact support', handleHelp)}
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
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
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
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
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    ...Shadows.softXs,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.softXs,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
