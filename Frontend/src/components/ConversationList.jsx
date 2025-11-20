import React from 'react';
import { useSelector } from 'react-redux';

const ConversationList = ({ conversations, activeConversationId, onSelect }) => {
  const users = useSelector(s => s.connections.connections || []);
  const userMap = new Map(users.map(u => [u._id, u]));

  return (
    <div className="overflow-y-auto flex-1">
      {conversations.map(c => {
        const otherUser = userMap.get(c.otherUserId) || { firstName: 'User', lastName: '' };
        return (
          <button
            key={c._id}
            onClick={() => onSelect(c._id)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-accent transition ${c._id === activeConversationId ? 'bg-accent' : ''}`}
          >
            <div className="flex-1">
              <div className="font-medium text-secondary">{otherUser.firstName} {otherUser.lastName}</div>
              <div className="text-xs text-secondary-lighter truncate max-w-[180px]">{c.lastMessage?.text || (c.lastMessage?.messageType === 'attachment' ? 'Attachment' : 'No messages')}</div>
            </div>
            {c.unreadCount > 0 && (
              <span className="text-xs bg-primary text-white rounded-full px-2 py-1">{c.unreadCount}</span>
            )}
          </button>
        );
      })}
      {conversations.length === 0 && (
        <div className="p-4 text-secondary-lighter text-sm">No conversations yet</div>
      )}
    </div>
  );
};

export default ConversationList;
