  import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { LenderEarnings, lenderService } from '@/services/lenderService';
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
  View
} from 'react-native';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Card } from '../../components/ui/Card';

LogBox.ignoreAllLogs(true);


export default function EarningsScreen() {
  const { user } = useSupabaseAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earnings, setEarnings] = useState<LenderEarnings | null>(null);

  const loadEarnings = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await lenderService.getLenderEarnings(user.id, selectedPeriod);
      setEarnings(data);
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedPeriod]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEarnings();
    setRefreshing(false);
  }, [loadEarnings]);

  useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  const renderEarningsCard = (
    title: string,
    amount: string,
    change: string,
    changeType: 'positive' | 'negative' | 'neutral',
    icon: keyof typeof Ionicons.glyphMap,
    color: string
  ) => (
    <Card variant="filled" padding="large" style={styles.earningsCard}>
      <View style={styles.earningsCardHeader}>
        <View style={[styles.earningsIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.earningsInfo}>
          <Text style={styles.earningsTitle}>{title}</Text>
          <Text style={styles.earningsAmount}>{amount}</Text>
        </View>
      </View>
      <View style={styles.earningsChange}>
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

  const renderTransactionItem = (
    itemName: string,
    date: string,
    amount: string,
    status: 'completed' | 'pending' | 'cancelled'
  ) => {
    const getStatusColor = () => {
      switch (status) {
        case 'completed': return Colors.success;
        case 'pending': return Colors.warning;
        case 'cancelled': return Colors.error;
        default: return Colors.neutral[500];
      }
    };

    const getStatusText = () => {
      switch (status) {
        case 'completed': return 'Completed';
        case 'pending': return 'Pending';
        case 'cancelled': return 'Cancelled';
        default: return status;
      }
    };

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>{itemName}</Text>
          <Text style={styles.transactionDate}>{date}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>{amount}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonPeriodSelector}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonLoader key={index} width="30%" height={36} borderRadius={8} />
        ))}
      </View>

      <View style={styles.skeletonEarningsSection}>
        <SkeletonLoader width="50%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonEarningsGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.skeletonEarningsCard}>
              <View style={styles.skeletonEarningsHeader}>
                <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
                <View style={styles.skeletonEarningsInfo}>
                  <SkeletonLoader width="80%" height={14} style={{ marginBottom: 4 }} />
                  <SkeletonLoader width="60%" height={18} />
                </View>
              </View>
              <View style={styles.skeletonEarningsChange}>
                <SkeletonLoader width="60%" height={16} />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.skeletonTransactionsSection}>
        <SkeletonLoader width="50%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonTransactionsCard}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.skeletonTransactionItem}>
              <SkeletonLoader width={32} height={32} borderRadius={16} style={{ marginRight: 12 }} />
              <View style={styles.skeletonTransactionContent}>
                <SkeletonLoader width="80%" height={16} style={{ marginBottom: 4 }} />
                <SkeletonLoader width="60%" height={12} />
              </View>
              <SkeletonLoader width="20%" height={16} />
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
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === 'week' && styles.periodButtonTextActive
                ]}>
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod('month')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === 'month' && styles.periodButtonTextActive
                ]}>
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod('year')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === 'year' && styles.periodButtonTextActive
                ]}>
                  Year
                </Text>
              </TouchableOpacity>
            </View>

            {/* Earnings Overview */}
            <View style={styles.earningsOverviewSection}>
              <Text style={styles.sectionTitle}>Earnings Overview</Text>
              <View style={styles.earningsGrid}>
                {renderEarningsCard(
                  'Total Earnings',
                  `₱${earnings?.total_earnings?.toLocaleString() || '0'}`,
                  '+12.5%',
                  'positive',
                  'trending-up',
                  Colors.success
                )}
                {renderEarningsCard(
                  'Active Rentals',
                  `₱${earnings?.active_rentals?.toLocaleString() || '0'}`,
                  '+8.2%',
                  'positive',
                  'car',
                  Colors.primary[500]
                )}
                {renderEarningsCard(
                  'Pending',
                  `₱${earnings?.pending_amount?.toLocaleString() || '0'}`,
                  '-2.1%',
                  'negative',
                  'time',
                  Colors.warning
                )}
                {renderEarningsCard(
                  'This Month',
                  `₱${earnings?.this_month?.toLocaleString() || '0'}`,
                  '+15.3%',
                  'positive',
                  'calendar',
                  Colors.info
                )}
              </View>
            </View>



            {/* Recent Transactions */}
            <View style={styles.transactionsSection}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Card variant="filled" padding="large" style={styles.transactionsCard}>
                {earnings?.recent_transactions && earnings.recent_transactions.length > 0 ? (
                  earnings.recent_transactions.map((transaction) => (
                    <View key={transaction.id} style={styles.activityItem}>
                      <View style={styles.activityIconContainer}>
                        <Ionicons 
                          name={transaction.status === 'completed' ? 'checkmark-circle' : 
                                transaction.status === 'pending' ? 'time' : 'close-circle'} 
                          size={20} 
                          color={transaction.status === 'completed' ? Colors.success : 
                                 transaction.status === 'pending' ? Colors.warning : Colors.error} 
                        />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{transaction.item_name}</Text>
                        <Text style={styles.activityTime}>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.activityTransactionAmount}>+₱{transaction.amount.toLocaleString()}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyTransactions}>
                    <Ionicons name="receipt-outline" size={40} color={Colors.neutral[400]} />
                    <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
                  </View>
                )}
              </Card>
            </View>

            {/* Earnings Breakdown */}
            <View style={styles.breakdownSection}>
              <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
              <Card variant="filled" padding="large" style={styles.breakdownCard}>
                {earnings?.earnings_by_category && earnings.earnings_by_category.length > 0 ? (
                  earnings.earnings_by_category.map((category, index) => {
                    const getCategoryIcon = (categoryName: string) => {
                      switch (categoryName.toLowerCase()) {
                        case 'cameras': return 'camera';
                        case 'laptops': return 'laptop';
                        case 'phones': return 'phone-portrait';
                        case 'drones': return 'airplane';
                        default: return 'cube';
                      }
                    };
                    
                    const getCategoryColor = (index: number) => {
                      const colors = [Colors.primary[500], Colors.success, Colors.warning, Colors.info, Colors.neutral[600]];
                      return colors[index % colors.length];
                    };

                    return (
                      <View key={category.category} style={styles.activityItem}>
                        <View style={styles.activityIconContainer}>
                          <Ionicons name={getCategoryIcon(category.category) as any} size={20} color={getCategoryColor(index)} />
                        </View>
                        <View style={styles.activityContent}>
                          <Text style={styles.activityTitle}>{category.category}</Text>
                          <Text style={styles.activityTime}>
                            ₱{category.amount.toLocaleString()} • {category.percentage.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyBreakdown}>
                    <Ionicons name="pie-chart-outline" size={40} color={Colors.neutral[400]} />
                    <Text style={styles.emptyBreakdownText}>No earnings data available</Text>
                  </View>
                )}
              </Card>
            </View>

            {/* Payment Methods */}
            <View style={styles.paymentMethodsSection}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
              <Card variant="filled" padding="large" style={styles.paymentMethodsCard}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Ionicons name="card" size={20} color={Colors.primary[500]} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Bank Transfer</Text>
                    <Text style={styles.activityTime}>Default payment method</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Ionicons name="wallet" size={20} color={Colors.success} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>E-Wallet</Text>
                    <Text style={styles.activityTime}>Available for transactions</Text>
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
  earningsOverviewSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningsCard: {
    width: '48%',
    marginBottom: Spacing.sm,
  },
  earningsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  earningsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsTitle: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  earningsAmount: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  earningsChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  changeText: {
    ...TextStyles.body.small,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },

  transactionsSection: {
    marginBottom: Spacing.lg,
  },
  transactionsCard: {
    marginBottom: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...TextStyles.body.medium,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...TextStyles.body.small,
    fontWeight: '500',
  },
  breakdownSection: {
    marginBottom: Spacing.lg,
  },
  breakdownCard: {
    marginBottom: 0,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  categoryName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  breakdownRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryPercentage: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  paymentMethodsSection: {
    marginBottom: Spacing.lg,
  },
  paymentMethodsCard: {
    marginBottom: 0,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  paymentMethodStatus: {
    ...TextStyles.body.small,
    color: Colors.success,
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
  activityTransactionAmount: {
    ...TextStyles.body.medium,
    color: Colors.success,
    fontWeight: '600',
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
  skeletonEarningsSection: {
    marginBottom: Spacing.lg,
  },
  skeletonEarningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonEarningsCard: {
    width: '48%',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
  },
  skeletonEarningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  skeletonEarningsInfo: {
    flex: 1,
  },
  skeletonEarningsChange: {
    marginTop: Spacing.sm,
  },
  skeletonTransactionsSection: {
    marginBottom: Spacing.lg,
  },
  skeletonTransactionsCard: {
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
  },
  skeletonTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  skeletonTransactionContent: {
    flex: 1,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTransactionsText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  emptyBreakdown: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyBreakdownText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
});
