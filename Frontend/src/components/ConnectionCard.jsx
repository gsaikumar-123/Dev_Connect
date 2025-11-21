import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeRequest } from '../utils/requestsSlice';
import { useNavigate } from 'react-router-dom';
import { setActiveConversation } from '../utils/chatSlice';
import { removeConnectionById } from '../utils/connectionsSlice';
import UserProfileModal from './UserProfileModal';
import ConfirmDialog from './ConfirmDialog';

const ConnectionCard = ({user,sign}) => {
    const userData = user.fromUserId || user;
    const {firstName, lastName, gender, photoUrl, age} = userData;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [actionType, setActionType] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);
    const [isCreatingChat, setIsCreatingChat] = React.useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    
    const handleRequest = async (status,_id)=>{
        setIsLoading(true);
        setActionType(status);
        try{
            await axios.post(
                BASE_URL+"/request/review/"+ status +"/" + _id,
                {},
                {withCredentials:true},
            )
            dispatch(removeRequest(_id));
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

  return (
    <>
    <div className='card-modern flex flex-col sm:flex-row items-center gap-5 p-6 mx-auto max-w-2xl hover:shadow-soft transition-all duration-300 animate-fade-in'>
      <div className="flex-shrink-0 cursor-pointer" onClick={() => setShowModal(true)}>
        <div className="relative group">
          <img 
            className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300" 
            src={photoUrl} 
            alt={`${firstName} ${lastName}`}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className='flex-1 text-center sm:text-left min-w-0 cursor-pointer' onClick={() => setShowModal(true)}>
        <h3 className='text-xl font-bold text-secondary dark:text-gray-100 truncate mb-1'>
          {firstName} {lastName}
        </h3>
        {age && gender && (
          <div className="flex items-center justify-center sm:justify-start gap-2 text-secondary-lighter dark:text-gray-300 text-sm font-medium">
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
      
      {sign && (
        <div className='flex flex-col sm:flex-row gap-2 flex-shrink-0 w-full sm:w-auto'>
          <button 
            className="btn-secondary px-5 py-2.5 flex items-center justify-center gap-2"
            onClick={() => handleRequest("rejected", user._id)}
            disabled={isLoading}
            aria-label="Decline connection request"
          >
            {isLoading && actionType === 'rejected' ? (
              <svg className="animate-spin-slow h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            Decline
          </button>
          <button 
            className="btn-primary px-5 py-2.5 flex items-center justify-center gap-2"
            onClick={() => handleRequest("accepted", user._id)}
            disabled={isLoading}
            aria-label="Accept connection request"
          >            {isLoading && actionType === 'accepted' ? (
              <svg className="animate-spin-slow h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            Accept
          </button>
        </div>
      )}
      {/* Show chat + unfriend only for established connections (sign false) */}
      {!sign && (
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleStartChat}
            disabled={isCreatingChat}
            className="btn-primary px-5 py-2.5 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            aria-label="Start chat"
          >
            {isCreatingChat ? (
              <svg className="animate-spin-slow h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat
              </>
            )}
          </button>
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="btn-secondary px-5 py-2.5 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            aria-label="Unfriend user"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Unfriend
          </button>
        </div>
      )}
    </div>
    <UserProfileModal user={user} isOpen={showModal} onClose={() => setShowModal(false)} />
    <ConfirmDialog
      isOpen={showConfirmDialog}
      onConfirm={async () => {
        setShowConfirmDialog(false);
        try {
          const res = await axios.delete(BASE_URL + '/connection/remove/' + user._id, { withCredentials: true });
          if(res.data?.success){
            dispatch(removeConnectionById(user._id));
          }
        } catch (err) {
          console.error('Error removing connection', err);
        }
      }}
      onCancel={() => setShowConfirmDialog(false)}
      message="Remove this connection?"
    />
    </>
  )
}

export default ConnectionCard;
