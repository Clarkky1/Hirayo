import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
  isRead: boolean;
}

const chatMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hi! Is the camera still available for rent?',
    timestamp: '10:30 AM',
    isFromMe: false,
    isRead: true,
  },
  {
    id: '2',
    text: 'Yes, it\'s still available! When do you need it?',
    timestamp: '10:32 AM',
    isFromMe: true,
    isRead: true,
  },
  {
    id: '3',
    text: 'I need it for this weekend. Can I rent it for 3 days?',
    timestamp: '10:35 AM',
    isFromMe: false,
    isRead: true,
  },
  {
    id: '4',
    text: 'Perfect! That works for me. What time works best for pickup?',
    timestamp: '10:37 AM',
    isFromMe: true,
    isRead: true,
  },
  {
    id: '5',
    text: 'Can you deliver it to my location? I\'m in downtown area.',
    timestamp: '10:40 AM',
    isFromMe: false,
    isRead: true,
  },
  {
    id: '6',
    text: 'Sure! I can deliver it. There\'s a small delivery fee of ₱200. Is that okay?',
    timestamp: '10:42 AM',
    isFromMe: true,
    isRead: false,
  },
  {
    id: '7',
    text: 'That\'s fine with me. Can you deliver it tomorrow at 2 PM?',
    timestamp: '10:45 AM',
    isFromMe: false,
    isRead: false,
  },
  {
    id: '8',
    text: 'Yes, 2 PM tomorrow works perfectly! I\'ll send you the exact location details.',
    timestamp: '10:47 AM',
    isFromMe: true,
    isRead: false,
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
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timestamp,
            message.isFromMe ? styles.myTimestamp : styles.theirTimestamp
          ]}>
            {message.timestamp}
          </Text>
          {message.isFromMe && (
            <Ionicons 
              name={message.isRead ? "checkmark-done" : "checkmark"} 
              size={16} 
              color={message.isRead ? "#0066CC" : "#999999"} 
              style={styles.readIndicator}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default function ViewMessagesScreen() {
  const [messageText, setMessageText] = useState('');

  const handleBack = () => {
    console.log('Back pressed');
  };

  const handleSend = () => {
    if (messageText.trim()) {
      console.log('Send message:', messageText);
      setMessageText('');
    }
  };

  const handleMore = () => {
    console.log('More options pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JS</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Smith</Text>
            <Text style={styles.userStatus}>Online</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton} onPress={handleMore}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Item Info */}
      <View style={styles.itemInfo}>
        <View style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>Canon EOS 90D DSLR Camera</Text>
          <Text style={styles.itemPrice}>₱2,500 for a day</Text>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContainer}
        inverted={false}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
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
              color={messageText.trim() ? "#ffffff" : "#999999"} 
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
          paddingTop: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00A86B',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  userStatus: {
    fontSize: 12,
    color: '#00A86B',
    fontWeight: '500',
  },
  moreButton: {
    padding: 5,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemImage: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '600',
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#0066CC',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#ffffff',
  },
  theirMessageText: {
    color: '#333333',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
    marginRight: 4,
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirTimestamp: {
    color: '#999999',
  },
  readIndicator: {
    marginLeft: 2,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  inputWrapper: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#0066CC',
  },
  sendButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
});
