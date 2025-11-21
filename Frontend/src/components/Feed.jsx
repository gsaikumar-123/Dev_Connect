import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed, appendFeed } from '../utils/feedSlice'
import UserCard from './UserCard'



const Feed = () => {
  const feed = useSelector((store)=>(store.feed ?? []));
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const currentPageRef = React.useRef(1);

  const getFeed = async(pageNum, append = false)=>{
    if (!append) setIsLoading(true);
    else setIsLoadingMore(true);
    try{
      const res = await axios.get(BASE_URL+"/user/feed?page="+pageNum+"&limit=20",{withCredentials:true});
      const newUsers = res?.data?.data || [];
      if (append) {
        dispatch(appendFeed(newUsers));
        currentPageRef.current = pageNum;
      } else {
        dispatch(addFeed(newUsers));
      }
      if (newUsers.length < 20) {
        setHasMore(false);
      }
    } 
    catch(err){
      console.log(err?.response?.data);
      setHasMore(false);
    }
    finally{
      if (!append) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  };

  useEffect(()=>{
    getFeed(1);
  },[]);

  useEffect(() => {
    if (feed.length <= 10 && hasMore && !isLoading && !isLoadingMore) {
      const nextPage = currentPageRef.current + 1;
      getFeed(nextPage, true);
    }
  }, [feed.length, hasMore, isLoading, isLoadingMore]);

  if(isLoading && feed.length === 0) return (
    <div className='flex justify-center py-12 px-4'>
      <div className="card-modern overflow-hidden w-full max-w-md mx-auto">
        <div className="skeleton h-80 w-full rounded-none"></div>
        <div className="p-6 space-y-4">
          <div className="skeleton h-8 w-2/3"></div>
          <div className="skeleton h-4 w-1/3"></div>
          <div className="skeleton h-16 w-full"></div>
          <div className="flex gap-2">
            <div className="skeleton h-8 w-20 rounded-full"></div>
            <div className="skeleton h-8 w-20 rounded-full"></div>
            <div className="skeleton h-8 w-20 rounded-full"></div>
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-12 flex-1 rounded-lg"></div>
            <div className="skeleton h-12 flex-1 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )

  if(!feed || feed.length===0) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-secondary mb-3">No More Users</h2>
        <p className="text-secondary-lighter text-lg leading-relaxed">You've seen all available developers! Check back later for new connections.</p>
      </div>
    </div>
  )

  return (
    <div className='flex justify-center py-12 px-4'>
        {feed.length>0 && <UserCard user={feed[0]}/>}
    </div>
  )
}

export default Feed
