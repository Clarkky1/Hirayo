import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
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
import { Card } from '../../components/ui/Card';

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              '₱8,750',
              '+12.5%',
              'positive',
              'trending-up',
              Colors.success
            )}
            {renderEarningsCard(
              'Active Rentals',
              '₱2,340',
              '+8.2%',
              'positive',
              'car',
              Colors.primary[500]
            )}
            {renderEarningsCard(
              'Pending',
              '₱450',
              '-2.1%',
              'negative',
              'time',
              Colors.warning
            )}
            {renderEarningsCard(
              'This Month',
              '₱1,890',
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
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Canon EOS R5 Rental</Text>
                <Text style={styles.activityTime}>Today, 2:30 PM</Text>
              </View>
              <Text style={styles.activityTransactionAmount}>+₱2,500</Text>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>MacBook Pro Rental</Text>
                <Text style={styles.activityTime}>Yesterday, 10:15 AM</Text>
              </View>
              <Text style={styles.activityTransactionAmount}>+₱3,500</Text>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="time" size={20} color={Colors.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>iPhone 15 Pro Max</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
              <Text style={styles.activityTransactionAmount}>+₱1,800</Text>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>DJI Mavic 3 Drone</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
              <Text style={styles.activityTransactionAmount}>+₱4,200</Text>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Gaming PC RTX 4080</Text>
                <Text style={styles.activityTime}>1 week ago</Text>
              </View>
              <Text style={styles.activityTransactionAmount}>+₱3,800</Text>
            </View>
          </Card>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <Card variant="filled" padding="large" style={styles.breakdownCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="camera" size={20} color={Colors.primary[500]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Cameras</Text>
                <Text style={styles.activityTime}>₱2,340 • 27%</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="laptop" size={20} color={Colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Laptops</Text>
                <Text style={styles.activityTime}>₱1,960 • 22%</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="phone-portrait" size={20} color={Colors.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Phones</Text>
                <Text style={styles.activityTime}>₱1,750 • 20%</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="airplane" size={20} color={Colors.info} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Drones</Text>
                <Text style={styles.activityTime}>₱1,400 • 16%</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="game-controller" size={20} color={Colors.neutral[600]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Others</Text>
                <Text style={styles.activityTime}>₱1,300 • 15%</Text>
              </View>
            </View>
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
});
