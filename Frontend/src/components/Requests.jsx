import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests } from '../utils/requestsSlice'
import ConnectionCard from './ConnectionCard'

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store)=>store.requests);

    const fetchRequests= async ()=>{
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
    }

    useEffect(()=>{
        fetchRequests();
    },[]);

    if(!requests || requests.length===0) return (
      <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4'>
        <div className="text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className='font-bold text-3xl text-secondary mb-2'>No Requests</h2>
          <p className='text-secondary-lighter text-lg'>You have no pending connection requests</p>
        </div>
      </div>
    )
    
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className="text-center mb-10">
        <h1 className='font-bold text-4xl text-secondary mb-2'>Connection Requests</h1>
        <p className="text-secondary-lighter">Review and respond to requests</p>
      </div>
      
      <div className="space-y-4">
        {requests.map((request) => (
          <ConnectionCard key={request._id} user={request} sign={1} />
        ))}
      </div>
    </div>
  )
}

export default Requests;
