import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { setConversations, setMessages, addMessage, setActiveConversation, markConversationRead, setTyping, deleteMessage } from '../utils/chatSlice';
import { initSocket, getSocket } from '../utils/socket';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversationId, messages, typing } = useSelector(s => s.chat);

  useEffect(() => {
    fetchConversations();
    const socket = initSocket();

    socket.on('chat:newMessage', ({ conversationId, message }) => {
      dispatch(addMessage({ conversationId, message }));
    });

    socket.on('chat:typing', ({ fromUserId, conversationId }) => {
      if (conversationId === activeConversationId) {
        dispatch(setTyping({ conversationId, typing: true }));
        setTimeout(() => dispatch(setTyping({ conversationId, typing: false })), 1500);
      }
    });

    socket.on('chat:readReceipt', ({ conversationId }) => {
      dispatch(markConversationRead(conversationId));
    });

    socket.on('chat:messageDeleted', ({ conversationId, messageId }) => {
      dispatch(deleteMessage({ conversationId, messageId }));
    });

    return () => {
      socket.off('chat:newMessage');
      socket.off('chat:typing');
      socket.off('chat:readReceipt');
      socket.off('chat:messageDeleted');
    };
  }, [dispatch, activeConversationId]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(BASE_URL + '/chat/conversations', { withCredentials: true });
      dispatch(setConversations(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(BASE_URL + '/chat/messages/' + conversationId, { withCredentials: true });
      dispatch(setMessages({ conversationId, messages: res.data.data }));
      dispatch(markConversationRead(conversationId));
      await axios.post(BASE_URL + '/chat/read', { conversationId }, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (conversationId) => {
    dispatch(setActiveConversation(conversationId));
    fetchMessages(conversationId);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-4rem)]">
      <div className="md:col-span-1 border rounded-lg bg-white flex flex-col">
        <div className="p-3 border-b font-semibold">Chats</div>
        <ConversationList 
          conversations={conversations} 
          activeConversationId={activeConversationId}
          onSelect={handleSelectConversation}
        />
      </div>
      <div className="md:col-span-2 border rounded-lg bg-white flex flex-col">
        <ChatWindow 
          conversationId={activeConversationId} 
          messages={activeConversationId ? messages[activeConversationId] || [] : []}
          typing={typing[activeConversationId]}
        />
      </div>
    </div>
  );
};

export default ChatPage;
