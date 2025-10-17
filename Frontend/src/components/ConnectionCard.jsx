import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeRequest } from '../utils/requestsSlice';

const ConnectionCard = ({user,sign}) => {
    const {firstName, lastName, gender, photoUrl, age, about} = user || user.fromUserId;
    const dispatch = useDispatch();
    
    const handleRequest = async (status,_id)=>{
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
    }
  return (
    <div className='card-modern flex flex-col sm:flex-row items-center gap-4 p-5 mx-auto max-w-2xl mb-4 hover:shadow-soft transition-shadow duration-200'>
      <div className="flex-shrink-0">
        <div className="relative">
          <img 
            className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20" 
            src={photoUrl} 
            alt={`${firstName} ${lastName}`}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white"></div>
        </div>
      </div>
      
      <div className='flex-1 text-center sm:text-left min-w-0'>
        <h3 className='text-lg font-bold text-secondary truncate'>
          {firstName} {lastName}
        </h3>
        {age && gender && (
          <p className="text-secondary-lighter text-sm font-medium mt-0.5">
            {age} years • {gender}
          </p>
        )}
        {about && (
          <p className="text-secondary-lighter text-sm mt-2 line-clamp-2">
            {about}
          </p>
        )}
      </div>
      
      {sign && (
        <div className='flex gap-2 flex-shrink-0'>
          <button 
            className="btn-secondary px-5 py-2"
            onClick={() => handleRequest("rejected", user._id)}
          >
            Decline
          </button>
          <button 
            className="btn-primary px-5 py-2"
            onClick={() => handleRequest("accepted", user._id)}
          >
            Accept
          </button>
        </div>
      )}
    </div>
  )
}

export default ConnectionCard;
