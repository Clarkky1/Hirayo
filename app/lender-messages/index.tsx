import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { BorderRadius, Colors, Spacing } from '../../constants/DesignSystem';

interface RentalRequest {
  id: string;
  renterName: string;
  renterId: string;
  itemId: string;
  status: 'pending' | 'approved' | 'declined';
  message: string;
  timestamp: string;
  isFirstRequest: boolean;
  itemName: string;
  itemPrice: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'lender' | 'renter';
  timestamp: string;
  requestId?: string;
}

export default function LenderMessagesScreen() {
  const [activeTab, setActiveTab] = useState<'conversation' | 'requests' | 'overview'>('conversation');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequests, setActiveRequests] = useState<RentalRequest[]>([
    {
      id: '1',
      renterName: 'John Doe',
      renterId: 'renter1',
      itemId: 'item1',
      status: 'pending',
      message: 'Hi! I would like to rent your camera for this weekend.',
      timestamp: '2 min ago',
      isFirstRequest: true,
      itemName: 'Canon EOS 90D DSLR Camera',
      itemPrice: 1200,
      startDate: 'Aug 24, 2025',
      endDate: 'Aug 26, 2025',
      totalDays: 3,
      totalAmount: 3600,
    },
    {
      id: '2',
      renterName: 'Jane Smith',
      renterId: 'renter2',
      itemId: 'item1',
      status: 'pending',
      message: 'Is this camera still available? I need it for a wedding.',
      timestamp: '5 min ago',
      isFirstRequest: false,
      itemName: 'Canon EOS 90D DSLR Camera',
      itemPrice: 1200,
      startDate: 'Aug 25, 2025',
      endDate: 'Aug 27, 2025',
      totalDays: 3,
      totalAmount: 3600,
    },
    {
      id: '3',
      renterName: 'Mike Johnson',
      renterId: 'renter3',
      itemId: 'item1',
      status: 'pending',
      message: 'Can I rent this for next week?',
      timestamp: '10 min ago',
      isFirstRequest: false,
      itemName: 'Canon EOS 90D DSLR Camera',
      itemPrice: 1200,
      startDate: 'Aug 28, 2025',
      endDate: 'Aug 30, 2025',
      totalDays: 3,
      totalAmount: 3600,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I would like to rent your camera for this weekend.',
      sender: 'renter',
      timestamp: '2 min ago',
      requestId: '1',
    },
    {
      id: '2',
      text: 'Sure! When exactly do you need it?',
      sender: 'lender',
      timestamp: '1 min ago',
    },
    {
      id: '3',
      text: 'This Saturday and Sunday, from morning to evening.',
      sender: 'renter',
      timestamp: 'Just now',
      requestId: '1',
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'lender',
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleApproveRequest = (requestId: string) => {
    Alert.alert(
      'Approve Request',
      'Are you sure you want to approve this rental request? This will automatically decline other pending requests for the same time period.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
            setActiveRequests(prev =>
              prev.map(req => {
                if (req.id === requestId) {
                  return { ...req, status: 'approved' as const };
                }
                // Auto-decline other requests for the same time period
                if (req.status === 'pending' && req.id !== requestId) {
                  return { ...req, status: 'declined' as const };
                }
                return req;
              })
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
            setActiveRequests(prev =>
              prev.map(req =>
                req.id === requestId ? { ...req, status: 'declined' as const } : req
              )
            );
          },
        },
      ]
    );
  };

  const handleViewConversation = (requestId: string) => {
    const request = activeRequests.find(r => r.id === requestId);
    if (request) {
      router.push({
        pathname: '/view-messages',
        params: { 
          messageId: requestId,
          senderName: request.renterName || '',
          itemName: request.itemName || '',
          itemId: request.itemId || 'item1', // Include item ID for navigation
          isLenderView: 'true'
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

  const renderTabButton = (tab: 'conversation' | 'requests' | 'overview', label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeTab === tab ? Colors.primary[500] : Colors.text.secondary}
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
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(request.status) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(request.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.itemName}>{request.itemName}</Text>
      <Text style={styles.requestMessage}>{request.message}</Text>

      <View style={styles.rentalDetails}>
        <View style={styles.rentalInfo}>
          <Ionicons name="calendar-outline" size={16} color="#666666" />
          <Text style={styles.rentalText}>
            {request.startDate} - {request.endDate} ({request.totalDays} days)
          </Text>
        </View>
        <Text style={styles.rentalAmount}>₱{request.totalAmount.toLocaleString()}</Text>
      </View>

      {request.status === 'pending' && (
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApproveRequest(request.id)}
          >
            <Ionicons name="checkmark" size={18} color="#ffffff" />
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDeclineRequest(request.id)}
          >
            <Ionicons name="close" size={18} color="#FF3B30" />
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.viewConversationButton}
        onPress={() => handleViewConversation(request.id)}
      >
        <Ionicons name="chatbubble-outline" size={16} color="#0066CC" />
        <Text style={styles.viewConversationText}>View Conversation</Text>
      </TouchableOpacity>
    </View>
  );

  const renderConversation = () => (
    <View style={styles.conversationContainer}>
      <View style={styles.conversationHeader}>
        <Text style={styles.conversationTitle}>Recent Conversations</Text>
        <Text style={styles.conversationSubtitle}>Chat with renters about your items</Text>
      </View>

      <View style={styles.messagesContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'lender' ? styles.lenderMessage : styles.renterMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRequests = () => (
    <View style={styles.requestsContainer}>
      <View style={styles.requestsHeader}>
        <Text style={styles.requestsTitle}>Rental Requests</Text>
        <Text style={styles.requestsSubtitle}>Manage incoming rental requests</Text>
      </View>

      <FlatList
        data={activeRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderRequestCard(item)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.requestsList}
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
            {activeRequests.filter(r => r.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending Requests</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {activeRequests.filter(r => r.status === 'approved').length}
          </Text>
          <Text style={styles.statLabel}>Approved Rentals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {activeRequests.filter(r => r.status === 'declined').length}
          </Text>
          <Text style={styles.statLabel}>Declined Requests</Text>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        {activeRequests.slice(0, 3).map((request) => (
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
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.tabContainer}>
       
        {renderTabButton('requests', 'Requests', 'list-outline')}
        {renderTabButton('overview', 'Overview', 'grid-outline')}
      </View>

      <View style={styles.content}>
        
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'overview' && renderOverview()}
      </View>
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
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
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
    marginBottom: Spacing.sm,
  },
  requestMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  rentalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  viewConversationText: {
    color: '#0066CC',
    fontWeight: '500',
    marginLeft: 6,
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
});

