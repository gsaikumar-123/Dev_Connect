import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../utils/chatSlice';
import { getSocket } from '../utils/socket';

const ChatWindow = ({ conversationId, messages, typing }) => {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;
    setSending(true);
    try {
      const state = window.__APP_STORE__?.getState();
      const conversation = state?.chat.conversations.find(c => c._id === conversationId);
      if (!conversation) return;
      const toUserId = conversation.otherUser?._id || conversation.otherUserId;
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
      const state = window.__APP_STORE__?.getState();
      const conversation = state?.chat.conversations.find(c => c._id === conversationId);
      if (conversation) {
        const socket = getSocket();
        const toUserId = conversation.otherUser?._id || conversation.otherUserId;
        socket.emit('chat:typing', { toUserId, conversationId });
      }
    }
  };

  if (!conversationId) {
    return <div className="flex flex-col items-center justify-center h-full text-secondary-lighter">Select a conversation to start chatting.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map(m => (
          <div key={m._id} className={`flex ${m.fromUserId === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow ${m.fromUserId === user._id ? 'bg-primary text-white' : 'bg-white text-secondary border border-gray-200'}`}>
              {m.isDeleted ? <span className="italic text-secondary-lighter">Message deleted</span> : (
                <>
                  {m.text && <div>{m.text}</div>}
                  {m.attachments?.map((a, idx) => (
                    <div key={idx} className="mt-2 text-xs text-secondary-lighter">{a.type}: {a.fileName || a.url}</div>
                  ))}
                </>
              )}
              <div className="text-[10px] mt-1 opacity-60">{new Date(m.sentAt).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        {typing && <div className="text-xs text-secondary-lighter">Typing...</div>}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t flex gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none h-12 p-2 border rounded-lg text-sm"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
