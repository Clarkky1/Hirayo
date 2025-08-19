import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Spacing } from '../../constants/DesignSystem';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isFromUser: boolean;
}

export default function ViewMessagesScreen() {
  const params = useLocalSearchParams();
  const { messageId, senderName, itemName, isLenderView } = params;
  const navigation = useNavigation();
  
  const [newMessage, setNewMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! Is the camera still available for rent?',
      timestamp: '2:30 PM',
      isFromUser: false,
    },
    {
      id: '2',
      text: 'Yes, it is! When would you like to rent it?',
      timestamp: '2:32 PM',
      isFromUser: true,
    },
    {
      id: '3',
      text: 'This weekend would be perfect. What\'s the daily rate?',
      timestamp: '2:35 PM',
      isFromUser: false,
    },
    {
      id: '4',
      text: 'The daily rate is ₱45. How many days do you need it?',
      timestamp: '2:37 PM',
      isFromUser: true,
    },
  ]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFromUser: true,
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isFromUser ? styles.userMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isFromUser ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isFromUser ? styles.userMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.isFromUser ? styles.userTimestamp : styles.otherTimestamp
        ]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  const flatListRef = useRef<FlatList>(null);

  // Update header title with user name only (item name shown in button below)
  useLayoutEffect(() => {
    if (senderName) {
      navigation.setOptions({
        title: senderName as string,
      });
    }
  }, [senderName, navigation]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage();
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height + 20);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentContainer, { paddingBottom: keyboardHeight }]}>
        {/* Item Navigation Button */}
        {itemName && (
          <TouchableOpacity style={styles.itemButton} onPress={() => router.push('/item')}>
            <View style={styles.itemButtonContent}>
              <Ionicons name="cube-outline" size={20} color="#0066CC" />
              <Text style={styles.itemButtonText}>View Item: {itemName}</Text>
              <Ionicons name="chevron-forward" size={16} color="#666666" />
            </View>
          </TouchableOpacity>
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            maxLength={500}
            onFocus={handleInputFocus}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={newMessage.trim() ? '#ffffff' : '#cccccc'} 
            />
          </TouchableOpacity>
                 </View>
       </View>
     </SafeAreaView>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
     contentContainer: {
     flex: 1,
   },

  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#0066CC',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 3,
  },
  userMessageText: {
    color: '#ffffff',
  },
  otherMessageText: {
    color: '#333333',
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#999999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: 12,
    maxHeight: 100,
    minHeight: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: '#0066CC',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  itemButton: {
    backgroundColor: '#ffffff',
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: Spacing.md,
  },
  itemButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginLeft: Spacing.sm,
  },
});
