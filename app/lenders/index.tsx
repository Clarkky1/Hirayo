  import { Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
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
import { Card } from '../../components/ui/Card';

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



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Welcome, Lender!</Text>
          <Text style={styles.subtitleText}>Start earning by renting out your items</Text>
        </View>

                 <View style={styles.quickActionsSection}>
           <Text style={styles.sectionTitle}>Quick Actions</Text>
           <View style={styles.quickActionsGrid}>
                           <TouchableOpacity onPress={handleViewMyItems} activeOpacity={0.7} style={styles.quickActionButton}>
                <Card variant="filled" padding="large" style={styles.quickActionCard}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="list-outline" size={24} color={Colors.primary[500]} />
                  </View>
                  <Text style={styles.quickActionTitle}>My Items</Text>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleEarnings} activeOpacity={0.7} style={styles.quickActionButton}>
                <Card variant="filled" padding="large" style={styles.quickActionCard}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="trending-up-outline" size={24} color={Colors.success} />
                  </View>
                  <Text style={styles.quickActionTitle}>Earnings</Text>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAnalytics} activeOpacity={0.7} style={styles.quickActionButton}>
                <Card variant="filled" padding="large" style={styles.quickActionCard}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="analytics-outline" size={24} color={Colors.primary[500]} />
                  </View>
                  <Text style={styles.quickActionTitle}>Analytics</Text>
                </Card>
              </TouchableOpacity>
           </View>
         </View>

        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <Card variant="filled" padding="large" style={styles.statCard}>
              <Ionicons name="cube-outline" size={20} color={Colors.primary[500]} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Items</Text>
            </Card>
            
            <Card variant="filled" padding="large" style={styles.statCard}>
              <Ionicons name="wallet-outline" size={20} color={Colors.primary[500]} />
              <Text style={styles.statNumber}>₱2,450</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </Card>
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Getting Started Tips</Text>
          <Card variant="filled" padding="large" style={styles.tipsCard}>
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
          </Card>
        </View>

        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card variant="default" padding="large" style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Ionicons name="notifications" size={18} color={Colors.primary[500]} />
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
  headerSection: {
    marginBottom: Spacing.xl,
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
    marginBottom: Spacing.xl,
  },
  overviewSection: {
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
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
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  quickActionButton: {
    flex: 1,
  },
  quickActionCard: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
  },
  quickActionIcon: {
    marginBottom: Spacing.sm,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTitle: {
    ...TextStyles.body.small,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 13,
  },

  recentActivitySection: {
    marginBottom: Spacing['4xl'],
  },
  activityCard: {
    // Card component handles styling
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
    flex: 1,
    marginRight: Spacing.sm,
  },
  activityTime: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  tipsSection: {
    marginBottom: Spacing.xl,
  },
  tipsCard: {
    // Card component handles styling
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
