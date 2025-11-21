import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests } from '../utils/requestsSlice'
import ConnectionCard from './ConnectionCard'

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store)=>store.requests);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchRequests= async ()=>{
        setIsLoading(true);
        try{
            const res = await axios.get(
                BASE_URL+"/user/requests",{withCredentials:true}
            );
            console.log(res.data.data);
            dispatch(addRequests(res?.data?.data));
        }
        catch(err){
            console.log(err);
        }
        finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchRequests();
    },[]);

    if(isLoading) return (
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className="text-center mb-10">
          <div className="skeleton h-10 w-72 mx-auto mb-2"></div>
          <div className="skeleton h-6 w-52 mx-auto"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-modern flex items-center gap-5 p-6">
              <div className="skeleton w-20 h-20 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-6 w-40"></div>
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-10 w-24"></div>
                <div className="skeleton h-10 w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )

    if(!requests || requests.length===0) return (
      <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 animate-fade-in'>
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className='font-bold text-3xl text-secondary mb-3 dark:text-gray-100'>No Requests</h2>
          <p className='text-secondary-lighter text-lg leading-relaxed dark:text-gray-300'>You have no pending connection requests at the moment</p>
        </div>
      </div>
    )
    
  return (
    <div className='max-w-4xl mx-auto px-4 py-8 sm:py-12'>
      <div className="text-center mb-8 sm:mb-10">
        <h1 className='font-bold text-3xl sm:text-4xl text-secondary mb-2 dark:text-gray-100'>Connection Requests</h1>
        <p className="text-secondary-lighter text-sm sm:text-base dark:text-gray-300">
          {requests.length} pending {requests.length === 1 ? 'request' : 'requests'}
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {requests.map((request, index) => (
          <div key={`${request._id}-${index}`} style={{animationDelay: `${index * 50}ms`}} className="animate-fade-in">
            <ConnectionCard user={request} sign={1} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Requests;
