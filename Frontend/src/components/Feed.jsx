import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'



const Feed = () => {
  const feed = useSelector((store)=>(store.feed));
  const dispatch = useDispatch();

  const getFeed = async()=>{
    if(feed.length>0) return;
    try{
      const res = await axios.get(BASE_URL+"/user/feed",{withCredentials:true});
      dispatch(addFeed(res?.data?.data));
    } 
    catch(err){
      console.log(err?.response?.data);
    }
  };

  useEffect(()=>{
    getFeed();
  },[]);

  if(!feed || feed.length===0) return <h1 className='text-bold text-2xl text-center'>No more new Users</h1>

  return (
    <div className='flex justify-center my-10'>
        {feed.length>0 && <UserCard user={feed[0]}/>}
    </div>
  )
}

export default Feed
