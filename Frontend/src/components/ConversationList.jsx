import React from 'react';

const ConversationList = ({ conversations, activeConversationId, onSelect }) => {
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInMs = now - messageDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="overflow-y-auto flex-1">
      {conversations.map((c, index) => {
        const otherUser = c.otherUser || { firstName: 'User', lastName: '', photoUrl: '' };
        const lastMessagePreview = c.unreadCount > 0 
          ? `${c.unreadCount > 9 ? '9+' : c.unreadCount} new message${c.unreadCount > 1 ? 's' : ''}` 
          : (c.lastMessage?.text || (c.lastMessage?.messageType === 'attachment' ? '📎 Attachment' : 'Start chatting'));
        const isActive = c._id === activeConversationId;
        
        return (
          <button
            key={`${c._id}-${index}`}
            onClick={() => onSelect(c._id)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-50 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 ${
              isActive ? 'bg-accent dark:bg-gray-700 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img 
                src={otherUser.photoUrl} 
                alt={`${otherUser.firstName} ${otherUser.lastName}`}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-0 py-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold truncate pr-2 ${c.unreadCount > 0 ? 'text-secondary dark:text-gray-100' : 'text-secondary dark:text-gray-100'}`}>
                  {otherUser.firstName} {otherUser.lastName}
                </h3>
                {c.lastMessageAt && (
                  <span className={`text-xs flex-shrink-0 ${c.unreadCount > 0 ? 'text-primary font-medium' : 'text-secondary-lighter dark:text-gray-300'}`}>
                    {formatLastMessageTime(c.lastMessageAt)}
                  </span>
                )}
              </div>
              <p className={`text-sm truncate ${c.unreadCount > 0 ? 'text-secondary dark:text-gray-100 font-medium' : 'text-secondary-lighter dark:text-gray-300'}`}>
                {lastMessagePreview}
              </p>
            </div>
          </button>
        );
      })}
      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary dark:text-gray-100 mb-2">No messages yet</h3>
          <p className="text-secondary-lighter dark:text-gray-300 text-sm max-w-xs">Start chatting with your connections from the Feed or Connections page!</p>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
