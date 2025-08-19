import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface LenderDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

// Profile data matching the profile page
const lenderProfile = {
  firstName: 'Kin Clark',
  surname: 'Perez',
  email: 'clarkperez906@gmail.com',
  memberSince: 'August 2024',
  totalItems: 8,
  totalEarnings: '₱15,000',
};

export const LenderDrawer: React.FC<LenderDrawerProps> = ({ isVisible, onClose }) => {
  const handleLenderProfilePress = () => {
    onClose();
    router.push('/lenders');
  };

  const handleQuickActionPress = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.drawerContainer}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => {}}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>

            {/* Lender Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileInitials}>
                    {lenderProfile.firstName.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.onlineIndicator} />
              </View>
              <Text style={styles.profileName}>{lenderProfile.firstName} {lenderProfile.surname}</Text>
              <Text style={styles.profileEmail}>{lenderProfile.email}</Text>
              <Text style={styles.profileMemberSince}>Member since {lenderProfile.memberSince}</Text>
            </View>

            {/* Quick Actions Section */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleLenderProfilePress}
              >
                <Ionicons name="person-outline" size={24} color={Colors.primary[500]} />
                <Text style={styles.actionText}>Lender Profile</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickActionPress('/post-item')}
              >
                <Ionicons name="add-circle-outline" size={24} color={Colors.primary[500]} />
                <Text style={styles.actionText}>Post New Item</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickActionPress('/my-items')}
              >
                <Ionicons name="cube-outline" size={24} color={Colors.primary[500]} />
                <Text style={styles.actionText}>My Items</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickActionPress('/earnings')}
              >
                <Ionicons name="trending-up-outline" size={24} color={Colors.primary[500]} />
                <Text style={styles.actionText}>Earnings</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickActionPress('/lender-messages')}
              >
                <Ionicons name="chatbubble-outline" size={24} color={Colors.primary[500]} />
                <Text style={styles.actionText}>Messages</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickActionPress('/lender-settings')}
              >
                <Ionicons name="settings-outline" size={24} color={Colors.primary[500]} />
                <Text style={styles.actionText}>Lender Settings</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{lenderProfile.totalItems}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{lenderProfile.totalEarnings}</Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawerContainer: {
    width: Dimensions.get('window').width * 0.8,
    height: '100%',
    backgroundColor: Colors.background.primary,
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    padding: Spacing.sm,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00A86B',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  profileName: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  profileMemberSince: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },
  quickActionsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  actionText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    flex: 1,
    marginLeft: Spacing.md,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: 'auto',
    marginBottom: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...TextStyles.heading.h3,
    color: Colors.primary[500],
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
  },
});
