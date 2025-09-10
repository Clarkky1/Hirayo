import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RentalRequestForm } from './RentalRequestForm';

interface Message {
  id: string;
  text: string;
  sender: 'renter' | 'lender';
  timestamp: Date;
  type: 'text' | 'rental_request' | 'status_update';
}

interface RentalRequest {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  specialRequests: string;
  status: 'pending' | 'accepted' | 'declined' | 'counter_offer';
  createdAt: Date;
}

interface EnhancedChatInterfaceProps {
  itemName: string;
  itemPrice: number;
  isLender: boolean;
  onSendMessage: (message: string) => void;
  onRentalRequestUpdate: (requestId: string, status: string, response?: string) => void;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  itemName,
  itemPrice,
  isLender,
  onSendMessage,
  onRentalRequestUpdate,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm interested in renting your ${itemName}. Can you tell me more about it?`,
      sender: 'renter',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [activeRentalRequest, setActiveRentalRequest] = useState<RentalRequest | null>(null);
  
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'renter',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, message]);
      onSendMessage(newMessage);
      setNewMessage('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleCreateRentalRequest = (requestData: any) => {
    const rentalRequest: RentalRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      createdAt: new Date(),
    };

    setRentalRequests(prev => [...prev, rentalRequest]);

    // Add rental request message
    const message: Message = {
      id: Date.now().toString(),
      text: `Rental Request Created: ${requestData.totalDays} days for ₱${requestData.totalAmount.toLocaleString()}`,
      sender: 'renter',
      timestamp: new Date(),
      type: 'rental_request',
    };

    setMessages(prev => [...prev, message]);
    setActiveRentalRequest(rentalRequest);
  };

  const handleRentalResponse = (status: 'accepted' | 'declined' | 'counter_offer', response?: string) => {
    if (!activeRentalRequest) return;

    const updatedRequest = { ...activeRentalRequest, status };
    setRentalRequests(prev => 
      prev.map(req => req.id === activeRentalRequest.id ? updatedRequest : req)
    );

    // Add status update message
    const statusText = status === 'accepted' ? 'accepted' : 
                      status === 'declined' ? 'declined' : 'sent a counter-offer';
    
    const message: Message = {
      id: Date.now().toString(),
      text: `Rental request ${statusText}${response ? `: ${response}` : ''}`,
      sender: 'lender',
      timestamp: new Date(),
      type: 'status_update',
    };

    setMessages(prev => [...prev, message]);
    onRentalRequestUpdate(activeRentalRequest.id, status, response);
  };

  const handlePostAgreementAction = (action: 'payment' | 'meetup' | 'agreement') => {
    switch (action) {
      case 'payment':
        Alert.alert('Payment Setup', 'Redirecting to payment gateway...');
        // TODO: Integrate with payment system
        break;
      case 'meetup':
        Alert.alert('Meetup Coordination', 'Opening meetup coordination...');
        // TODO: Open meetup coordination interface
        break;
      case 'agreement':
        Alert.alert('Rental Agreement', 'Opening rental agreement...');
        // TODO: Show rental agreement document
        break;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender === (isLender ? 'lender' : 'renter');
    
    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : null]}>
        <View style={[styles.messageBubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
          {item.type === 'rental_request' && (
            <View style={styles.rentalRequestBanner}>
              <Ionicons name="calendar" size={16} color={Colors.primary[500]} />
              <Text style={styles.rentalRequestText}>Rental Request</Text>
            </View>
          )}
          
          {item.type === 'status_update' && (
            <View style={styles.statusUpdateBanner}>
              <Ionicons name="information-circle" size={16} color={Colors.info[500]} />
              <Text style={styles.statusUpdateText}>Status Update</Text>
            </View>
          )}
          
          <Text style={[styles.messageText, isOwnMessage ? styles.ownMessageText : null]}>
            {item.text}
          </Text>
          
          <Text style={[styles.timestamp, isOwnMessage ? styles.ownTimestamp : null]}>
            {item.timestamp.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderRentalRequestActions = () => {
    if (!activeRentalRequest) return null;

    // Show different actions based on status
    if (activeRentalRequest.status === 'pending') {
      return (
        <View style={styles.rentalActionsContainer}>
          <Text style={styles.rentalActionsTitle}>Rental Request Pending</Text>
          <View style={styles.rentalActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleRentalResponse('accepted')}
            >
              <Ionicons name="checkmark" size={16} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.declineButton]}
              onPress={() => handleRentalResponse('declined')}
            >
              <Ionicons name="close" size={16} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Decline</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.counterButton]}
              onPress={() => {
                Alert.prompt(
                  'Counter Offer',
                  'Enter your counter offer details:',
                  (response) => {
                    if (response) {
                      handleRentalResponse('counter_offer', response);
                    }
                  }
                );
              }}
            >
              <Ionicons name="swap-horizontal" size={16} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Counter</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Show post-agreement actions for accepted requests
    if (activeRentalRequest.status === 'accepted') {
      return (
        <View style={styles.rentalActionsContainer}>
          <View style={styles.rentalConfirmedBanner}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.rentalConfirmedTitle}>Rental Confirmed!</Text>
          </View>
          
          <View style={styles.rentalDetailsCard}>
            <Text style={styles.rentalDetailsTitle}>Rental Details</Text>
            <View style={styles.rentalDetailRow}>
              <Text style={styles.rentalDetailLabel}>Period:</Text>
              <Text style={styles.rentalDetailValue}>
                {activeRentalRequest.startDate} - {activeRentalRequest.endDate}
              </Text>
            </View>
            <View style={styles.rentalDetailRow}>
              <Text style={styles.rentalDetailLabel}>Duration:</Text>
              <Text style={styles.rentalDetailValue}>
                {activeRentalRequest.totalDays} day{activeRentalRequest.totalDays > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.rentalDetailRow}>
              <Text style={styles.rentalDetailLabel}>Total Amount:</Text>
              <Text style={styles.rentalDetailValue}>
                ₱{activeRentalRequest.totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.postAgreementActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryAction]}
              onPress={() => handlePostAgreementAction('payment')}
            >
              <Ionicons name="card" size={16} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Setup Payment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryAction]}
              onPress={() => handlePostAgreementAction('meetup')}
            >
              <Ionicons name="location" size={16} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Coordinate Meetup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryAction]}
              onPress={() => handlePostAgreementAction('agreement')}
            >
              <Ionicons name="document-text" size={16} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>View Agreement</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Show declined status
    if (activeRentalRequest.status === 'declined') {
      return (
        <View style={styles.rentalActionsContainer}>
          <View style={styles.rentalDeclinedBanner}>
            <Ionicons name="close-circle" size={20} color={Colors.error} />
            <Text style={styles.rentalDeclinedTitle}>Rental Request Declined</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Item Info Header */}
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text style={styles.itemPrice}>₱{itemPrice.toLocaleString()}/day</Text>
        </View>
        
        {!isLender && (
          <TouchableOpacity 
            style={styles.createRequestButton}
            onPress={() => {
              console.log('Create Rental Request button clicked!');
              console.log('Current isLender:', isLender);
              console.log('Setting showRentalForm to true');
              setShowRentalForm(true);
            }}
          >
            <Ionicons name="add-circle" size={20} color={Colors.text.inverse} />
            <Text style={styles.createRequestText}>Create Rental Request</Text>
          </TouchableOpacity>
        )}
      </View>
      


      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      />

      {/* Rental Request Actions (for lenders) */}
      {isLender && renderRentalRequestActions()}

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor={Colors.text.tertiary}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={newMessage.trim() ? Colors.text.inverse : Colors.text.tertiary} 
          />
        </TouchableOpacity>
      </View>

      {/* Rental Request Form */}
      <RentalRequestForm
        visible={showRentalForm}
        onClose={() => setShowRentalForm(false)}
        onSubmit={handleCreateRentalRequest}
        itemName={itemName}
        itemPrice={itemPrice}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...TextStyles.body.large,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  createRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  createRequestText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
  },
  messageContainer: {
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    position: 'relative',
  },
  ownBubble: {
    backgroundColor: Colors.primary[500],
    borderBottomRightRadius: BorderRadius.sm,
  },
  otherBubble: {
    backgroundColor: Colors.background.secondary,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  rentalRequestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    alignSelf: 'flex-start',
  },
  rentalRequestText: {
    ...TextStyles.body.small,
    color: Colors.primary[600],
    fontWeight: '500',
    marginLeft: 4,
  },
  statusUpdateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    alignSelf: 'flex-start',
  },
  statusUpdateText: {
    ...TextStyles.body.small,
    color: Colors.info[600],
    fontWeight: '500',
    marginLeft: 4,
  },
  messageText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Colors.text.inverse,
  },
  timestamp: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  rentalActionsContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  rentalActionsTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  rentalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  declineButton: {
    backgroundColor: Colors.error,
  },
  counterButton: {
    backgroundColor: Colors.warning,
  },
  actionButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: '500',
  },
  primaryAction: {
    backgroundColor: Colors.primary[500],
  },
  secondaryAction: {
    backgroundColor: Colors.neutral[500],
  },
  rentalConfirmedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success[100],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  rentalConfirmedTitle: {
    ...TextStyles.body.medium,
    color: Colors.success[600],
    fontWeight: '600',
    marginLeft: 4,
  },
  rentalDetailsCard: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  rentalDetailsTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  rentalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rentalDetailLabel: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  rentalDetailValue: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  postAgreementActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rentalDeclinedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error[100],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  rentalDeclinedTitle: {
    ...TextStyles.body.medium,
    color: Colors.error[600],
    fontWeight: '600',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: Colors.primary[500],
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
});
