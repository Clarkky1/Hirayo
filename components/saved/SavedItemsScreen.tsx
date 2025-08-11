import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface SavedItem {
  id: string;
  name: string;
  price: number;
  location: string;
}

export default function SavedItemsScreen() {
  // Mock data - replace with actual saved items data
  const [savedItems] = useState<SavedItem[]>([
    // Uncomment to test with saved items
    // { id: '1', name: 'Canon EOS R5', price: 45, location: 'Cebu City' },
    // { id: '2', name: 'MacBook Pro M2', price: 35, location: 'Mandaue City' },
  ]);

  const hasSavedItems = savedItems.length > 0;

  return (
    <SafeAreaView style={styles.container}>
             {/* Header */}
       <View style={styles.header}>
         <View style={styles.backButton} />
         <View style={styles.searchButton} />
       </View>

      {/* Conditional Rendering based on saved items */}
      {!hasSavedItems ? (
        /* Empty State - No Saved Items */
        <View style={styles.emptyStateContainer}>
          <Ionicons name="heart-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyStateTitle}>No Saved Items</Text>
          <Text style={styles.emptyStateSubtitle}>
            Items you save will appear here
          </Text>
        </View>
      ) : (
        /* Saved Items List */
        <View style={styles.savedItemsContainer}>
          <Text style={styles.savedItemsTitle}>Saved Items</Text>
          <FlatList
            data={savedItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.savedItemCard}>
                <View style={styles.savedItemInfo}>
                  <Text style={styles.savedItemName}>{item.name}</Text>
                  <Text style={styles.savedItemLocation}>{item.location}</Text>
                  <Text style={styles.savedItemPrice}>₱{item.price}/day</Text>
                </View>
                <TouchableOpacity style={styles.unsaveButton}>
                  <Ionicons name="heart" size={20} color="#00A86B" />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  searchButton: {
    padding: 5,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 0,
    marginTop: 0,
  },
  savedItemCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 22,
  },
  savedItemsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  savedItemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  savedItemInfo: {
    flex: 1,
  },
  savedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  savedItemLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  savedItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  unsaveButton: {
    padding: 8,
  },

});
