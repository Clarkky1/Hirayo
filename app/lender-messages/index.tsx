import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LenderMessagesScreen() {
  const [message, setMessage] = useState('');
  const [activeRequests, setActiveRequests] = useState([
    {
      id: '1',
      renterName: 'John Doe',
      itemName: 'Canon EOS 90D DSLR',
      timestamp: '2:30 PM',
      status: 'pending', // pending, approved, declined
      isFirstRequest: true
    },
    {
      id: '2',
      renterName: 'Jane Smith',
      itemName: 'Canon EOS 90D DSLR',
      timestamp: '2:45 PM',
      status: 'pending',
      isFirstRequest: false
    }
  ]);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! I\'m interested in renting your Canon EOS 90D DSLR Camera. Is it available for this weekend?',
      sender: 'renter',
      timestamp: '2:30 PM',
      isRentalRequest: true,
      requestId: '1'
    },
    {
      id: '2',
      text: 'Yes, it\'s available! What dates do you need it for?',
      sender: 'lender',
      timestamp: '2:32 PM',
      isRentalRequest: false,
      requestId: '1'
    },
    {
      id: '3',
      text: 'I need it from Friday to Sunday. What\'s the total price?',
      sender: 'renter',
      timestamp: '2:35 PM',
      isRentalRequest: false,
      requestId: '1'
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'lender',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRentalRequest: false,
        requestId: '1'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleRequestAction = (requestId: string, action: 'approve' | 'decline') => {
    setActiveRequests(prev => 
      prev.map(req => {
        if (req.id === requestId) {
          return { ...req, status: action };
        }
        // If approving one request, decline others for the same item
        if (req.itemName === activeRequests.find(r => r.id === requestId)?.itemName && req.id !== requestId) {
          return { ...req, status: 'declined' };
        }
        return req;
      })
    );

    if (action === 'approve') {
      // Add approval message
      const approvalMessage = {
        id: Date.now().toString(),
        text: `✅ Rental request approved for ${activeRequests.find(r => r.id === requestId)?.renterName}!`,
        sender: 'lender',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRentalRequest: false,
        requestId: requestId
      };
      setMessages([...messages, approvalMessage]);
    }
  };

  const grantRentalPermission = () => {
    const pendingRequest = activeRequests.find(req => req.status === 'pending');
    if (!pendingRequest) {
      Alert.alert('No Pending Requests', 'All rental requests have been processed.');
      return;
    }

    Alert.alert(
      'Grant Rental Permission',
      `Are you sure you want to approve ${pendingRequest.renterName}'s rental request? This will automatically decline other pending requests for the same item.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Grant Permission', 
          style: 'default',
          onPress: () => {
            handleRequestAction(pendingRequest.id, 'approve');
            
            Alert.alert(
              'Permission Granted',
              `${pendingRequest.renterName} has been notified and can now proceed with the rental process.`,
              [{ text: 'OK', style: 'default' }]
            );
          }
        }
      ]
    );
  };

  const renderRequestItem = (request: any) => (
    <View key={request.id} style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <Text style={styles.renterName}>{request.renterName}</Text>
        <Text style={styles.requestTime}>{request.timestamp}</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            request.status === 'approved' && styles.statusApproved,
            request.status === 'declined' && styles.statusDeclined,
            request.status === 'pending' && styles.statusPending
          ]}>
            <Text style={[
              styles.statusText,
              request.status === 'approved' && styles.statusTextApproved,
              request.status === 'declined' && styles.statusTextDeclined,
              request.status === 'pending' && styles.statusTextPending
            ]}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Text>
          </View>
          {request.isFirstRequest && request.status === 'pending' && (
            <View style={styles.firstRequestBadge}>
              <Text style={styles.firstRequestText}>1st</Text>
            </View>
          )}
        </View>
      </View>
      
      {request.status === 'pending' && (
        <View style={styles.requestActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveButton]} 
            onPress={() => handleRequestAction(request.id, 'approve')}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={16} color={Colors.success} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton]} 
            onPress={() => handleRequestAction(request.id, 'decline')}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderMessage = (msg: any) => (
    <View key={msg.id} style={[
      styles.messageContainer,
      msg.sender === 'renter' ? styles.renterMessage : styles.lenderMessage
    ]}>
      <View style={[
        styles.messageBubble,
        msg.sender === 'renter' ? styles.renterBubble : styles.lenderBubble,
        msg.isPermissionGranted && styles.permissionBubble
      ]}>
        <Text style={[
          styles.messageText,
          msg.sender === 'renter' ? styles.renterText : styles.lenderText,
          msg.isPermissionGranted && styles.permissionText
        ]}>
          {msg.text}
        </Text>
        <Text style={[
          styles.timestamp,
          msg.sender === 'renter' ? styles.renterTimestamp : styles.lenderTimestamp
        ]}>
          {msg.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Canon EOS 90D DSLR</Text>
            <Text style={styles.headerSubtitle}>Rental Requests ({activeRequests.length})</Text>
          </View>
          <TouchableOpacity 
            style={styles.grantPermissionButton} 
            onPress={grantRentalPermission}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          </TouchableOpacity>
        </View>

        {/* Active Requests Section */}
        <View style={styles.requestsSection}>
          <Text style={styles.requestsTitle}>Active Requests</Text>
          {activeRequests.map(renderRequestItem)}
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} activeOpacity={0.7}>
            <Ionicons name="send" size={20} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  headerSubtitle: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  grantPermissionButton: {
    padding: Spacing.xs,
  },
  requestsSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  requestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  requestInfo: {
    flex: 1,
  },
  renterName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  requestTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPending: {
    backgroundColor: Colors.warning[100],
    borderWidth: 1,
    borderColor: Colors.warning[500],
  },
  statusApproved: {
    backgroundColor: Colors.success[100],
    borderWidth: 1,
    borderColor: Colors.success[500],
  },
  statusDeclined: {
    backgroundColor: Colors.error[100],
    borderWidth: 1,
    borderColor: Colors.error[500],
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextPending: {
    color: Colors.warning[800],
  },
  statusTextApproved: {
    color: Colors.success[800],
  },
  statusTextDeclined: {
    color: Colors.error[800],
  },
  firstRequestBadge: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  firstRequestText: {
    fontSize: 12,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Spacing.xs,
  },
  approveButton: {
    marginRight: Spacing.xs,
  },
  declineButton: {
    marginLeft: Spacing.xs,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  messageContainer: {
    marginBottom: Spacing.md,
  },
  renterMessage: {
    alignItems: 'flex-start',
  },
  lenderMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  renterBubble: {
    backgroundColor: Colors.background.secondary,
  },
  lenderBubble: {
    backgroundColor: Colors.primary[500],
  },
  permissionBubble: {
    backgroundColor: Colors.success,
  },
  messageText: {
    ...TextStyles.body.medium,
    marginBottom: Spacing.xs,
  },
  renterText: {
    color: Colors.text.primary,
  },
  lenderText: {
    color: Colors.text.inverse,
  },
  permissionText: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  timestamp: {
    ...TextStyles.caption,
    alignSelf: 'flex-end',
  },
  renterTimestamp: {
    color: Colors.text.secondary,
  },
  lenderTimestamp: {
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    maxHeight: 100,
    ...TextStyles.body.medium,
  },
  sendButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
