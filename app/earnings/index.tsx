import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const renderEarningsCard = (
    title: string,
    amount: string,
    change: string,
    changeType: 'positive' | 'negative' | 'neutral',
    icon: keyof typeof Ionicons.glyphMap,
    color: string
  ) => (
    <View style={styles.earningsCard}>
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
    </View>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'year' && styles.periodButtonTextActive]}>
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
              '₱8,750',
              '+12%',
              'positive',
              'wallet',
              Colors.primary[500]
            )}
            {renderEarningsCard(
              'This Period',
              '₱2,450',
              '+8%',
              'positive',
              'calendar',
              Colors.success
            )}
            {renderEarningsCard(
              'Pending',
              '₱680',
              '2 items',
              'neutral',
              'time',
              Colors.warning
            )}
            {renderEarningsCard(
              'Avg. per Item',
              '₱45',
              '+₱5',
              'positive',
              'trending-up',
              Colors.info
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="download-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Export Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="card-outline" size={24} color={Colors.success} />
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="settings-outline" size={24} color={Colors.warning} />
              <Text style={styles.actionText}>Payment Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="help-circle-outline" size={24} color={Colors.info} />
              <Text style={styles.actionText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsCard}>
            {renderTransactionItem(
              'Canon EOS R5 Rental',
              'Today, 2:30 PM',
              '+₱45',
              'completed'
            )}
            {renderTransactionItem(
              'MacBook Pro Rental',
              'Yesterday, 10:15 AM',
              '+₱35',
              'completed'
            )}
            {renderTransactionItem(
              'iPhone 15 Pro Max',
              '2 days ago',
              '+₱25',
              'pending'
            )}
            {renderTransactionItem(
              'DJI Mavic 3 Drone',
              '3 days ago',
              '+₱55',
              'completed'
            )}
            {renderTransactionItem(
              'Gaming PC RTX 4080',
              '1 week ago',
              '+₱40',
              'completed'
            )}
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: Colors.primary[100] }]}>
                  <Ionicons name="camera" size={16} color={Colors.primary[500]} />
                </View>
                <Text style={styles.categoryName}>Cameras</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={styles.categoryAmount}>₱2,340</Text>
                <Text style={styles.categoryPercentage}>27%</Text>
              </View>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: Colors.success[100] }]}>
                  <Ionicons name="laptop" size={16} color={Colors.success} />
                </View>
                <Text style={styles.categoryName}>Laptops</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={styles.categoryAmount}>₱1,960</Text>
                <Text style={styles.categoryPercentage}>22%</Text>
              </View>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: Colors.warning[100] }]}>
                  <Ionicons name="phone-portrait" size={16} color={Colors.warning} />
                </View>
                <Text style={styles.categoryName}>Phones</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={styles.categoryAmount}>₱1,750</Text>
                <Text style={styles.categoryPercentage}>20%</Text>
              </View>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: Colors.info[100] }]}>
                  <Ionicons name="airplane" size={16} color={Colors.info} />
                </View>
                <Text style={styles.categoryName}>Drones</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={styles.categoryAmount}>₱1,400</Text>
                <Text style={styles.categoryPercentage}>16%</Text>
              </View>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: Colors.neutral[100] }]}>
                  <Ionicons name="game-controller" size={16} color={Colors.neutral[600]} />
                </View>
                <Text style={styles.categoryName}>Others</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={styles.categoryAmount}>₱1,300</Text>
                <Text style={styles.categoryPercentage}>15%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentMethodsCard}>
            <View style={styles.paymentMethodItem}>
              <View style={styles.paymentMethodLeft}>
                <Ionicons name="card" size={20} color={Colors.primary[500]} />
                <Text style={styles.paymentMethodName}>Bank Transfer</Text>
              </View>
              <Text style={styles.paymentMethodStatus}>Default</Text>
            </View>
            <View style={styles.paymentMethodItem}>
              <View style={styles.paymentMethodLeft}>
                <Ionicons name="wallet" size={20} color={Colors.success} />
                <Text style={styles.paymentMethodName}>E-Wallet</Text>
              </View>
              <Text style={styles.paymentMethodStatus}>Available</Text>
            </View>
            <TouchableOpacity style={styles.addPaymentMethodButton}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary[500]} />
              <Text style={styles.addPaymentMethodText}>Add Payment Method</Text>
            </TouchableOpacity>
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
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '48%',
    marginBottom: Spacing.sm,
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  earningsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  earningsIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsTitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  earningsAmount: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  earningsChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    ...TextStyles.caption,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  quickActionsSection: {
    marginBottom: Spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '48%',
    marginBottom: Spacing.sm,
    alignItems: 'center',
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  actionText: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
    fontWeight: '500',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  viewAllText: {
    ...TextStyles.body.small,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  transactionsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    marginBottom: Spacing.xs,
  },
  transactionDate: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...TextStyles.body.medium,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    ...TextStyles.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  breakdownSection: {
    marginBottom: Spacing.lg,
  },
  breakdownCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: Spacing.xs,
  },
  categoryPercentage: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  paymentMethodsSection: {
    marginBottom: Spacing.xl,
  },
  paymentMethodsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.softSm,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    ...TextStyles.caption,
    color: Colors.success,
    fontWeight: '500',
  },
  addPaymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  addPaymentMethodText: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
});
