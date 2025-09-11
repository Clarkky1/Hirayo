  import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    LogBox,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Card } from '../../components/ui/Card';

LogBox.ignoreAllLogs(true);


export default function LenderSettingsScreen() {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(false);
  const [instantPayouts, setInstantPayouts] = useState(true);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Load user settings from Supabase
      // For now, we'll use default values
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSettings();
    setRefreshing(false);
  }, [loadSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

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

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 5 }).map((_, sectionIndex) => (
        <View key={sectionIndex} style={styles.skeletonSection}>
          <SkeletonLoader width="30%" height={20} style={{ marginBottom: 16, marginTop: 16 }} />
          {Array.from({ length: 2 }).map((_, itemIndex) => (
            <View key={itemIndex} style={styles.skeletonSettingItem}>
              <View style={styles.skeletonSettingLeft}>
                <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
                <View style={styles.skeletonSettingText}>
                  <SkeletonLoader width="60%" height={16} style={{ marginBottom: 4 }} />
                  <SkeletonLoader width="80%" height={12} />
                </View>
              </View>
              <SkeletonLoader width={24} height={24} borderRadius={12} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#667EEA']}
            tintColor="#667EEA"
          />
        }
      >
        {loading ? (
          renderSkeletonLoader()
        ) : (
          <>
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

            {/* App Version */}
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>App Version 1.0.0</Text>
            </View>
          </>
        )}
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
  // Skeleton loading styles
  skeletonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  skeletonSection: {
    marginBottom: Spacing.lg,
  },
  skeletonSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
  },
  skeletonSettingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skeletonSettingText: {
    flex: 1,
  },
});
