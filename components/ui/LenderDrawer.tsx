import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface LenderDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface LenderStats {
  totalItems: number;
  totalEarnings: number;
}

export const LenderDrawer: React.FC<LenderDrawerProps> = ({ isVisible, onClose }) => {
  const { user } = useSupabaseAuth();
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState<LenderStats>({ totalItems: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch user profile and stats when drawer opens
  useEffect(() => {
    if (isVisible && user) {
      fetchUserData();
    }
  }, [isVisible, user]);

  // Animation effect
  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profileData);

      // Fetch lender stats
      const [itemsResult, earningsResult] = await Promise.all([
        // Count total items
        supabase
          .from('items')
          .select('id', { count: 'exact' })
          .eq('lender_id', user.id),
        
        // Calculate total earnings from completed transactions
        supabase
          .from('transactions')
          .select('amount')
          .eq('lender_id', user.id)
          .eq('status', 'completed')
      ]);

      if (itemsResult.error) throw itemsResult.error;
      if (earningsResult.error) throw earningsResult.error;

      const totalEarnings = earningsResult.data?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

      setStats({
        totalItems: itemsResult.count || 0,
        totalEarnings: totalEarnings,
      });

    } catch (error) {
      console.error('Error fetching drawer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLenderProfilePress = () => {
    onClose();
    router.push('/lenders' as any);
  };

  const handleQuickActionPress = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const formatMemberSince = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const formatEarnings = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  if (!isVisible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
      />
      <Animated.View 
        style={[
          styles.drawerContainer,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => {}}
        >
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>

          {/* Lender Profile Section */}
          <View style={styles.profileSection}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : userProfile ? (
              <>
                <View style={styles.avatarContainer}>
                  <View style={styles.profileAvatar}>
                    <Text style={styles.profileInitials}>
                      {userProfile.first_name?.charAt(0) || 'U'}{userProfile.last_name?.charAt(0) || 'S'}
                    </Text>
                  </View>
                  <View style={styles.onlineIndicator} />
                </View>
                <Text style={styles.profileName}>
                  {userProfile.first_name || 'User'} {userProfile.last_name || 'Name'}
                </Text>
                <Text style={styles.profileEmail}>{userProfile.email || 'No email'}</Text>
                <Text style={styles.profileMemberSince}>
                  Member since {formatMemberSince(userProfile.created_at)}
                </Text>
              </>
            ) : (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
                <Text style={styles.errorText}>Failed to load profile</Text>
              </View>
            )}
          </View>

          {/* Quick Actions Section */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleLenderProfilePress}
              activeOpacity={0.7}
            >
              <Ionicons name="person-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Lender Profile</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleQuickActionPress('/post-item')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Post New Item</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleQuickActionPress('/my-items')}
              activeOpacity={0.7}
            >
              <Ionicons name="cube-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>My Items</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleQuickActionPress('/earnings')}
              activeOpacity={0.7}
            >
              <Ionicons name="trending-up-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Earnings</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleQuickActionPress('/lender-messages')}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Messages</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleQuickActionPress('/lender-settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Lender Settings</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatEarnings(stats.totalEarnings)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: Dimensions.get('window').width * 0.8,
    height: '100%',
    backgroundColor: Colors.background.primary,
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  errorText: {
    ...TextStyles.body.medium,
    color: Colors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
