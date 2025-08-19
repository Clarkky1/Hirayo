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

// Sample data for lender messages
const lenderMessages: LenderMessage[] = [
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
];

export default function LenderMessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(lenderMessages);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = lenderMessages.filter(message =>
        message.renterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(lenderMessages);
    }
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
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
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.messageCard}
              onPress={() => router.push('/view-messages')}
            >
              <Card variant="filled" padding="large">
                <View style={styles.messageContent}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.renterName.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.messageInfo}>
                    <Text style={styles.renterName}>{item.renterName}</Text>
                    <Text style={styles.itemName}>{item.itemName}</Text>
                    <Text style={styles.lastMessage}>{item.lastMessage}</Text>
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
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
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
  },
  messageCard: {
    marginBottom: Spacing.sm,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
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
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  timestamp: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
    marginBottom: 4,
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
});
