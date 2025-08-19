import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LenderMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const LenderMenu: React.FC<LenderMenuProps> = ({ visible, onClose }) => {
  const handleMenuAction = (action: string) => {
    onClose();
    switch (action) {
      case 'profile':
        router.push('/lenders');
        break;
      case 'myItems':
        router.push('/my-items');
        break;
      case 'earnings':
        router.push('/earnings');
        break;
      case 'analytics':
        router.push('/analytics');
        break;
                        case 'messages':
                    router.push('/lenders-messages');
                    break;
      default:
        break;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Lender Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Lender Profile */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuAction('profile')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name="person-circle" size={24} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Lender Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuAction('myItems')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name="list-outline" size={24} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>My Items</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuAction('earnings')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name="trending-up-outline" size={24} color={Colors.success} />
              </View>
              <Text style={styles.menuItemText}>Earnings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuAction('analytics')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name="analytics-outline" size={24} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Analytics</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuAction('messages')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Messages</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
     menuContainer: {
     width: 300,
     height: '100%',
     backgroundColor: Colors.background.primary,
     paddingTop: 60,
     paddingHorizontal: Spacing.lg,
     shadowColor: '#000',
     shadowOffset: {
       width: 2,
       height: 0,
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
   },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.secondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  menuItemText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
});
