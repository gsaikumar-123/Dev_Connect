import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeFromFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  const handleSendRequest = async (status,userId)=>{
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
  }

  const { firstName, lastName, about, photoUrl, age, gender, skills } = user;

  console.log(user);

  return (
    <div className="card-modern overflow-hidden w-full max-w-md mx-auto group">
      <figure className="relative h-80 overflow-hidden">
        <img 
          src={photoUrl} 
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </figure>
      
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-secondary mb-1">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-secondary-lighter text-sm font-medium">
              {age} years • {gender}
            </p>
          )}
        </div>

        {about && (
          <p className="text-secondary-lighter leading-relaxed mb-4 line-clamp-3">
            {about}
          </p>
        )}

        {skills.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 4).map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-secondary-lighter text-sm font-medium rounded-full">
                  +{skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            className="btn-secondary flex-1"
            onClick={() => handleSendRequest("ignored", user._id)}
          >
            Pass
          </button>
          <button 
            className="btn-primary flex-1"
            onClick={() => handleSendRequest("interested", user._id)}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
