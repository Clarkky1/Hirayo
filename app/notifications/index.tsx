import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    LogBox,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

LogBox.ignoreAllLogs(true);


export default function NotificationsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [rentalUpdates, setRentalUpdates] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const notificationSettings = [
    {
      id: 'push',
      title: 'Push Notifications',
      subtitle: 'Receive notifications on your device',
      icon: 'phone-portrait',
      value: pushNotifications,
      onValueChange: setPushNotifications,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      subtitle: 'Get updates via email',
      icon: 'mail',
      value: emailNotifications,
      onValueChange: setEmailNotifications,
    },
    {
      id: 'sms',
      title: 'SMS Notifications',
      subtitle: 'Receive text message alerts',
      icon: 'chatbubble',
      value: smsNotifications,
      onValueChange: setSmsNotifications,
    },
  ];

  const notificationTypes = [
    {
      id: 'rental',
      title: 'Rental Updates',
      subtitle: 'Updates about your rentals and bookings',
      icon: 'calendar',
      value: rentalUpdates,
      onValueChange: setRentalUpdates,
    },
    {
      id: 'payment',
      title: 'Payment Reminders',
      subtitle: 'Reminders for payments and transactions',
      icon: 'card',
      value: paymentReminders,
      onValueChange: setPaymentReminders,
    },
    {
      id: 'promotional',
      title: 'Promotional Offers',
      subtitle: 'Deals, discounts, and special offers',
      icon: 'gift',
      value: promotionalOffers,
      onValueChange: setPromotionalOffers,
    },
    {
      id: 'security',
      title: 'Security Alerts',
      subtitle: 'Important security notifications',
      icon: 'shield',
      value: securityAlerts,
      onValueChange: setSecurityAlerts,
    },
  ];

  const handleClearAll = () => {
    console.log('Clear all notifications');
  };

  const handleMarkAllRead = () => {
    console.log('Mark all as read');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done" size={16} color="#0066CC" />
            <Text style={styles.actionButtonText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
            <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          {notificationSettings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name={setting.icon as any} size={20} color="#0066CC" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onValueChange}
                trackColor={{ false: '#E0E0E0', true: '#0066CC' }}
                thumbColor={setting.value ? '#ffffff' : '#ffffff'}
              />
            </View>
          ))}
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {notificationTypes.map((type) => (
            <View key={type.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name={type.icon as any} size={20} color="#0066CC" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{type.title}</Text>
                  <Text style={styles.settingSubtitle}>{type.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={type.value}
                onValueChange={type.onValueChange}
                trackColor={{ false: '#E0E0E0', true: '#0066CC' }}
                thumbColor={type.value ? '#ffffff' : '#ffffff'}
              />
            </View>
          ))}
        </View>

        {/* Quiet Hours Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoIcon}>
            <Ionicons name="moon" size={24} color="#666666" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Quiet Hours</Text>
            <Text style={styles.infoText}>
              Notifications are automatically silenced between 10:00 PM and 8:00 AM
            </Text>
          </View>
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
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
