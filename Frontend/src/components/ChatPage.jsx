import React, { useEffect, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleBackToList = () => {
    dispatch(setActiveConversation(null));
  };

  // Mobile: show either list or chat window
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-white">
        {!activeConversationId ? (
          <div className="h-full flex flex-col">
            <div className="px-4 py-4 border-b bg-white sticky top-0 z-10">
              <h1 className="text-2xl font-bold text-secondary">Messages</h1>
            </div>
            <ConversationList 
              conversations={conversations} 
              activeConversationId={activeConversationId}
              onSelect={handleSelectConversation}
            />
          </div>
        ) : (
          <ChatWindow 
            conversationId={activeConversationId} 
            messages={activeConversationId ? messages[activeConversationId] || [] : []}
            typing={typing[activeConversationId]}
            onBack={handleBackToList}
            isMobile={true}
          />
        )}
      </div>
    );
  }

  // Desktop: show both side by side
  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white max-w-7xl mx-auto">
      {/* Conversations sidebar */}
      <div className="w-full md:w-96 lg:w-[420px] border-r flex flex-col bg-white">
        <div className="px-6 py-5 border-b">
          <h1 className="text-2xl font-bold text-secondary">Messages</h1>
        </div>
        <ConversationList 
          conversations={conversations} 
          activeConversationId={activeConversationId}
          onSelect={handleSelectConversation}
        />
      </div>
      
      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <ChatWindow 
          conversationId={activeConversationId} 
          messages={activeConversationId ? messages[activeConversationId] || [] : []}
          typing={typing[activeConversationId]}
          onBack={null}
          isMobile={false}
        />
      </div>
    </div>
  );
};

export default ChatPage;
