  import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { LenderAnalytics, lenderService } from '@/services/lenderService';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    LogBox,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Card } from '../../components/ui/Card';

LogBox.ignoreAllLogs(true);


export default function AnalyticsScreen() {
  const { user } = useSupabaseAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<LenderAnalytics | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await lenderService.getLenderAnalytics(user.id, selectedPeriod);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedPeriod]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  }, [loadAnalytics]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const renderMetricCard = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    value: string,
    change: string,
    changeType: 'positive' | 'negative' | 'neutral',
    color: string
  ) => (
    <Card variant="filled" padding="large" style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.metricInfo}>
          <Text style={styles.metricTitle}>{title}</Text>
          <Text style={styles.metricValue}>{value}</Text>
        </View>
      </View>
      <View style={styles.metricChange}>
        <Ionicons 
          name={changeType === 'positive' ? 'trending-up' : changeType === 'negative' ? 'trending-down' : 'remove'} 
          size={16} 
          color={changeType === 'positive' ? Colors.success : changeType === 'negative' ? Colors.error : Colors.neutral[500]} 
        />
        <Text style={[
          styles.changeText,
          { color: changeType === 'positive' ? Colors.success : changeType === 'negative' ? Colors.error : Colors.neutral[500] }
        ]}>
          {change}
        </Text>
      </View>
    </Card>
  );

  const renderChartPlaceholder = (title: string, description: string) => (
    <Card variant="filled" padding="large" style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={0.7}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartPlaceholder}>
        <Ionicons name="analytics-outline" size={48} color={Colors.neutral[400]} />
        <Text style={styles.chartPlaceholderText}>{description}</Text>
      </View>
    </Card>
  );

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonPeriodSelector}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonLoader key={index} width="30%" height={36} borderRadius={8} />
        ))}
      </View>

      <View style={styles.skeletonMetricsSection}>
        <SkeletonLoader width="40%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonMetricsGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonMetricCard}>
              <View style={styles.skeletonMetricHeader}>
                <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
                <View style={styles.skeletonMetricInfo}>
                  <SkeletonLoader width="80%" height={14} style={{ marginBottom: 4 }} />
                  <SkeletonLoader width="60%" height={18} />
                </View>
              </View>
              <View style={styles.skeletonMetricChange}>
                <SkeletonLoader width="60%" height={16} />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.skeletonChartsSection}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.skeletonChartCard}>
            <View style={styles.skeletonChartHeader}>
              <SkeletonLoader width="60%" height={18} />
              <SkeletonLoader width="25%" height={16} />
            </View>
            <View style={styles.skeletonChartPlaceholder}>
              <SkeletonLoader width={48} height={48} borderRadius={24} />
              <SkeletonLoader width="80%" height={16} style={{ marginTop: 8 }} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.skeletonTopItemsSection}>
        <SkeletonLoader width="60%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonTopItemsCard}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonTopItem}>
              <SkeletonLoader width={32} height={32} borderRadius={16} style={{ marginRight: 12 }} />
              <View style={styles.skeletonTopItemContent}>
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
            {/* Period Selector */}
            <View style={styles.periodSelector}>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod('week')}
                activeOpacity={0.7}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod('month')}
                activeOpacity={0.7}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod('year')}
                activeOpacity={0.7}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === 'year' && styles.periodButtonTextActive]}>
                  Year
                </Text>
              </TouchableOpacity>
            </View>

            {/* Key Metrics */}
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>Key Metrics</Text>
              <View style={styles.metricsGrid}>
                {renderMetricCard(
                  'eye-outline',
                  'Views',
                  analytics?.total_views?.toLocaleString() || '0',
                  '+8%',
                  'positive',
                  Colors.primary[500]
                )}
                {renderMetricCard(
                  'star',
                  'Rating',
                  analytics?.average_rating?.toFixed(1) || '0.0',
                  '+0.2',
                  'positive',
                  '#FFD700'
                )}
                {renderMetricCard(
                  'repeat',
                  'Repeat',
                  analytics?.repeat_customers?.toString() || '0',
                  '+5',
                  'positive',
                  Colors.success
                )}
              </View>
            </View>

            {/* Performance Charts */}
            <View style={styles.chartsSection}>
              <Text style={styles.sectionTitle}>Performance Overview</Text>
              {renderChartPlaceholder(
                'Views Over Time',
                'Track how many people view your items'
              )}
              {renderChartPlaceholder(
                'Earnings Trend',
                'Monitor your rental income growth'
              )}
              {renderChartPlaceholder(
                'Popular Items',
                'See which items perform best'
              )}
            </View>

            {/* Top Performing Items */}
            <View style={styles.topItemsSection}>
              <Text style={styles.sectionTitle}>Top Performing Items</Text>
              <Card variant="filled" padding="large" style={styles.topItemsCard}>
                {analytics?.top_performing_items && analytics.top_performing_items.length > 0 ? (
                  analytics.top_performing_items.map((item, index) => (
                    <View key={item.id} style={styles.activityItem}>
                      <View style={styles.activityIconContainer}>
                        <Ionicons name="star" size={20} color="#FFD700" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{item.name}</Text>
                        <Text style={styles.activityTime}>
                          {item.rentals} rentals • {item.rating.toFixed(1)} rating • {item.views} views
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyTopItems}>
                    <Ionicons name="trophy-outline" size={40} color={Colors.neutral[400]} />
                    <Text style={styles.emptyTopItemsText}>No performance data yet</Text>
                  </View>
                )}
              </Card>
            </View>

            {/* Customer Insights */}
            <View style={styles.insightsSection}>
              <Text style={styles.sectionTitle}>Customer Insights</Text>
              <Card variant="filled" padding="large" style={styles.insightsCard}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Ionicons name="people" size={20} color={Colors.primary[500]} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Most Active Time</Text>
                    <Text style={styles.activityTime}>{analytics?.customer_insights?.most_active_time || 'Weekends (Fri-Sun)'}</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Ionicons name="location" size={20} color={Colors.success} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Top Location</Text>
                    <Text style={styles.activityTime}>{analytics?.customer_insights?.top_location || 'Cebu City (45%)'}</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Ionicons name="calendar" size={20} color={Colors.warning} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Peak Season</Text>
                    <Text style={styles.activityTime}>{analytics?.customer_insights?.peak_season || 'December - March'}</Text>
                  </View>
                </View>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  periodButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: Colors.text.inverse,
  },
  metricsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  metricCard: {
    width: '31%',
    marginBottom: Spacing.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    ...TextStyles.caption,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  chartsSection: {
    marginBottom: Spacing.lg,
  },
  chartCard: {
    marginBottom: Spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chartTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  viewDetailsButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  viewDetailsText: {
    ...TextStyles.body.small,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  chartPlaceholderText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  topItemsSection: {
    marginBottom: Spacing.lg,
  },
  topItemsCard: {
    // Card component handles styling
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  topItemRank: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rankText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: 'bold',
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  topItemStats: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  topItemViews: {
    alignItems: 'flex-end',
  },
  viewsText: {
    ...TextStyles.body.small,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  insightsSection: {
    marginBottom: Spacing.xl,
  },
  insightsCard: {
    // Card component handles styling
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  insightContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  insightTitle: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  insightValue: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  // Activity item styles (same as lenders page)
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
  // Skeleton loading styles
  skeletonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  skeletonPeriodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  skeletonMetricsSection: {
    marginBottom: Spacing.lg,
  },
  skeletonMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  skeletonMetricCard: {
    width: '31%',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
  },
  skeletonMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  skeletonMetricInfo: {
    flex: 1,
  },
  skeletonMetricChange: {
    marginTop: Spacing.sm,
  },
  skeletonChartsSection: {
    marginBottom: Spacing.lg,
  },
  skeletonChartCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
  },
  skeletonChartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  skeletonChartPlaceholder: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  skeletonTopItemsSection: {
    marginBottom: Spacing.lg,
  },
  skeletonTopItemsCard: {
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
  },
  skeletonTopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  skeletonTopItemContent: {
    flex: 1,
  },
  emptyTopItems: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTopItemsText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
});
