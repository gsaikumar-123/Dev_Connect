import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeFromFeed } from '../utils/feedSlice';
import { useNavigate } from 'react-router-dom';
import { setActiveConversation } from '../utils/chatSlice';
import UserProfileModal from './UserProfileModal';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [actionType, setActionType] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [isCreatingChat, setIsCreatingChat] = React.useState(false);

  const handleSendRequest = async (status,userId)=>{
    setIsLoading(true);
    setActionType(status);
    try{
        await axios.post(
            BASE_URL + "/request/send/" + status + "/" + userId,
            {},
            {withCredentials:true}
        )
        dispatch(removeFromFeed(userId));
    }
    catch(err){
        console.log(err);
    }
    finally{
        setIsLoading(false);
        setActionType(null);
    }
  }

  const handleStartChat = async () => {
    setIsCreatingChat(true);
    try {
      const res = await axios.post(
        BASE_URL + '/chat/start',
        { toUserId: user._id },
        { withCredentials: true }
      );
      dispatch(setActiveConversation(res.data.conversationId));
      navigate('/chat');
    } catch (err) {
      console.error('Error starting chat:', err);
      navigate('/chat');
    } finally {
      setIsCreatingChat(false);
    }
  }

  const { firstName, lastName, about, photoUrl, age, gender, skills } = user;
  const skillsArray = Array.isArray(skills) ? skills : (skills ? [skills] : []);

  console.log(user);

  return (
    <>
    <div className="card-modern overflow-hidden w-full max-w-md mx-auto group animate-fade-in">
      <figure className="relative h-80 overflow-hidden cursor-pointer" onClick={() => setShowModal(true)}>
        <img 
          src={photoUrl} 
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        {/* Floating badge on image */}
        {skillsArray.length > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary shadow-lg">
            {skillsArray.length} {skillsArray.length === 1 ? 'Skill' : 'Skills'}
          </div>
        )}
      </figure>
      
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-secondary mb-1">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <div className="flex items-center gap-2 text-secondary-lighter text-sm font-medium">
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

        {about && (
          <p className="text-secondary-lighter leading-relaxed mb-4 line-clamp-3">
            {about}
          </p>
        )}
        {skillsArray.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-secondary-lighter uppercase tracking-wide mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillsArray.slice(0, 5).map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </span>
              ))}
              {skillsArray.length > 5 && (
                <span className="px-3 py-1.5 bg-gray-100 text-secondary-lighter text-sm font-medium rounded-full">
                  +{skillsArray.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
            onClick={() => handleSendRequest("ignored", user._id)}
            disabled={isLoading}
            aria-label="Pass on this connection"
          >
            {isLoading && actionType === 'ignored' ? (
              <svg className="animate-spin-slow h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            Pass
          </button>
          <button 
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={() => handleSendRequest("interested", user._id)}
            disabled={isLoading}
            aria-label="Send connection request"
          >
            {isLoading && actionType === 'interested' ? (
              <svg className="animate-spin-slow h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            )}
            Connect
          </button>
        </div>
        
        <button
          onClick={handleStartChat}
          disabled={isCreatingChat}
          className="btn-primary w-full mt-3 flex items-center justify-center gap-2"
          aria-label="Start chat"
        >
          {isCreatingChat ? (
            <svg className="animate-spin-slow h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </>
          )}
        </button>
      </div>
    </div>
    <UserProfileModal user={user} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default UserCard;
