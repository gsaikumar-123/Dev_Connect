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
    <div className='flex items-center w-1/4 bg-base-300 m-2 p-4 gap-4 rounded-lg'>
      <div>
        <img className="w-16 h-16 rounded-full"src={photoUrl} alt="User Photo" />
      </div>
      <div className='text-left w-1/3'>
        <p className='font-bold'>{firstName+" "+lastName}</p>
        {age && gender && <p>{age + "," + gender}</p>}
        <p>{about}</p>
      </div>
      {sign && 
        <div className=''>
            <button className="btn btn-primary p-2 m-2" onClick={()=>handleRequest("rejected",user._id)}>Reject</button>
            <button className="btn btn-secondary p-2" onClick={()=>handleRequest("accepted",user._id)}>Accept</button>
        </div>
      }
    </div>
  )
}

export default ConnectionCard;
