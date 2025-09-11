import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { messagesService } from '@/services/messagesService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { MessageSkeleton } from '../common/SkeletonLoader';

interface Conversation {
  id: string;
  senderName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  avatarUrl?: string;
  itemName?: string;
  itemId?: string;
}

const MessageCard: React.FC<{ item: Conversation }> = ({ item }) => {
  const handleMessagePress = () => {
    router.push({
      pathname: '/view-messages',
      params: { 
        messageId: item.id,
        senderName: item.senderName,
        itemName: item.itemName || '',
        itemId: item.itemId || item.id // Include item ID for navigation
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
  const { user } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const params = useLocalSearchParams();

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

  // Auto-open conversation if parameters are present (only once)
  useEffect(() => {
    if (!hasAutoOpened && params.openConversation === 'true' && params.itemId && params.ownerName) {
      setHasAutoOpened(true);
      
      // Check if conversation already exists
      const existingConversation = conversations.find(msg => 
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
            itemId: existingConversation.itemId || existingConversation.id,
            isLenderView: 'false'
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
            isLenderView: 'false',
            isNewConversation: 'true'
          }
        });
      }
    }
  }, [params, hasAutoOpened, conversations]);



  const filteredMessages = searchQuery
    ? conversations.filter(msg => 
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

    return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
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
                Your conversations will appear here
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
