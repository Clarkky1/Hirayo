import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../ui/Card';

interface LendersMessage {
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

const lendersMessages: LendersMessage[] = [
  {
    id: '1',
    renterName: 'John Smith',
    lastMessage: 'Hi! Is the camera still available for rent this weekend?',
    timestamp: '2m ago',
    unreadCount: 2,
    isOnline: true,
    itemName: 'Canon EOS 90D DSLR Camera',
    itemPrice: 1200,
    rentalRequest: {
      startDate: 'Aug 24, 2025',
      endDate: 'Aug 26, 2025',
      totalDays: 3,
      totalAmount: 3600,
      status: 'pending',
    },
  },
  {
    id: '2',
    renterName: 'Sarah Johnson',
    lastMessage: 'Thanks for accepting my rental request! What time can I pick it up?',
    timestamp: '1h ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'MacBook Pro 16" M2',
    itemPrice: 800,
    rentalRequest: {
      startDate: 'Aug 20, 2025',
      endDate: 'Aug 22, 2025',
      totalDays: 3,
      totalAmount: 2400,
      status: 'accepted',
    },
  },
  {
    id: '3',
    renterName: 'Mike Wilson',
    lastMessage: 'Can you deliver it to my location? I\'ll pay extra for delivery.',
    timestamp: '3h ago',
    unreadCount: 1,
    isOnline: true,
    itemName: 'iPhone 15 Pro Max',
    itemPrice: 600,
    rentalRequest: {
      startDate: 'Aug 25, 2025',
      endDate: 'Aug 27, 2025',
      totalDays: 3,
      totalAmount: 1800,
      status: 'pending',
    },
  },
  {
    id: '4',
    renterName: 'Emma Davis',
    lastMessage: 'Perfect! I\'ll pick it up tomorrow at 2 PM.',
    timestamp: '1d ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'Sony A7 III Mirrorless',
    itemPrice: 1000,
    rentalRequest: {
      startDate: 'Aug 18, 2025',
      endDate: 'Aug 20, 2025',
      totalDays: 3,
      totalAmount: 3000,
      status: 'accepted',
    },
  },
  {
    id: '5',
    renterName: 'David Brown',
    lastMessage: 'What time works best for you for pickup?',
    timestamp: '2d ago',
    unreadCount: 0,
    isOnline: true,
    itemName: 'iPad Pro 12.9" M2',
    itemPrice: 500,
    rentalRequest: {
      startDate: 'Aug 28, 2025',
      endDate: 'Aug 30, 2025',
      totalDays: 3,
      totalAmount: 1500,
      status: 'pending',
    },
  },
  {
    id: '6',
    renterName: 'Lisa Chen',
    lastMessage: 'The item is in perfect condition! Thank you so much.',
    timestamp: '3d ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'DJI Mavic Air 2',
    itemPrice: 800,
    rentalRequest: {
      startDate: 'Aug 15, 2025',
      endDate: 'Aug 17, 2025',
      totalDays: 3,
      totalAmount: 2400,
      status: 'accepted',
    },
  },
  {
    id: '7',
    renterName: 'Alex Rodriguez',
    lastMessage: 'Do you have any other cameras available for next week?',
    timestamp: '1w ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'GoPro Hero 10',
    itemPrice: 400,
    rentalRequest: {
      startDate: 'Aug 10, 2025',
      endDate: 'Aug 12, 2025',
      totalDays: 3,
      totalAmount: 1200,
      status: 'accepted',
    },
  },
];

const LendersMessageCard: React.FC<{ item: LendersMessage }> = ({ item }) => {
  const handleMessagePress = () => {
    router.push({
      pathname: '/view-messages',
      params: { 
        messageId: item.id,
        senderName: item.renterName,
        itemName: item.itemName,
        isLenderView: 'true',
        itemPrice: item.itemPrice.toString(),
        rentalRequest: JSON.stringify(item.rentalRequest),
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'accepted':
        return Colors.success;
      case 'declined':
        return Colors.error;
      default:
        return Colors.neutral[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'time';
      case 'accepted':
        return 'checkmark-circle';
      case 'declined':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <TouchableOpacity style={styles.messageCard} onPress={handleMessagePress}>
      <Card variant="filled" padding="large" style={styles.cardContainer}>
        <View style={styles.messageContent}>
          <View style={styles.messageLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.renterName.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={[styles.onlineIndicator, { backgroundColor: item.isOnline ? Colors.success : Colors.neutral[400] }]} />
            </View>
            
            <View style={styles.messageInfo}>
              <Text style={styles.renterName}>{item.renterName}</Text>
              <Text style={styles.itemName} numberOfLines={1}>{item.itemName}</Text>
              <Text style={styles.lastMessage} numberOfLines={2}>{item.lastMessage}</Text>
              
              {/* Rental Request Status */}
              {item.rentalRequest && (
                <View style={styles.rentalRequestContainer}>
                  <View style={styles.rentalRequestInfo}>
                    <Text style={styles.rentalDates}>
                      {item.rentalRequest.startDate} - {item.rentalRequest.endDate}
                    </Text>
                    <Text style={styles.rentalAmount}>
                      ₱{item.rentalRequest.totalAmount} ({item.rentalRequest.totalDays} days)
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <Ionicons 
                      name={getStatusIcon(item.rentalRequest.status) as any} 
                      size={14} 
                      color={getStatusColor(item.rentalRequest.status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(item.rentalRequest.status) }]}>
                      {item.rentalRequest.status.charAt(0).toUpperCase() + item.rentalRequest.status.slice(1)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.messageRight}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default function LendersMessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(lendersMessages);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  useEffect(() => {
    let filtered = lendersMessages;
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(message =>
        message.renterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(message => 
        message.rentalRequest?.status === selectedFilter
      );
    }
    
    setFilteredMessages(filtered);
  }, [searchQuery, selectedFilter]);

  const getFilterCounts = () => {
    return {
      all: lendersMessages.length,
      pending: lendersMessages.filter(m => m.rentalRequest?.status === 'pending').length,
      accepted: lendersMessages.filter(m => m.rentalRequest?.status === 'accepted').length,
      declined: lendersMessages.filter(m => m.rentalRequest?.status === 'declined').length,
    };
  };

  const counts = getFilterCounts();

  const renderFilterButton = (filter: 'all' | 'pending' | 'accepted' | 'declined', label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
      <View style={[
        styles.filterCount,
        selectedFilter === filter && styles.filterCountActive
      ]}>
        <Text style={[
          styles.filterCountText,
          selectedFilter === filter && styles.filterCountTextActive
        ]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const hasMessages = filteredMessages.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <View style={styles.filterTabs}>
          {renderFilterButton('all', 'All', counts.all)}
          {renderFilterButton('pending', 'Pending', counts.pending)}
          {renderFilterButton('accepted', 'Accepted', counts.accepted)}
          {renderFilterButton('declined', 'Declined', counts.declined)}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search renters, items, or messages..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        {!hasMessages ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.neutral[400]} />
            <Text style={styles.emptyStateTitle}>
              {searchQuery || selectedFilter !== 'all' ? 'No messages found' : 'No messages yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Messages from renters will appear here when they contact you about your items'
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <LendersMessageCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: 3,
    gap: 3,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  filterButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  filterCount: {
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    marginLeft: Spacing.xs,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: Colors.text.inverse,
  },
  filterCountText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '600',
    fontSize: 11,
  },
  filterCountTextActive: {
    color: Colors.primary[500],
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
  },
  messagesList: {
    gap: Spacing.xs,
  },
  messageCard: {
    marginBottom: 2,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.xs,
    justifyContent: 'space-between',
  },
  messageLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.background.primary,
  },
  messageInfo: {
    flex: 1,
  },
  renterName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemName: {
    ...TextStyles.body.small,
    color: Colors.primary[500],
    fontWeight: '500',
    marginBottom: 2,
  },
  lastMessage: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    lineHeight: 16,
    marginBottom: 2,
  },
  rentalRequestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  rentalRequestInfo: {
    flex: 1,
  },
  rentalDates: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontSize: 11,
  },
  rentalAmount: {
    ...TextStyles.body.small,
    color: Colors.primary[500],
    fontWeight: '600',
    fontSize: 11,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statusText: {
    ...TextStyles.body.small,
    fontWeight: '500',
    fontSize: 10,
  },
  messageRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  timestamp: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },
  unreadBadge: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  unreadCount: {
    ...TextStyles.caption,
    color: Colors.text.inverse,
    fontWeight: '600',
    fontSize: 11,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
});
