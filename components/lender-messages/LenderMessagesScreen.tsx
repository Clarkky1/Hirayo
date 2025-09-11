import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { messagesService } from '@/services/messagesService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { MessageSkeleton } from '../common/SkeletonLoader';

interface LenderMessage {
  id: string;
  renterName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  avatarUrl?: string;
  itemName: string;
  itemPrice: number;
  itemImage?: string;
  rentalRequest?: {
    startDate: string;
    endDate: string;
    totalDays: number;
    totalAmount: number;
    status: 'pending' | 'accepted' | 'declined';
  };
}

// Rental request interface
interface RentalRequest {
  id: string;
  itemId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'declined';
}

const MessageCard: React.FC<{ item: LenderMessage }> = ({ item }) => {
  const handleMessagePress = () => {
    router.push({
      pathname: '/view-messages',
      params: { 
        messageId: item.id,
        senderName: item.renterName,
        itemName: item.itemName,
        itemId: item.id || 'item1', // Include item ID for navigation
        isLenderView: 'true'
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'accepted': return '#00A86B';
      case 'declined': return '#FF3B30';
      default: return '#999999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Approved';
      case 'declined': return 'Declined';
      default: return 'Unknown';
    }
  };

  return (
    <TouchableOpacity style={styles.messageCard} onPress={handleMessagePress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.renterName.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.renterName} numberOfLines={1}>
            {item.renterName}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        <Text style={styles.itemName} numberOfLines={1}>
          {item.itemName}
        </Text>
        
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>

        {/* Rental Request Status */}
        {item.rentalRequest && (
          <View style={styles.rentalRequestInfo}>
            <View style={styles.rentalDates}>
              <Ionicons name="calendar-outline" size={14} color="#666666" />
              <Text style={styles.rentalDateText}>
                {item.rentalRequest.startDate} - {item.rentalRequest.endDate}
              </Text>
            </View>
            <View style={styles.rentalDetails}>
              <Text style={styles.rentalAmount}>
                ₱{item.rentalRequest.totalAmount.toLocaleString()}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.rentalRequest.status) }
              ]}>
                <Text style={styles.statusText}>
                  {getStatusText(item.rentalRequest.status)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function LenderMessagesScreen() {
  const { user } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<LenderMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRequests, setActiveRequests] = useState<RentalRequest[]>([]);

  // Load conversations from Supabase
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const conversations = await messagesService.getConversations(user.id);
      
      // Convert conversations to LenderMessage format
      const convertedConversations: LenderMessage[] = (conversations || []).map((conv: any) => ({
        id: conv.id,
        renterName: conv.senderName || 'Unknown Renter',
        lastMessage: conv.lastMessage || 'No messages yet',
        timestamp: conv.timestamp || 'Just now',
        unreadCount: conv.unreadCount || 0,
        isOnline: conv.isOnline || false,
        itemName: conv.itemName || 'Unknown Item',
        itemPrice: conv.itemPrice || 0,
        rentalRequest: conv.rentalRequest || undefined,
      }));
      
      setConversations(convertedConversations);
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

  const filteredMessages = searchQuery.trim() !== '' 
    ? conversations.filter(message =>
        message.renterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
    

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search renters, items, or messages..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Messages List */}
      {loading ? (
        <View style={styles.listContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <MessageSkeleton key={index} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#667EEA']}
              tintColor="#667EEA"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={40} color="#E0E0E0" />
              <Text style={styles.emptyStateText}>No messages found</Text>
              <Text style={styles.emptyStateSubtext}>
                Rental requests and conversations will appear here
              </Text>
            </View>
          }
        />
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
    paddingBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  searchButton: {
    padding: 4,
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 0,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 80,
  },
  messageCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00A86B',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  renterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 6,
  },
  itemName: {
    fontSize: 14,
    color: '#0066CC',
    marginBottom: 3,
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  rentalRequestInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: BorderRadius.md,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0066CC',
  },
  rentalDates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rentalDateText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  rentalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rentalAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  unreadBadge: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
});
