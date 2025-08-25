import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Card } from '../../components/ui/Card';

interface ItemLocation {
  latitude: number;
  longitude: number;
  address: string;
  lastUpdated: string;
  renterName: string;
  renterPhone: string;
  rentalStartDate: string;
  expectedReturnDate: string;
}

export default function ViewItemScreen() {
  const params = useLocalSearchParams();
  const itemId = params.itemId as string;
  const [itemLocation, setItemLocation] = useState<ItemLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    // Simulate fetching item location data
    const mockLocation: ItemLocation = {
      latitude: 10.3157, // Cebu City coordinates
      longitude: 123.8854,
      address: 'Cebu City, Cebu, Philippines',
      lastUpdated: new Date().toLocaleString(),
      renterName: 'John Smith',
      renterPhone: '+63 912 345 6789',
      rentalStartDate: '2025-01-15',
      expectedReturnDate: '2025-01-18',
    };
    setItemLocation(mockLocation);
  }, [itemId]);

  const handleStartTracking = () => {
    setIsTracking(true);
    Alert.alert(
      'Location Tracking Started',
      'You will now receive real-time updates of your item\'s location.',
      [{ text: 'OK' }]
    );
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    Alert.alert(
      'Location Tracking Stopped',
      'You will no longer receive location updates.',
      [{ text: 'OK' }]
    );
  };

  const handleContactRenter = () => {
    if (itemLocation) {
      Alert.alert(
        'Contact Renter',
        `Call ${itemLocation.renterName} at ${itemLocation.renterPhone}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => console.log('Calling renter...') }
        ]
      );
    }
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'What type of issue would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Item Not Returned', onPress: () => console.log('Reporting item not returned...') },
        { text: 'Item Damaged', onPress: () => console.log('Reporting item damaged...') },
        { text: 'Other', onPress: () => console.log('Reporting other issue...') }
      ]
    );
  };

  if (!itemLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading item location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Map Placeholder */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={64} color={Colors.neutral[400]} />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
              <Text style={styles.mapSubtext}>
                Real-time location tracking will be implemented here
              </Text>
            </View>
            
            {/* Location Coordinates */}
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinatesText}>
                📍 {itemLocation.latitude.toFixed(4)}, {itemLocation.longitude.toFixed(4)}
              </Text>
              <Text style={styles.addressText}>{itemLocation.address}</Text>
            </View>
          </View>
        </View>

        {/* Item Information */}
        <View style={styles.itemInfoSection}>
          <Text style={styles.sectionTitle}>Item Information</Text>
          <Card variant="filled" padding="large" style={styles.itemInfoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="cube" size={20} color={Colors.primary[500]} />
              <Text style={styles.infoLabel}>Item ID:</Text>
              <Text style={styles.infoValue}>{itemId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color={Colors.success} />
              <Text style={styles.infoLabel}>Renter:</Text>
              <Text style={styles.infoValue}>{itemLocation.renterName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color={Colors.primary[500]} />
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{itemLocation.renterPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={Colors.warning} />
              <Text style={styles.infoLabel}>Rental Period:</Text>
              <Text style={styles.infoValue}>
                {itemLocation.rentalStartDate} to {itemLocation.expectedReturnDate}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={Colors.neutral[500]} />
              <Text style={styles.infoLabel}>Last Updated:</Text>
              <Text style={styles.infoValue}>{itemLocation.lastUpdated}</Text>
            </View>
          </Card>
        </View>

        {/* Tracking Controls */}
        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>Location Tracking</Text>
          <Card variant="filled" padding="large" style={styles.trackingCard}>
            <View style={styles.trackingStatus}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: isTracking ? Colors.success : Colors.neutral[400] }
                ]} />
                <Text style={styles.statusText}>
                  {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                </Text>
              </View>
            </View>
            
            <View style={styles.trackingButtons}>
              {!isTracking ? (
                <TouchableOpacity 
                  style={[styles.trackingButton, styles.startButton]} 
                  onPress={handleStartTracking}
                  activeOpacity={0.7}
                >
                  <Ionicons name="play" size={20} color={Colors.text.inverse} />
                  <Text style={styles.buttonText}>Start Tracking</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.trackingButton, styles.stopButton]} 
                  onPress={handleStopTracking}
                  activeOpacity={0.7}
                >
                  <Ionicons name="stop" size={20} color={Colors.text.inverse} />
                  <Text style={styles.buttonText}>Stop Tracking</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.contactButton]} 
              onPress={handleContactRenter}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={20} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Contact Renter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.reportButton]} 
              onPress={handleReportIssue}
              activeOpacity={0.7}
            >
              <Ionicons name="warning" size={20} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securitySection}>
          <Card variant="filled" padding="large" style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
              <Text style={styles.securityTitle}>Security Features</Text>
            </View>
            <Text style={styles.securityText}>
              This location tracking feature is designed for security purposes only. 
              Use it responsibly and in accordance with privacy laws and rental agreements.
            </Text>
          </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  mapSection: {
    marginBottom: Spacing.lg,
  },
  mapContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.background.secondary,
  },
  mapPlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
  },
  mapPlaceholderText: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
  mapSubtext: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  coordinatesContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  coordinatesText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  addressText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  itemInfoSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  itemInfoCard: {
    // Card component handles styling
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoLabel: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    fontWeight: '500',
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm,
    minWidth: 80,
  },
  infoValue: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  trackingSection: {
    marginBottom: Spacing.lg,
  },
  trackingCard: {
    // Card component handles styling
  },
  trackingStatus: {
    marginBottom: Spacing.md,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  statusText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  trackingButtons: {
    alignItems: 'center',
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.base,
    minWidth: 200,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: Colors.success,
  },
  stopButton: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    ...TextStyles.button.medium,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
  },
  actionsSection: {
    marginBottom: Spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.base,
  },
  contactButton: {
    backgroundColor: Colors.primary[500],
  },
  reportButton: {
    backgroundColor: Colors.warning,
  },
  actionButtonText: {
    ...TextStyles.button.small,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
  },
  securitySection: {
    marginBottom: Spacing.xl,
  },
  securityCard: {
    // Card component handles styling
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  securityTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  securityText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
