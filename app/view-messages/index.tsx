import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
}

const chatMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hi! Is the camera still available for rent?',
    timestamp: '10:30 AM',
    isFromMe: false,
  },
  {
    id: '2',
    text: 'Yes, it\'s still available! When do you need it?',
    timestamp: '10:32 AM',
    isFromMe: true,
  },
  {
    id: '3',
    text: 'I need it for this weekend. Can I rent it for 3 days?',
    timestamp: '10:35 AM',
    isFromMe: false,
  },
  {
    id: '4',
    text: 'Perfect! That works for me. What time works best for pickup?',
    timestamp: '10:37 AM',
    isFromMe: true,
  },
];

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <View style={[
      styles.messageContainer,
      message.isFromMe ? styles.myMessageContainer : styles.theirMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        message.isFromMe ? styles.myMessageBubble : styles.theirMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isFromMe ? styles.myMessageText : styles.theirMessageText
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timestamp,
          message.isFromMe ? styles.myTimestamp : styles.theirTimestamp
        ]}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
};

const RentalRequestActions: React.FC<{ 
  isLenderView: boolean;
  requestStatus?: string;
  hasReplied?: string;
  messageId?: string;
}> = ({ isLenderView, requestStatus: propRequestStatus, hasReplied, messageId }) => {
  console.log('RentalRequestActions props:', { isLenderView, propRequestStatus, hasReplied, messageId });
  
  const [requestStatus, setRequestStatus] = useState<'pending' | 'accepted' | 'declined'>(
    propRequestStatus === 'approved' ? 'accepted' : 
    propRequestStatus === 'declined' ? 'declined' : 'pending'
  );

  // For lender view - show approve/decline actions
  if (isLenderView) {
    const handleAccept = () => {
      Alert.alert(
        'Approve Request',
        'Are you sure you want to approve this rental request? This will automatically remove other renters\' requests for the same item. Are you sure you want to proceed?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Approve',
            style: 'default',
            onPress: () => {
              setRequestStatus('accepted');
              console.log('Rental request accepted for messageId:', messageId);
              // Here you would typically update the backend/database
              // For now, we're just updating the local state
            },
          },
        ]
      );
    };

    const handleDecline = () => {
      setRequestStatus('declined');
      console.log('Rental request declined');
    };

    // If request is already approved or declined, show status instead of buttons
    if (requestStatus === 'accepted') {
      return (
        <View style={styles.rentalActions}>
          <View style={styles.statusDisplay}>
            <Ionicons name="checkmark-circle" size={20} color="#00A86B" />
            <Text style={styles.statusText}>Request Approved</Text>
          </View>
        </View>
      );
    }

    if (requestStatus === 'declined') {
      return (
        <View style={styles.rentalActions}>
          <View style={styles.statusDisplay}>
            <Ionicons name="close-circle" size={20} color="#FF3B30" />
            <Text style={styles.statusText}>Request Declined</Text>
          </View>
        </View>
      );
    }

    // Show buttons only for pending requests
    return (
      <View style={styles.rentalActions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]} 
            onPress={handleAccept}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton]} 
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // For renter view - show status and next steps
  if (requestStatus === 'accepted') {
    return (
      <View style={styles.renterApprovalStatus}>
        <View style={styles.approvalHeader}>
          <Ionicons name="checkmark-circle" size={24} color="#00A86B" />
          <Text style={styles.approvalTitle}>Request Approved!</Text>
        </View>
        <Text style={styles.approvalMessage}>
          Your rental request has been approved. You can now proceed with the rental process.
        </Text>
        <TouchableOpacity 
          style={styles.proceedToRentalButton}
          onPress={() => {
            console.log('Proceeding to rental process');
            // Navigate to rental period selection or payment
          }}
        >
          <Text style={styles.proceedToRentalText}>Proceed to Rental</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (requestStatus === 'declined') {
    return (
      <View style={styles.renterDeclinedStatus}>
        <View style={styles.declinedHeader}>
          <Ionicons name="close-circle" size={24} color="#FF3B30" />
          <Text style={styles.declinedTitle}>Request Declined</Text>
        </View>
        <Text style={styles.declinedMessage}>
          Unfortunately, your rental request has been declined.
        </Text>
      </View>
    );
  }

  // Default pending status for renter
  return (
    <View style={styles.renterPendingStatus}>
      <View style={styles.pendingHeader}>
        <Ionicons name="time" size={24} color="#FF9500" />
        <Text style={styles.pendingTitle}>Request Pending</Text>
      </View>
      <Text style={styles.pendingMessage}>
        Your rental request is currently being reviewed by the lender.
      </Text>
    </View>
  );
};

export default function ViewMessagesScreen() {
  const [messageText, setMessageText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [localMessages, setLocalMessages] = useState(chatMessages);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const isLenderView = params.isLenderView === 'true';
  const senderName = params.senderName as string || 'Conversation';
  const itemName = params.itemName as string || 'Canon EOS 90D DSLR Camera';
  const itemId = params.itemId as string || 'item1';
  const requestStatus = params.requestStatus as string;
  const hasReplied = params.hasReplied as string;

  // Update the header title dynamically with icon
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: senderName,
      headerRight: isLenderView ? () => (
        <TouchableOpacity 
          style={styles.headerIconButton}
          onPress={() => handleHeaderIconPress()}
        >
          <Ionicons 
            name="cube-outline" 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      ) : undefined,
    });
  }, [navigation, senderName, itemId, isLenderView]);

  // Debug: Log the parameters to see what's being received
  console.log('ViewMessagesScreen params:', {
    senderName,
    itemName,
    itemId,
    isLenderView,
    requestStatus,
    hasReplied
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Platform-specific timing for better positioning
      const delay = Platform.OS === 'ios' ? 150 : 200;
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, delay);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      // Platform-specific pre-emptive scrolling
      const delay = Platform.OS === 'ios' ? 100 : 150;
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, delay);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      keyboardWillShowListener?.remove();
    };
  }, []);

  const handleBack = () => {
    if (itemId) {
      router.push({
        pathname: '/item',
        params: { 
          itemId: itemId,
          fromMessages: 'true'
        }
      });
    } else {
      router.back();
    }
  };

  const handleItemPress = () => {
    handleBack();
  };

  const handleHeaderIconPress = () => {
    if (isLenderView) {
      // For lenders: Navigate to my-items and highlight the specific item
      router.push({
        pathname: '/my-items',
        params: { 
          highlightItemId: itemId,
          fromMessages: 'true'
        }
      });
    } else {
      // For renters: Navigate to the item details
      router.push({
        pathname: '/item',
        params: { 
          itemId: itemId,
          fromMessages: 'true'
        }
      });
    }
  };

  const handleSend = () => {
    if (messageText.trim()) {
      // Create new message
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: messageText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFromMe: true,
      };
      
      // Add to local messages
      setLocalMessages(prev => [...prev, newMessage]);
      
      // Clear input
      setMessageText('');
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      console.log('Message sent (local):', newMessage.text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Simple Item Info */}
      <TouchableOpacity style={styles.itemInfo} onPress={handleItemPress}>
      
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text style={styles.itemPrice}>₱2,500/day</Text>
          
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Rental Request Actions (Renter View) */}
      <RentalRequestActions 
        isLenderView={isLenderView}
        requestStatus={requestStatus}
        hasReplied={hasReplied}
        messageId={params.messageId as string}
      />

      {/* Messages List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {localMessages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </ScrollView>

      {/* Simple Message Input */}
      <View style={[
        styles.inputContainer,
        { 
          marginBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 0
        }
      ]}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          returnKeyType="send"
          blurOnSubmit={false}
          onFocus={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
          ]}
          onPress={handleSend}
          disabled={!messageText.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={messageText.trim() ? "#fff" : "#999"} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerIconButton: {
    padding: 8,
    marginRight: 8,
  },
  // Lender action styles
  rentalActions: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#00A86B',
  },
  declineButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  declineButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  statusDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#E3F2FD',
    marginTop: 5,
    marginLeft: 13,
    marginRight: 13,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    color: '#666',
  },  
  demoIndicator: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },

  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 40,
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: '#0066CC',
  },
  theirMessageBubble: {
    backgroundColor: '#f1f1f1',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    minHeight: 60,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#0066CC',
  },
  sendButtonInactive: {
    backgroundColor: '#ddd',
  },
  // Renter status styles
  renterApprovalStatus: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00A86B',
  },
  approvalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  approvalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A86B',
    marginLeft: 8,
  },
  approvalMessage: {
    fontSize: 14,
    color: '#00A86B',
    marginBottom: 16,
    lineHeight: 20,
  },
  proceedToRentalButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedToRentalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  renterDeclinedStatus: {
    backgroundColor: '#FFE8E8',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  declinedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  declinedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginLeft: 8,
  },
  declinedMessage: {
    fontSize: 14,
    color: '#FF3B30',
    lineHeight: 20,
  },
  renterPendingStatus: {
    backgroundColor: '#FFF8E8',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginLeft: 8,
  },
  pendingMessage: {
    fontSize: 14,
    color: '#FF9500',
    lineHeight: 20,
  },
});
