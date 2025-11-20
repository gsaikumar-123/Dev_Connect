import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [], 
  messages: {}, 
  activeConversationId: null,
  typing: {}, 
  loadingConversations: false,
  loadingMessages: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    },
    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage(state, action) {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) state.messages[conversationId] = [];
      state.messages[conversationId].push(message);
      
      const conv = state.conversations.find(c => c._id === conversationId);
      if (conv) {
        conv.lastMessage = message;
        conv.lastMessageAt = message.sentAt || Date.now();
        if (state.activeConversationId !== conversationId) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
      }
    },
    markConversationRead(state, action) {
      const conversationId = action.payload;
      const conv = state.conversations.find(c => c._id === conversationId);
      if (conv) conv.unreadCount = 0;
    },
    setTyping(state, action) {
      const { conversationId, typing } = action.payload;
      state.typing[conversationId] = typing;
    },
    deleteMessage(state, action) {
      const { conversationId, messageId } = action.payload;
      const arr = state.messages[conversationId];
      if (!arr) return;
      const msg = arr.find(m => m._id === messageId);
      if (msg) msg.isDeleted = true;
    }
  }
});

export const { setConversations, setActiveConversation, setMessages, addMessage, markConversationRead, setTyping, deleteMessage } = chatSlice.actions;
export default chatSlice.reducer;
