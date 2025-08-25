import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function ViewMessagesScreen() {
  const [message, setMessage] = useState('');
  const [showTimeoutBanner, setShowTimeoutBanner] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(300); // 5 minutes in seconds
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! I\'m interested in renting your Canon EOS 90D DSLR Camera. Is it available for this weekend?',
      sender: 'renter',
      timestamp: '2:30 PM',
      isRentalRequest: true
    },
    {
      id: '2',
      text: 'Yes, it\'s available! What dates do you need it for?',
      sender: 'lender',
      timestamp: '2:32 PM',
      isRentalRequest: false
    },
    {
      id: '3',
      text: 'I need it from Friday to Sunday. What\'s the total price?',
      sender: 'renter',
      timestamp: '2:35 PM',
      isRentalRequest: false
    },
    {
      id: '4',
      text: 'That would be ₱7,500 for 3 days. Does that work for you?',
      sender: 'lender',
      timestamp: '2:38 PM',
      isRentalRequest: false
    },
    {
      id: '5',
      text: 'Perfect! That works for me.',
      sender: 'renter',
      timestamp: '2:40 PM',
      isRentalRequest: false
    },
    {
      id: '6',
      text: '✅ Rental permission granted! You can now proceed with the rental form.',
      sender: 'lender',
      timestamp: '2:42 PM',
      isRentalRequest: false,
      isPermissionGranted: true
    }
  ]);

  // Timeout handling - show banner after 5 minutes of no response
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeoutCountdown(prev => {
        if (prev <= 0) {
          setShowTimeoutBanner(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'renter',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRentalRequest: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      // Reset timeout when renter sends a message
      setTimeoutCountdown(300);
      setShowTimeoutBanner(false);
    }
  };

  const proceedToRentalForm = () => {
    Alert.alert(
      'Proceed to Rental Form',
      'Great! You can now proceed with the rental process. Would you like to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          style: 'default',
          onPress: () => {
            // Navigate to rental period
            router.push('/period');
          }
        }
      ]
    );
  };

  const switchToVideoCall = () => {
    Alert.alert(
      'Switch to Video Call',
      'Would you like to try video calling the lender instead? This might be faster for getting a response.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Video Call', 
          style: 'default',
          onPress: () => {
            router.push('/video-call');
          }
        }
      ]
    );
  };

  const findAlternativeItem = () => {
    Alert.alert(
      'Find Alternative',
      'Would you like to browse other similar items while waiting for a response?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Browse Items', 
          style: 'default',
          onPress: () => {
            router.push('/discover');
          }
        }
      ]
    );
  };

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

  const hasPermissionGranted = messages.some(msg => msg.isPermissionGranted);

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
            <Text style={styles.headerSubtitle}>Rental Request</Text>
          </View>
        </View>

        {/* Permission Granted Banner */}
        {hasPermissionGranted && (
          <View style={styles.permissionBanner}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.permissionBannerText}>
              Rental permission granted! You can now proceed with the rental form.
            </Text>
            <TouchableOpacity 
              style={styles.proceedButton} 
              onPress={proceedToRentalForm}
              activeOpacity={0.7}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Timeout Banner - Show after 5 minutes of no response */}
        {showTimeoutBanner && !hasPermissionGranted && (
          <View style={styles.timeoutBanner}>
            <Ionicons name="time-outline" size={20} color={Colors.warning} />
            <View style={styles.timeoutContent}>
              <Text style={styles.timeoutTitle}>No response yet?</Text>
              <Text style={styles.timeoutText}>
                The lender hasn't responded in a while. Try these alternatives:
              </Text>
              <View style={styles.timeoutActions}>
                <TouchableOpacity 
                  style={styles.timeoutActionButton} 
                  onPress={switchToVideoCall}
                  activeOpacity={0.7}
                >
                  <Ionicons name="videocam-outline" size={16} color={Colors.primary[500]} />
                  <Text style={styles.timeoutActionText}>Video Call</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.timeoutActionButton} 
                  onPress={findAlternativeItem}
                  activeOpacity={0.7}
                >
                  <Ionicons name="search-outline" size={16} color={Colors.primary[500]} />
                  <Text style={styles.timeoutActionText}>Find Alternative</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

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
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  permissionBannerText: {
    fontSize: 14,
    color: Colors.success,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  proceedButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  proceedButtonText: {
    fontSize: 14,
    color: Colors.text.inverse,
  },
  timeoutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  timeoutContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  timeoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 4,
  },
  timeoutText: {
    fontSize: 14,
    color: Colors.warning,
    marginBottom: 12,
  },
  timeoutActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeoutActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  timeoutActionText: {
    fontSize: 14,
    color: Colors.primary[500],
    marginLeft: Spacing.sm,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  messageContainer: {
    marginBottom: 12,
  },
  renterMessage: {
    alignItems: 'flex-end',
  },
  lenderMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  renterBubble: {
    backgroundColor: Colors.primary[500],
    borderBottomRightRadius: BorderRadius.sm,
  },
  lenderBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  permissionBubble: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 3,
  },
  renterText: {
    color: Colors.text.inverse,
  },
  lenderText: {
    color: Colors.text.primary,
  },
  permissionText: {
    color: Colors.success,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  renterTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  lenderTimestamp: {
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
    backgroundColor: Colors.primary[500],
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
