import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../utils/chatSlice';
import { getSocket } from '../utils/socket';

const ChatWindow = ({ conversationId, messages, typing, onBack, isMobile }) => {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user);
  const conversations = useSelector(s => s.chat.conversations);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef();
  const textareaRef = useRef();

  const conversation = conversations.find(c => c._id === conversationId);
  const otherUser = conversation?.otherUser || { firstName: 'User', lastName: '', photoUrl: '' };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (conversationId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [conversationId]);

  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;
    setSending(true);
    try {
      const toUserId = otherUser._id;
      const payload = { toUserId, text };
      const res = await axios.post(BASE_URL + '/chat/send', payload, { withCredentials: true });
      dispatch(addMessage({ conversationId, message: res.data.data }));
      setText('');
      const socket = getSocket();
      socket.emit('chat:typing', { toUserId, conversationId });
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      if (conversation) {
        const socket = getSocket();
        const toUserId = otherUser._id;
        socket.emit('chat:typing', { toUserId, conversationId });
      }
    }
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-gray-50 dark:bg-secondary">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-secondary dark:text-gray-100 mb-2">Your Messages</h3>
        <p className="text-secondary-lighter dark:text-gray-300 max-w-sm">Select a conversation from the list to start chatting with your connections.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-secondary">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white dark:bg-secondary-light flex items-center gap-3 sticky top-0 z-10 shadow-sm dark:border-secondary-light">
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-light rounded-full transition-colors -ml-2"
            aria-label="Back to conversations"
          >
            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <img 
          src={otherUser.photoUrl} 
          alt={`${otherUser.firstName} ${otherUser.lastName}`}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-secondary-light"
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-secondary dark:text-gray-100 truncate">{otherUser.firstName} {otherUser.lastName}</h2>
          {typing && <p className="text-xs text-primary">typing...</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-secondary">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-secondary-lighter dark:text-gray-300 text-sm">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isOwn = m.fromUserId === user._id;
            const showTime = idx === 0 || 
              (new Date(m.sentAt).getTime() - new Date(messages[idx - 1].sentAt).getTime()) > 300000;
            
            return (
              <div key={m._id}>
                {showTime && (
                  <div className="text-center text-xs text-secondary-lighter dark:text-gray-400 my-4">
                    {new Date(m.sentAt).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
                  <div className={`max-w-[75%] sm:max-w-md px-4 py-2.5 rounded-2xl shadow-sm ${
                    isOwn 
                      ? 'bg-primary text-white rounded-br-md' 
                      : 'bg-white dark:bg-secondary-light text-secondary dark:text-gray-100 border border-gray-100 dark:border-secondary-light rounded-bl-md'
                  }`}>
                    {m.isDeleted ? (
                      <span className="italic opacity-60 text-sm">Message deleted</span>
                    ) : (
                      <>
                        {m.text && <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">{m.text}</div>}
                        {m.attachments?.map((a, idx) => (
                          <div key={idx} className="mt-2 text-xs opacity-75">📎 {a.fileName || 'Attachment'}</div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 border-t bg-white dark:bg-secondary-light dark:border-secondary-light">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative flex items-end">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="1"
              className="w-full resize-none rounded-xl px-4 py-3 bg-accent-dark dark:bg-secondary border border-gray-200 dark:border-secondary-light focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm max-h-36 overflow-y-auto placeholder-gray-400 dark:text-gray-100"
              placeholder="Message..."
              style={{ minHeight: '44px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="flex-shrink-0 px-5 h-11 rounded-xl bg-primary text-white font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors active:scale-95"
            aria-label="Send message"
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
