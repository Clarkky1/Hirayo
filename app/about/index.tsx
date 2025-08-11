import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AboutScreen() {
  const appInfo = {
    name: 'Hirayo',
    version: '1.0.0',
    buildNumber: '2024.1.0',
    description: 'Your trusted platform for renting high-quality items. Connect with reliable lenders and find what you need, when you need it.',
  };

  const companyInfo = {
    name: 'Hirayo Technologies Inc.',
    founded: '2025',
    mission: 'To make quality items accessible to everyone through a trusted, community-driven rental platform.',
    vision: 'Building a world where sharing resources is simple, secure, and sustainable.',
  };

  const legalLinks = [
    { id: 'privacy', title: 'Privacy Policy', icon: 'shield-checkmark' },
    { id: 'terms', title: 'Terms of Service', icon: 'document-text' },
    { id: 'refund', title: 'Refund Policy', icon: 'card' },
    { id: 'shipping', title: 'Shipping Policy', icon: 'car' },
  ];

  const socialLinks = [
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', color: '#0A66C2' },
  ];

  const handleLegalLink = (linkId: string) => {
    console.log('Legal link tapped:', linkId);
  };

  const handleSocialLink = (socialId: string) => {
    console.log('Social link tapped:', socialId);
  };

  const handleContactUs = () => {
    console.log('Contact us');
  };

  const handleRateApp = () => {
    console.log('Rate app');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Logo and Info */}
        <View style={styles.appSection}>
          <View style={styles.appLogo}>
            <Text style={styles.appLogoText}>H</Text>
          </View>
          <Text style={styles.appName}>{appInfo.name}</Text>
          <Text style={styles.appVersion}>Version {appInfo.version}</Text>
          <Text style={styles.appDescription}>{appInfo.description}</Text>
        </View>

        {/* Company Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            <Text style={styles.companyFounded}>Founded in {companyInfo.founded}</Text>
            <Text style={styles.companyMission}>{companyInfo.mission}</Text>
            <Text style={styles.companyVision}>{companyInfo.vision}</Text>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          {legalLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.legalItem}
              onPress={() => handleLegalLink(link.id)}
            >
              <View style={styles.legalLeft}>
                <View style={styles.legalIcon}>
                  <Ionicons name={link.icon as any} size={20} color="#0066CC" />
                </View>
                <Text style={styles.legalTitle}>{link.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialGrid}>
            {socialLinks.map((social) => (
              <TouchableOpacity
                key={social.id}
                style={styles.socialItem}
                onPress={() => handleSocialLink(social.id)}
              >
                <View style={[styles.socialIcon, { backgroundColor: social.color }]}>
                  <Ionicons name={social.icon as any} size={24} color="#ffffff" />
                </View>
                <Text style={styles.socialName}>{social.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleContactUs}>
            <Ionicons name="mail" size={20} color="#0066CC" />
            <Text style={styles.actionButtonText}>Contact Us</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleRateApp}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.actionButtonText}>Rate Our App</Text>
          </TouchableOpacity>
        </View>

        {/* App Details */}
        <View style={styles.infoSection}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle" size={24} color="#0066CC" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>App Information</Text>
            <Text style={styles.infoText}>
              Build Number: {appInfo.buildNumber}{'\n'}
              Platform: React Native{'\n'}
              Last Updated: December 2024{'\n'}
              Developer: Hirayo Development Team
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
  appSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appLogoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
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
  companyInfo: {
    alignItems: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  companyFounded: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  companyMission: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  companyVision: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  socialIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
