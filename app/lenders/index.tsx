import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function LendersScreen() {
  const handleViewMyItems = () => {
    router.push('/my-items' as any);
  };

  const handleEarnings = () => {
    router.push('/earnings' as any);
  };

  const handleAnalytics = () => {
    router.push('/analytics' as any);
  };

  const handleLenderSettings = () => {
    router.push('/lender-settings' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Welcome, Lender!</Text>
          <Text style={styles.subtitleText}>Start earning by renting out your items</Text>
        </View>

        {/* Getting Started Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Getting Started Tips</Text>
          <View style={styles.tipsCard}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.tipText}>Take clear photos of your items</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.tipText}>Set competitive rental prices</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.tipText}>Respond quickly to rental requests</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.tipText}>Keep your items in good condition</Text>
            </View>
          </View>
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="cube-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Items</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="wallet-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.statNumber}>₱2,450</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </View>

        {/* Quick Access Menu */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity style={styles.menuCard} onPress={handleViewMyItems}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="list-outline" size={24} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuCardTitle}>My Items</Text>
              <Text style={styles.menuCardSubtitle}>Manage your rentals</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={handleEarnings}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="trending-up-outline" size={24} color={Colors.success} />
              </View>
              <Text style={styles.menuCardTitle}>Earnings</Text>
              <Text style={styles.menuCardSubtitle}>View your income</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={handleAnalytics}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="analytics-outline" size={24} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuCardTitle}>Analytics</Text>
              <Text style={styles.menuCardSubtitle}>Track performance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={handleLenderSettings}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="settings-outline" size={24} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuCardTitle}>Settings</Text>
              <Text style={styles.menuCardSubtitle}>Customize preferences</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Ionicons name="notifications" size={20} color={Colors.primary[500]} />
              <Text style={styles.activityTitle}>Latest Updates</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>New rental request for Canon EOS R5</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Payment received: ₱45 from MacBook rental</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>New review received: 5 stars</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
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
  headerSection: {
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  welcomeText: {
    ...TextStyles.heading.h1,
    color: Colors.text.primary,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  quickActionsSection: {
    marginBottom: Spacing.lg,
  },
  overviewSection: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    width: '48%',
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statNumber: {
    ...TextStyles.heading.h2,
    color: Colors.primary[500],
    fontWeight: 'bold',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  quickAccessSection: {
    marginBottom: Spacing.lg,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    width: '48%',
    marginBottom: Spacing.sm,
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  menuCardTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  menuCardSubtitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  recentActivitySection: {
    marginBottom: Spacing['4xl'],
  },
  activityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  activityTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  activityText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  activityTime: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  tipsSection: {
    marginBottom: Spacing.lg, // Changed from xl to lg to be closer to the menu grid
  },
  tipsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tipText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
});
