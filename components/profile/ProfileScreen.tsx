import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
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
import { ProfileEditModal } from './ProfileEditModal';





export default function ProfileScreen() {
  const { profile, updatePreferences, updateProfile, isLoading } = useUser();
  const { logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  // Show loading state while profile is being loaded
  if (isLoading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileImagePress = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: () => {
            // In a real app, this would open the camera
            Alert.alert('Camera', 'Camera functionality would be implemented here');
          }
        },
        { 
          text: 'Choose from Library', 
          onPress: () => {
            // In a real app, this would open the image picker
            Alert.alert('Photo Library', 'Image picker functionality would be implemented here');
          }
        },
        { 
          text: 'Remove Photo', 
          onPress: () => {
            updateProfile({ profileImage: undefined });
            Alert.alert('Success', 'Profile photo removed');
          },
          style: 'destructive'
        },
      ]
    );
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
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={handleProfileImagePress}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              {profile.profileImage ? (
                <View style={styles.profileImageContainer}>
                  <Text style={styles.profileImageText}>IMG</Text>
                </View>
              ) : (
                <Text style={styles.avatarText}>
                  {profile.firstName.split(' ').map(n => n[0]).join('')}
                </Text>
              )}
            </View>
            <View style={styles.onlineIndicator} />
            <View style={styles.editImageOverlay}>
              <Ionicons name="camera" size={16} color={Colors.text.inverse} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile.firstName} {profile.surname}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
            <Text style={styles.memberSince}>Member since {profile.memberSince}</Text>
            {profile.bio && <Text style={styles.userBio}>{profile.bio}</Text>}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.stats.totalRentals}</Text>
              <Text style={styles.statLabel}>Rentals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.stats.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.stats.itemsListed}</Text>
              <Text style={styles.statLabel}>Items Listed</Text>
            </View>
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
            profile.preferences.notifications.push,
            (value) => updatePreferences('notifications', { push: value })
          )}
          {renderSettingItem(
            'mail-outline', 
            'Email Notifications', 
            'Get updates via email',
            undefined,
            false,
            true,
            profile.preferences.notifications.email,
            (value) => updatePreferences('notifications', { email: value })
          )}
          {renderSettingItem(
            'chatbubble-outline', 
            'SMS Notifications', 
            'Get updates via text message',
            undefined,
            false,
            true,
            profile.preferences.notifications.sms,
            (value) => updatePreferences('notifications', { sms: value })
          )}
        </View>

        {/* Security & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          {renderSettingItem('shield-outline', 'Privacy & Security', 'Control your data and visibility', handlePrivacy)}
          {renderSettingItem(
            'eye-outline', 
            'Show Profile', 
            'Make your profile visible to other users',
            undefined,
            false,
            true,
            profile.preferences.privacy.showProfile,
            (value) => updatePreferences('privacy', { showProfile: value })
          )}
          {renderSettingItem(
            'location-outline', 
            'Show Location', 
            'Display your location to other users',
            undefined,
            false,
            true,
            profile.preferences.privacy.showLocation,
            (value) => updatePreferences('privacy', { showLocation: value })
          )}
        </View>

        {/* Rental Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental Preferences</Text>
          {renderSettingItem(
            'checkmark-circle-outline', 
            'Auto Accept', 
            'Automatically accept rental requests',
            undefined,
            false,
            true,
            profile.preferences.rental.autoAccept,
            (value) => updatePreferences('rental', { autoAccept: value })
          )}
          {renderSettingItem(
            'flash-outline', 
            'Instant Booking', 
            'Allow instant booking without approval',
            undefined,
            false,
            true,
            profile.preferences.rental.instantBooking,
            (value) => updatePreferences('rental', { instantBooking: value })
          )}
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

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },
  userBio: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  statsSection: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...TextStyles.heading.h2,
    color: Colors.primary[500],
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
});
