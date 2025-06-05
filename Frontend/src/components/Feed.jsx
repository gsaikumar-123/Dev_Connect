import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'



const Feed = () => {
  const feed = useSelector((store)=>(store.feed));
  const dispatch = useDispatch();

  const getFeed = async()=>{
    if(feed.length>0) return;
    try{
      const res = await axios.get(BASE_URL+"/user/feed",{withCredentials:true});
      dispatch(addFeed(res?.data?.data));
      console.log(res);
    } 
    catch(err){
      console.log(err?.response?.data);
    }
  };

  useEffect(()=>{
    getFeed();
  },[]);

  return (
    <div>
        This is Feed
    </div>
  )
}

export default Feed
