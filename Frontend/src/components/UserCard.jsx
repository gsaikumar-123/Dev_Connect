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
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure>
        <img src={photoUrl} alt="User" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + "," + gender}</p>}
        {about && <p>{about}</p>}
        {skills.length>0 && (
          <p>{skills.join(", ")}</p>
        )}
        <div className="card-actions justify-between">
          <button className="btn btn-secondary" onClick={()=>handleSendRequest("ignored",user._id)}>Ignore</button>
          <button className="btn btn-primary" onClick={()=>handleSendRequest("interested",user._id)}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
