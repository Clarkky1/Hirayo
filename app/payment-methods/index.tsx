import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PaymentMethodsScreen() {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const creditCards = [
    { id: '1', type: 'Visa', last4: '**** 1234', expiry: '12/25', isDefault: true },
    { id: '2', type: 'Mastercard', last4: '**** 5678', expiry: '08/26', isDefault: false },
    { id: '3', type: 'American Express', last4: '**** 9012', expiry: '03/27', isDefault: false },
  ];

  const thirdPartyMethods = [
    { id: 'gcash', name: 'GCash', icon: 'phone-portrait', balance: '₱2,450.00' },
    { id: 'paymaya', name: 'PayMaya', icon: 'card', balance: '₱1,200.00' },
    { id: 'grabpay', name: 'GrabPay', icon: 'car', balance: '₱850.00' },
    { id: 'coins', name: 'Coins.ph', icon: 'wallet', balance: '₱3,100.00' },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleAddPaymentMethod = () => {
    // Handle adding new payment method
    console.log('Add payment method');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Credit Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credit & Debit Cards</Text>
          {creditCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.cardItem,
                selectedMethod === card.id && styles.selectedCard
              ]}
              onPress={() => handleMethodSelect(card.id)}
            >
              <View style={styles.cardLeft}>
                <View style={styles.cardIcon}>
                  <Ionicons name="card" size={24} color="#0066CC" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardType}>{card.type}</Text>
                  <Text style={styles.cardNumber}>{card.last4}</Text>
                  <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                {card.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
                <Ionicons 
                  name={selectedMethod === card.id ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={selectedMethod === card.id ? "#0066CC" : "#CCCCCC"} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Third Party Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Wallets & E-Money</Text>
          {thirdPartyMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodItem,
                selectedMethod === method.id && styles.selectedMethod
              ]}
              onPress={() => handleMethodSelect(method.id)}
            >
              <View style={styles.methodLeft}>
                <View style={styles.methodIcon}>
                  <Ionicons name={method.icon as any} size={24} color="#0066CC" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodBalance}>Balance: {method.balance}</Text>
                </View>
              </View>
              <Ionicons 
                name={selectedMethod === method.id ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={selectedMethod === method.id ? "#0066CC" : "#CCCCCC"} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Payment Method Button */}
        <View style={styles.addSection}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod}>
            <Ionicons name="add-circle-outline" size={24} color="#0066CC" />
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
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
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    paddingHorizontal: 12,
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
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: '#999999',
  },
  cardRight: {
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  defaultText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedMethod: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    paddingHorizontal: 12,
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
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  methodBalance: {
    fontSize: 14,
    color: '#666666',
  },
  addSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0066CC',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
