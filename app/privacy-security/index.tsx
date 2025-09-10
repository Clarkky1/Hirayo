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


export default function PrivacySecurityScreen() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [dataAnalytics, setDataAnalytics] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');

  const securitySettings = [
    {
      id: 'twoFactor',
      title: 'Two-Factor Authentication',
      subtitle: 'Add an extra layer of security to your account',
      icon: 'shield-checkmark',
      value: twoFactorAuth,
      onValueChange: setTwoFactorAuth,
    },
    {
      id: 'biometric',
      title: 'Biometric Login',
      subtitle: 'Use fingerprint or face ID to log in',
      icon: 'finger-print',
      value: biometricLogin,
      onValueChange: setBiometricLogin,
    },
  ];

  const privacySettings = [
    {
      id: 'location',
      title: 'Location Sharing',
      subtitle: 'Share your location for better service',
      icon: 'location',
      value: locationSharing,
      onValueChange: setLocationSharing,
    },
    {
      id: 'analytics',
      title: 'Data Analytics',
      subtitle: 'Help improve our services with usage data',
      icon: 'analytics',
      value: dataAnalytics,
      onValueChange: setDataAnalytics,
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      subtitle: 'Receive promotional emails and offers',
      icon: 'mail',
      value: marketingEmails,
      onValueChange: setMarketingEmails,
    },
  ];

  const handleChangePassword = () => {
    console.log('Change password');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account');
  };

  const handleExportData = () => {
    console.log('Export data');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          {securitySettings.map((setting) => (
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
          
          {/* Change Password Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <View style={styles.buttonLeft}>
              <View style={styles.buttonIcon}>
                <Ionicons name="key" size={20} color="#0066CC" />
              </View>
              <View style={styles.buttonInfo}>
                <Text style={styles.buttonTitle}>Change Password</Text>
                <Text style={styles.buttonSubtitle}>Update your account password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          {privacySettings.map((setting) => (
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

          {/* Profile Visibility */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="eye" size={20} color="#0066CC" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Profile Visibility</Text>
                <Text style={styles.settingSubtitle}>Control who can see your profile</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.visibilityButton}>
              <Text style={styles.visibilityText}>Public</Text>
              <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <View style={styles.buttonLeft}>
              <View style={styles.buttonIcon}>
                <Ionicons name="download" size={20} color="#0066CC" />
              </View>
              <View style={styles.buttonInfo}>
                <Text style={styles.buttonTitle}>Export My Data</Text>
                <Text style={styles.buttonSubtitle}>Download a copy of your data</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAccount}>
            <View style={styles.buttonLeft}>
              <View style={styles.buttonIcon}>
                <Ionicons name="trash" size={20} color="#FF6B6B" />
              </View>
              <View style={styles.buttonInfo}>
                <Text style={[styles.buttonTitle, { color: '#FF6B6B' }]}>Delete Account</Text>
                <Text style={styles.buttonSubtitle}>Permanently remove your account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle" size={24} color="#0066CC" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Security Tips</Text>
            <Text style={styles.infoText}>
              • Use a strong, unique password{'\n'}
              • Enable two-factor authentication{'\n'}
              • Keep your app updated{'\n'}
              • Never share your login credentials
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonInfo: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  visibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  visibilityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066CC',
    marginRight: 4,
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
    backgroundColor: '#f0f8ff',
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
