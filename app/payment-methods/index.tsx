import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { PaymentMethod, paymentMethodsService } from '@/services/paymentMethodsService';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
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

LogBox.ignoreAllLogs(true);


export default function PaymentMethodsScreen() {
  const { user } = useSupabaseAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const loadPaymentMethods = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await paymentMethodsService.getPaymentMethods(user.id);
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPaymentMethods();
    setRefreshing(false);
  }, [loadPaymentMethods]);

  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleSetDefault = async (methodId: string) => {
    if (!user) return;
    
    try {
      await paymentMethodsService.setDefaultPaymentMethod(user.id, methodId);
      await loadPaymentMethods(); // Refresh the list
      Alert.alert('Success', 'Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentMethodsService.deletePaymentMethod(methodId);
              await loadPaymentMethods(); // Refresh the list
              Alert.alert('Success', 'Payment method deleted');
            } catch (error) {
              console.error('Error deleting payment method:', error);
              Alert.alert('Error', 'Failed to delete payment method');
            }
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    Alert.alert(
      'Add Payment Method',
      'Choose the type of payment method you want to add:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Credit/Debit Card', onPress: () => console.log('Add card') },
        { text: 'Digital Wallet', onPress: () => console.log('Add wallet') },
      ]
    );
  };

  const getCardIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card';
      case 'american express':
        return 'card';
      default:
        return 'card';
    }
  };

  const getWalletIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'gcash':
        return 'phone-portrait';
      case 'paymaya':
        return 'card';
      case 'grabpay':
        return 'car';
      case 'coins.ph':
        return 'wallet';
      default:
        return 'wallet';
    }
  };

  const formatExpiry = (month?: number, year?: number) => {
    if (!month || !year) return '';
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const formatBalance = (balance?: number) => {
    if (!balance) return '';
    return `₱${balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonSection}>
        <SkeletonLoader width="60%" height={20} style={{ marginBottom: 16 }} />
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.skeletonItem}>
            <SkeletonLoader width={48} height={48} borderRadius={24} style={{ marginRight: 16 }} />
            <View style={styles.skeletonInfo}>
              <SkeletonLoader width="40%" height={16} style={{ marginBottom: 4 }} />
              <SkeletonLoader width="60%" height={14} style={{ marginBottom: 2 }} />
              <SkeletonLoader width="30%" height={12} />
            </View>
            <SkeletonLoader width={24} height={24} borderRadius={12} />
          </View>
        ))}
      </View>
    </View>
  );

  const creditCards = paymentMethods.filter(method => 
    method.type === 'credit_card' || method.type === 'debit_card'
  );

  const digitalWallets = paymentMethods.filter(method => 
    method.type === 'digital_wallet'
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
            {/* Credit Cards Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Credit & Debit Cards</Text>
              {creditCards.length > 0 ? (
                creditCards.map((card) => (
                  <View key={card.id} style={styles.cardItem}>
                    <View style={styles.cardLeft}>
                      <View style={styles.cardIcon}>
                        <Ionicons name={getCardIcon(card.provider) as any} size={24} color={Colors.primary[500]} />
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardType}>{card.provider}</Text>
                        <Text style={styles.cardNumber}>**** {card.last4}</Text>
                        <Text style={styles.cardExpiry}>
                          {card.expiry_month && card.expiry_year 
                            ? `Expires ${formatExpiry(card.expiry_month, card.expiry_year)}`
                            : 'No expiry date'
                          }
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardRight}>
                      {card.is_default && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                      <View style={styles.cardActions}>
                        {!card.is_default && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleSetDefault(card.id)}
                          >
                            <Ionicons name="star-outline" size={20} color={Colors.primary[500]} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteMethod(card.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="card-outline" size={48} color={Colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>No credit/debit cards added</Text>
                </View>
              )}
            </View>

            {/* Digital Wallets Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Digital Wallets & E-Money</Text>
              {digitalWallets.length > 0 ? (
                digitalWallets.map((wallet) => (
                  <View key={wallet.id} style={styles.methodItem}>
                    <View style={styles.methodLeft}>
                      <View style={styles.methodIcon}>
                        <Ionicons name={getWalletIcon(wallet.provider)} size={24} color={Colors.primary[500]} />
                      </View>
                      <View style={styles.methodInfo}>
                        <Text style={styles.methodName}>{wallet.provider}</Text>
                        <Text style={styles.methodBalance}>
                          {wallet.balance ? `Balance: ${formatBalance(wallet.balance)}` : 'No balance info'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardRight}>
                      {wallet.is_default && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                      <View style={styles.cardActions}>
                        {!wallet.is_default && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleSetDefault(wallet.id)}
                          >
                            <Ionicons name="star-outline" size={20} color={Colors.primary[500]} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteMethod(wallet.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="wallet-outline" size={48} color={Colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>No digital wallets added</Text>
                </View>
              )}
            </View>

            {/* Add Payment Method Button */}
            <View style={styles.addSection}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod}>
                <Ionicons name="add-circle-outline" size={24} color={Colors.primary[500]} />
                <Text style={styles.addButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacing} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  cardInfo: {
    flex: 1,
  },
  cardType: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  cardNumber: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  cardExpiry: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },
  cardRight: {
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.secondary,
  },
  defaultBadge: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  defaultText: {
    color: Colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  methodBalance: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  addSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderStyle: 'dashed',
  },
  addButtonText: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    marginLeft: Spacing.sm,
  },
  bottomSpacing: {
    height: Spacing.xl,
  },
  // Skeleton loading styles
  skeletonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  skeletonSection: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  skeletonInfo: {
    flex: 1,
  },
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  emptyStateText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
});
