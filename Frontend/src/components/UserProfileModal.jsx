import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { setActiveConversation } from '../utils/chatSlice';

const UserProfileModal = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCreatingChat, setIsCreatingChat] = React.useState(false);

  if (!isOpen || !user) return null;

  const { firstName, lastName, about, photoUrl, age, gender, skills } = user;
  const skillsArray = Array.isArray(skills) ? skills : (skills ? [skills] : []);

  const handleStartChat = async () => {
    setIsCreatingChat(true);
    try {
      const res = await axios.post(
        BASE_URL + '/chat/send',
        { toUserId: user._id, text: '👋' },
        { withCredentials: true }
      );
      dispatch(setActiveConversation(res.data.conversationId));
      navigate('/chat');
      onClose();
    } catch (err) {
      console.error('Error starting chat:', err);
      navigate('/chat');
      onClose();
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with photo */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img 
            src={photoUrl} 
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {firstName} {lastName}
            </h2>
            {age && gender && (
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {age} years
                </span>
                <span>•</span>
                <span>{gender}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {about && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-secondary-lighter uppercase tracking-wide mb-2">About</h3>
              <p className="text-secondary-lighter leading-relaxed">
                {about}
              </p>
            </div>
          )}

          {skillsArray.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-secondary-lighter uppercase tracking-wide mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleStartChat}
              disabled={isCreatingChat}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isCreatingChat ? (
                <svg className="animate-spin-slow h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start Chat
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
