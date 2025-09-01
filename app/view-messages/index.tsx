import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Keyboard,
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

const RentalRequestActions: React.FC<{ isLenderView: boolean }> = ({ isLenderView }) => {
  const [requestStatus, setRequestStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');

  if (!isLenderView) return null;

  const handleAccept = () => {
    setRequestStatus('accepted');
    console.log('Rental request accepted');
  };

  const handleDecline = () => {
    setRequestStatus('declined');
    console.log('Rental request declined');
  };

  if (requestStatus !== 'pending') {
    return (
      <View style={[
        styles.statusBanner,
        { backgroundColor: requestStatus === 'accepted' ? '#E8F5E8' : '#FFE8E8' }
      ]}>
        <Text style={[
          styles.statusBannerText,
          { color: requestStatus === 'accepted' ? '#00A86B' : '#FF3B30' }
        ]}>
          Request {requestStatus === 'accepted' ? 'Approved' : 'Declined'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.rentalActions}>
      <Text style={styles.rentalRequestTitle}>Rental Request</Text>
      <Text style={styles.rentalRequestDetails}>
        Aug 24 - Aug 26, 2025 • 3 days • ₱3,600
      </Text>
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
};

export default function ViewMessagesScreen() {
  const [messageText, setMessageText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const isLenderView = params.isLenderView === 'true';
  const senderName = params.senderName as string || 'Conversation';
  const itemName = params.itemName as string || 'Canon EOS 90D DSLR Camera';
  const itemId = params.itemId as string || 'item1';

  // Update the header title dynamically
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: senderName,
    });
  }, [navigation, senderName]);

  // Debug: Log the parameters to see what's being received
  console.log('ViewMessagesScreen params:', {
    senderName,
    itemName,
    itemId,
    isLenderView
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Scroll to bottom when keyboard appears
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
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

  const handleSend = () => {
    if (messageText.trim()) {
      console.log('Send message:', messageText);
      setMessageText('');
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Simple Item Info */}
      <TouchableOpacity style={styles.itemInfo} onPress={handleItemPress}>
        <View style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text style={styles.itemPrice}>₱2,500/day</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Rental Request Actions (Lender View) */}
      <RentalRequestActions isLenderView={isLenderView} />

      {/* Messages List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {chatMessages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </ScrollView>

      {/* Simple Message Input */}
      <View style={[styles.inputContainer, { paddingBottom: Math.max(16, keyboardHeight > 0 ? 16 : 16) }]}>
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
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  rentalActions: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rentalRequestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rentalRequestDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
  statusBanner: {
    padding: 12,
    alignItems: 'center',
  },
  statusBannerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
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
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
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
});
