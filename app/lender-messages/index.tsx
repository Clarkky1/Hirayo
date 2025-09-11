  import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { messagesService } from '@/services/messagesService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    LogBox,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { BorderRadius, Spacing } from '../../constants/DesignSystem';

LogBox.ignoreAllLogs(true);


interface RentalRequest {
  id: string;
  renterName: string;
  renterId: string;
  itemId: string;
  status: 'pending' | 'approved' | 'declined';
  message: string;
  timestamp: string;
  itemName: string;
  itemPrice: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  hasReplied: boolean;
  lastReplyTime?: string;
}

export default function LenderMessagesScreen() {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'overview'>('requests');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeRequests, setActiveRequests] = useState<RentalRequest[]>([]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await messagesService.getConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  }, [loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleApproveRequest = (requestId: string) => {
    const approvedRequest = activeRequests.find((req: RentalRequest) => req.id === requestId);
    
    Alert.alert(
      'Approve Request',
      'Are you sure you want to approve this rental request? This will automatically remove other renters\' requests for the same item. Are you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Approve',
          style: 'default',
          onPress: () => {
            setActiveRequests((prev: RentalRequest[]) =>
              prev.filter((req: RentalRequest) => {
                // Keep the approved request
                if (req.id === requestId) {
                  return true;
                }
                // Remove other requests for the same item (they're no longer relevant)
                if (req.itemId === approvedRequest?.itemId) {
                  return false;
                }
                // Keep requests for other items
                return true;
              }).map((req: RentalRequest) => 
                req.id === requestId 
                  ? { ...req, status: 'approved' as const }
                  : req
              )
            );
          },
        },
      ]
    );
  };

  const handleDeclineRequest = (requestId: string) => {
    Alert.alert(
      'Decline Request',
      'Are you sure you want to decline this rental request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setActiveRequests((prev: RentalRequest[]) =>
              prev.map((req: RentalRequest) =>
                req.id === requestId ? { ...req, status: 'declined' as const } : req
              )
            );
          },
        },
      ]
    );
  };

  const handleViewConversation = (requestId: string) => {
    const request = activeRequests.find((r: RentalRequest) => r.id === requestId);
    if (request) {
      router.push({
        pathname: '/view-messages',
        params: { 
          messageId: requestId,
          senderName: request.renterName || '',
          itemName: request.itemName || '',
          itemId: request.itemId || 'item1',
          isLenderView: 'true',
          requestStatus: request.status,
          hasReplied: request.hasReplied ? 'true' : 'false'
        }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'approved': return '#00A86B';
      case 'declined': return '#FF3B30';
      default: return '#999999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'declined': return 'Declined';
      default: return 'Unknown';
    }
  };

  const renderTabButton = (tab: 'requests' | 'overview', label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeTab === tab ? '#0066CC' : '#666666'}
      />
      <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderRequestCard = (request: RentalRequest) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.renterInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {request.renterName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.renterDetails}>
            <Text style={styles.renterName}>{request.renterName}</Text>
            <Text style={styles.timestamp}>{request.timestamp}</Text>
          </View>
        </View>

      </View>

      <Text style={styles.itemName}>{request.itemName}</Text>
      <Text style={styles.requestMessage}>{request.message}</Text>


              {request.hasReplied && (
          <View style={styles.replyIndicator}>
            <Ionicons name="checkmark-circle" size={16} color="#00A86B" />
            <Text style={styles.replyText}>Replied {request.lastReplyTime}</Text>
          </View>
        )}

        <TouchableOpacity
            style={styles.viewConversationButton}
            onPress={() => handleViewConversation(request.id)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#0066CC" />
            <Text style={styles.viewConversationText}>
              {request.status === 'approved' ? 'Proceed to Rental' : 'View Conversation'}
            </Text>
          </TouchableOpacity>
    </View>
  );

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonTabContainer}>
        {Array.from({ length: 2 }).map((_, index) => (
          <SkeletonLoader key={index} width="45%" height={40} borderRadius={8} />
        ))}
      </View>

      <View style={styles.skeletonContent}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.skeletonRequestCard}>
            <View style={styles.skeletonRequestHeader}>
              <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
              <View style={styles.skeletonRequestInfo}>
                <SkeletonLoader width="60%" height={16} style={{ marginBottom: 4 }} />
                <SkeletonLoader width="40%" height={12} />
              </View>
            </View>
            <SkeletonLoader width="90%" height={14} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="70%" height={12} style={{ marginBottom: 12 }} />
            <View style={styles.skeletonRequestActions}>
              <SkeletonLoader width="80%" height={32} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRequests = () => (
    <View style={styles.requestsContainer}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderRequestCard(item)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.requestsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#667EEA']}
            tintColor="#667EEA"
          />
        }
      />
    </View>
  );

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.overviewHeader}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.overviewSubtitle}>Quick summary of your rental activity</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {activeRequests.filter((r: RentalRequest) => r.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {activeRequests.filter((r: RentalRequest) => r.status === 'approved').length}
          </Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {activeRequests.filter((r: RentalRequest) => r.status === 'declined').length}
          </Text>
          <Text style={styles.statLabel}>Declined</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {activeRequests.filter(r => r.hasReplied).length}
          </Text>
          <Text style={styles.statLabel}>Replied</Text>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        {activeRequests.slice(0, 5).map((request) => (
          <View key={request.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons 
                name={request.status === 'approved' ? 'checkmark-circle' : 
                      request.status === 'declined' ? 'close-circle' : 'time'} 
                size={20} 
                color={getStatusColor(request.status)} 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                {request.renterName} requested to rent {request.itemName}
              </Text>
              <Text style={styles.activityTimestamp}>{request.timestamp}</Text>
              {request.hasReplied && (
                <Text style={styles.replyIndicatorText}>✓ Replied</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        renderSkeletonLoader()
      ) : (
        <>
          <View style={styles.tabContainer}>
            {renderTabButton('requests', 'Requests', 'list-outline')}
            {renderTabButton('overview', 'Overview', 'grid-outline')}
          </View>

          <View style={styles.content}>
            {activeTab === 'requests' && renderRequests()}
            {activeTab === 'overview' && renderOverview()}
          </View>
        </>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: Spacing.xs,
    color: '#666666',
  },
  activeTabLabel: {
    color: '#0066CC',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  conversationContainer: {
    flex: 1,
  },
  conversationHeader: {
    marginBottom: Spacing.md,
  },
  conversationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  conversationSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: 20,
  },
  lenderMessage: {
    backgroundColor: '#0066CC',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  renterMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 22,
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  requestsContainer: {
    flex: 1,
  },
  requestsHeader: {
    marginBottom: Spacing.md,
  },
  requestsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  requestsSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  requestsList: {
    paddingBottom: 20,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  renterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  renterDetails: {
    flex: 1,
  },
  renterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066CC',
    marginBottom: Spacing.xs,
  },
  requestMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  rentalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: '#F8F9FA',
    borderRadius: BorderRadius.md,
  },
  rentalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rentalText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  rentalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  approveButton: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },
  declineButton: {
    backgroundColor: '#ffffff',
    borderColor: '#FF3B30',
  },
  approveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 6,
  },
  declineButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 6,
  },
  viewConversationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  viewConversationText: {
    color: '#0066CC',
    fontWeight: '500',
    marginLeft: 6,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  replyText: {
    fontSize: 12,
    color: '#00A86B',
    marginLeft: Spacing.xs,
  },
  replyIndicatorText: {
    fontSize: 12,
    color: '#00A86B',
    marginTop: Spacing.xs,
  },
  approvalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#00A86B',
  },
  approvalText: {
    fontSize: 14,
    color: '#00A86B',
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  overviewContainer: {
    flex: 1,
  },
  overviewHeader: {
    marginBottom: Spacing.md,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  overviewSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  recentActivity: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  recentActivityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  activityIcon: {
    marginRight: Spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#999999',
  },
  // Skeleton loading styles
  skeletonContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skeletonTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: Spacing.md,
  },
  skeletonContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  skeletonRequestCard: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  skeletonRequestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  skeletonRequestInfo: {
    flex: 1,
  },
  skeletonRequestActions: {
    marginTop: Spacing.sm,
  },
});

