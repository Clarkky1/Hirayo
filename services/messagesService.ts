import { Message, supabase } from '../lib/supabase';

export const messagesService = {
  // Get conversations for a user
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        item:items(*),
        renter:users!conversations_renter_id_fkey(*),
        lender:users!conversations_lender_id_fkey(*),
        last_message:messages(
          content,
          created_at,
          sender_id
        )
      `)
      .or(`renter_id.eq.${userId},lender_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to match the expected format
    const conversations = data?.map(conv => {
      const isRenter = conv.renter_id === userId;
      const otherUser = isRenter ? conv.lender : conv.renter;
      const lastMessage = conv.last_message?.[0];
      
      return {
        id: conv.id,
        senderName: otherUser?.first_name && otherUser?.last_name 
          ? `${otherUser.first_name} ${otherUser.last_name}`
          : otherUser?.email || 'Unknown User',
        lastMessage: lastMessage?.content || 'No messages yet',
        timestamp: lastMessage?.created_at 
          ? new Date(lastMessage.created_at).toLocaleDateString()
          : new Date(conv.created_at).toLocaleDateString(),
        unreadCount: 0, // TODO: Implement unread count
        isOnline: false, // TODO: Implement online status
        itemName: conv.item?.name || 'Unknown Item',
        itemId: conv.item_id,
      };
    }) || [];

    return conversations;
  },

  // Get messages for a conversation
  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  // Send a message
  async sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*)
      `)
      .single();

    return { data, error };
  },

  // Create or get conversation
  async getOrCreateConversation(itemId: string, renterId: string, lenderId: string) {
    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('item_id', itemId)
      .eq('renter_id', renterId)
      .eq('lender_id', lenderId)
      .single();

    if (existingConversation) {
      return { data: existingConversation, error: null };
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        item_id: itemId,
        renter_id: renterId,
        lender_id: lenderId,
        status: 'pending',
      })
      .select()
      .single();

    return { data, error };
  },

  // Update conversation status
  async updateConversationStatus(conversationId: string, status: 'pending' | 'approved' | 'declined' | 'completed') {
    const { data, error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', conversationId)
      .select()
      .single();

    return { data, error };
  },

  // Subscribe to real-time messages
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },

  // Unsubscribe from messages
  unsubscribeFromMessages(subscription: any) {
    supabase.removeChannel(subscription);
  },
};
