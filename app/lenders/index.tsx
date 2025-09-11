  import { Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { lenderService } from '@/services/lenderService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    LogBox,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Card } from '../../components/ui/Card';

LogBox.ignoreAllLogs(true);


interface LenderOverview {
  total_items: number;
  active_items: number;
  total_earnings: number;
  this_month_earnings: number;
  total_rentals: number;
  recent_activity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    amount?: number;
    item_name?: string;
    renter_name?: string;
  }>;
}

export default function LendersScreen() {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState<LenderOverview | null>(null);

  const loadOverview = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await lenderService.getLenderOverview(user.id);
      setOverview(data);
    } catch (error) {
      console.error('Error loading lender overview:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOverview();
    setRefreshing(false);
  }, [loadOverview]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleViewMyItems = () => {
    router.push('/my-items' as any);
  };

  const handleEarnings = () => {
    router.push('/earnings' as any);
  };

  const handleAnalytics = () => {
    router.push('/analytics' as any);
  };

  const handleMessages = () => {
    router.push('/lender-messages' as any);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment_received': return 'wallet';
      case 'rental_request': return 'notifications';
      case 'review_received': return 'star';
      case 'item_rented': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'payment_received': return Colors.success;
      case 'rental_request': return Colors.primary[500];
      case 'review_received': return '#FFD700';
      case 'item_rented': return Colors.success;
      default: return Colors.neutral[500];
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };



  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader}>
        <SkeletonLoader width="60%" height={32} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="80%" height={16} />
      </View>
      
      <View style={styles.skeletonSection}>
        <SkeletonLoader width="40%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonActionsGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.skeletonActionCard}>
              <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
              <SkeletonLoader width="80%" height={14} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.skeletonSection}>
        <SkeletonLoader width="30%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonStatsRow}>
          <View style={styles.skeletonStatCard}>
            <SkeletonLoader width={20} height={20} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="60%" height={24} style={{ marginBottom: 4 }} />
            <SkeletonLoader width="80%" height={12} />
          </View>
          <View style={styles.skeletonStatCard}>
            <SkeletonLoader width={20} height={20} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="60%" height={24} style={{ marginBottom: 4 }} />
            <SkeletonLoader width="80%" height={12} />
          </View>
        </View>
      </View>

      <View style={styles.skeletonSection}>
        <SkeletonLoader width="50%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonActivityCard}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonActivityItem}>
              <SkeletonLoader width={32} height={32} borderRadius={16} style={{ marginRight: 12 }} />
              <View style={styles.skeletonActivityContent}>
                <SkeletonLoader width="80%" height={16} style={{ marginBottom: 4 }} />
                <SkeletonLoader width="60%" height={12} />
              </View>
            </View>
          ))}
        </View>
      </View>
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
                      <Ionicons name="list-outline" size={20} color={Colors.primary[500]} />
                    </View>
                    <Text style={styles.quickActionTitle}>My Items</Text>
                  </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleEarnings} activeOpacity={0.7} style={styles.quickActionButton}>
                  <Card variant="filled" padding="large" style={styles.quickActionCard}>
                    <View style={styles.quickActionIcon}>
                      <Ionicons name="trending-up-outline" size={20} color={Colors.success} />
                    </View>
                    <Text style={styles.quickActionTitle}>Earnings</Text>
                  </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleAnalytics} activeOpacity={0.7} style={styles.quickActionButton}>
                  <Card variant="filled" padding="large" style={styles.quickActionCard}>
                    <View style={styles.quickActionIcon}>
                      <Ionicons name="analytics-outline" size={20} color={Colors.primary[500]} />
                    </View>
                    <Text style={styles.quickActionTitle}>Analytics</Text>
                  </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleMessages} activeOpacity={0.7} style={styles.quickActionButton}>
                  <Card variant="filled" padding="large" style={styles.quickActionCard}>
                    <View style={styles.quickActionIcon}>
                      <Ionicons name="chatbubbles-outline" size={20} color={Colors.primary[500]} />
                    </View>
                    <Text style={styles.quickActionTitle}>Messages</Text>
                  </Card>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.overviewSection}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.statsRow}>
                <Card variant="filled" padding="large" style={styles.statCard}>
                  <Ionicons name="cube-outline" size={20} color={Colors.primary[500]} />
                  <Text style={styles.statNumber}>{overview?.active_items || 0}</Text>
                  <Text style={styles.statLabel}>Active Items</Text>
                </Card>
                
                <Card variant="filled" padding="large" style={styles.statCard}>
                  <Ionicons name="wallet-outline" size={20} color={Colors.primary[500]} />
                  <Text style={styles.statNumber}>₱{overview?.this_month_earnings?.toLocaleString() || '0'}</Text>
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
              <Card variant="filled" padding="large" style={styles.activityCard}>
                {overview?.recent_activity && overview.recent_activity.length > 0 ? (
                  overview.recent_activity.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                      <View style={styles.activityIconContainer}>
                        <Ionicons 
                          name={getActivityIcon(activity.type) as any} 
                          size={20} 
                          color={getActivityColor(activity.type)} 
                        />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activityTime}>{formatTimeAgo(activity.timestamp)}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyActivity}>
                    <Ionicons name="time-outline" size={40} color={Colors.neutral[400]} />
                    <Text style={styles.emptyActivityText}>No recent activity</Text>
                  </View>
                )}
              </Card>
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
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  quickActionButton: {
    flex: 1,
  },
  quickActionCard: {
    alignItems: 'center',
    height: 90,
    justifyContent: 'center',
  },
  quickActionIcon: {
    marginBottom: Spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
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
  // Skeleton loading styles
  skeletonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  skeletonHeader: {
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  skeletonSection: {
    marginBottom: Spacing.xl,
  },
  skeletonActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  skeletonActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skeletonStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  skeletonStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skeletonActivityCard: {
    paddingVertical: Spacing.md,
  },
  skeletonActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  skeletonActivityContent: {
    flex: 1,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyActivityText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
});
