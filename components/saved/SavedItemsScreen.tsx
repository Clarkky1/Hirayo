import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useSelectedItem } from '@/contexts/SelectedItemContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function SavedItemsScreen() {
  const { savedItems, removeSavedItem } = useSavedItems();
  const { setSelectedItem } = useSelectedItem();
  const [isNavigating, setIsNavigating] = useState(false);

  const hasSavedItems = savedItems.length > 0;

  const handleItemPress = async (item: any) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    setSelectedItem(item);
    
    try {
      await router.push('/item');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset after a short delay to allow navigation to complete
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
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
          <FlatList
            data={savedItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                             <TouchableOpacity 
                 style={[styles.savedItemCard, isNavigating && styles.disabledCard]}
                 onPress={() => handleItemPress(item)}
                 activeOpacity={isNavigating ? 1 : 0.7}
                 disabled={isNavigating}
               >
                                 <View style={styles.savedItemInfo}>
                   <Text style={styles.savedItemName}>{item.name}</Text>
                   <Text style={styles.savedItemLocation}>{item.location}</Text>
                   <Text style={styles.savedItemPrice}>₱{item.price}/day</Text>
                   {isNavigating && (
                     <View style={styles.loadingIndicator}>
                       <Text style={styles.loadingText}>Opening...</Text>
                     </View>
                   )}
                 </View>
                <TouchableOpacity 
                  style={styles.unsaveButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    removeSavedItem(item.id);
                  }}
                >
                  <Ionicons name="heart" size={20} color="#00A86B" />
                </TouchableOpacity>
              </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,

  },
  backButton: {
    padding: 4,
  },
  searchButton: {
    padding: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 0,
    marginTop: 0,
  },
  savedItemCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  disabledCard: {
    opacity: 0.6,
  },
  loadingIndicator: {
    marginTop: Spacing.xs,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 6,
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 0,
  },

  savedItemInfo: {
    flex: 1,
  },
  savedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 3,
  },
  savedItemLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  savedItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  unsaveButton: {
    padding: 6,
  },

});
