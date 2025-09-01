import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

interface Message {
  id: string;
  senderName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  avatarUrl?: string;
  itemName?: string;
}

const messages: Message[] = [
  {
    id: '1',
    senderName: 'John Smith',
    lastMessage: 'Hi! Is the camera still available for rent?',
    timestamp: '2m ago',
    unreadCount: 2,
    isOnline: true,
    itemName: 'Canon EOS 90D DSLR Camera',
  },
  {
    id: '2',
    senderName: 'Sarah Johnson',
    lastMessage: 'Thanks for the quick response!',
    timestamp: '1h ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'MacBook Pro 16" M2',
  },
  {
    id: '3',
    senderName: 'Mike Wilson',
    lastMessage: 'Can you deliver it to my location?',
    timestamp: '3h ago',
    unreadCount: 1,
    isOnline: true,
    itemName: 'iPhone 15 Pro Max',
  },
  {
    id: '4',
    senderName: 'Emma Davis',
    lastMessage: 'Perfect! I\'ll pick it up tomorrow.',
    timestamp: '1d ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'Sony A7 III Mirrorless',
  },
  {
    id: '5',
    senderName: 'David Brown',
    lastMessage: 'What time works best for you?',
    timestamp: '2d ago',
    unreadCount: 0,
    isOnline: true,
    itemName: 'iPad Pro 12.9" M2',
  },
  {
    id: '6',
    senderName: 'Lisa Chen',
    lastMessage: 'The item is in perfect condition!',
    timestamp: '3d ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'DJI Mavic Air 2',
  },
  {
    id: '7',
    senderName: 'Alex Rodriguez',
    lastMessage: 'Do you have any other cameras available?',
    timestamp: '1w ago',
    unreadCount: 0,
    isOnline: false,
    itemName: 'GoPro Hero 10',
  },
];

const MessageCard: React.FC<{ item: Message }> = ({ item }) => {
  const handleMessagePress = () => {
    router.push({
      pathname: '/view-messages',
      params: { 
        messageId: item.id,
        senderName: item.senderName,
        itemName: item.itemName || '',
        itemId: item.id || 'item1' // Include item ID for navigation
      }
    });
  };

  return (
    <TouchableOpacity style={styles.messageCard} onPress={handleMessagePress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.senderName.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName} numberOfLines={1}>
            {item.senderName}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        {item.itemName && (
          <Text style={styles.itemName} numberOfLines={1}>
            {item.itemName}
          </Text>
        )}
        
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const params = useLocalSearchParams();
  
  // Auto-open conversation if parameters are present (only once)
  useEffect(() => {
    if (!hasAutoOpened && params.openConversation === 'true' && params.itemId && params.ownerName) {
      setHasAutoOpened(true);
      
      // Check if conversation already exists
      const existingConversation = messages.find(msg => 
        msg.senderName === params.ownerName && 
        msg.itemName === params.itemName
      );
      
      if (existingConversation) {
        // Open existing conversation
        router.push({
          pathname: '/view-messages',
          params: { 
            messageId: existingConversation.id,
            senderName: existingConversation.senderName,
            itemName: existingConversation.itemName || '',
            itemId: existingConversation.id || 'item1'
          }
        });
      } else {
        // Create new conversation and open it
        const newConversationId = Date.now().toString();
        router.push({
          pathname: '/view-messages',
          params: { 
            messageId: newConversationId,
            senderName: params.ownerName as string,
            itemName: params.itemName as string,
            itemId: params.itemId as string || 'item1',
            isNewConversation: 'true'
          }
        });
      }
    }
  }, [params, hasAutoOpened]);



  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

    return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
         <View style={styles.backButton} />
         <View style={styles.searchButton} />
       </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={40} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>No messages found</Text>
            <Text style={styles.emptyStateSubtext}>
              Your conversations will appear here
            </Text>
          </View>
        }
      />

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
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
    alignItems: 'center',
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
  senderName: {
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
