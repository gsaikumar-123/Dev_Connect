import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionsSlice'
import ConnectionCard from './ConnectionCard'

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store)=>store.connections);

    const fetchConnections= async ()=>{
        try{
            const res = await axios.get(
                BASE_URL+"/user/connections",{withCredentials:true}
            );
            console.log(res?.data?.connections);
            dispatch(addConnections(res?.data?.connections));
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchConnections();
    },[]);

    if(!connections || connections.length===0) return (
      <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4'>
        <div className="text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className='font-bold text-3xl text-secondary mb-2'>No Connections Yet</h2>
          <p className='text-secondary-lighter text-lg'>Start connecting with developers!</p>
        </div>
      </div>
    )
    
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className="text-center mb-10">
        <h1 className='font-bold text-4xl text-secondary mb-2'>Your Connections</h1>
        <p className="text-secondary-lighter">People you're connected with</p>
      </div>
      
      <div className="space-y-4">
        {connections.map((connection) => (
          <ConnectionCard key={connection._id} user={connection} />
        ))}
      </div>
    </div>
  )
}

export default Connections
