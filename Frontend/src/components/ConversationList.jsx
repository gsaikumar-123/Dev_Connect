import React from 'react';

const ConversationList = ({ conversations, activeConversationId, onSelect }) => {
  return (
    <div className="overflow-y-auto flex-1">
      {conversations.map(c => {
        const otherUser = c.otherUser || { firstName: 'User', lastName: '', photoUrl: '' };
        return (
          <button
            key={c._id}
            onClick={() => onSelect(c._id)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-accent transition border-b border-gray-100 ${c._id === activeConversationId ? 'bg-accent' : ''}`}
          >
            <img 
              src={otherUser.photoUrl} 
              alt={`${otherUser.firstName} ${otherUser.lastName}`}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-secondary truncate">{otherUser.firstName} {otherUser.lastName}</div>
              <div className="text-xs text-secondary-lighter truncate">{c.lastMessage?.text || (c.lastMessage?.messageType === 'attachment' ? '📎 Attachment' : 'Start chatting')}</div>
            </div>
            {c.unreadCount > 0 && (
              <span className="text-xs bg-primary text-white rounded-full px-2 py-1 flex-shrink-0">{c.unreadCount}</span>
            )}
          </button>
        );
      })}
      {conversations.length === 0 && (
        <div className="p-4 text-secondary-lighter text-sm text-center">No conversations yet. Start chatting with your connections!</div>
      )}
    </div>
  );
};

export default ConversationList;
