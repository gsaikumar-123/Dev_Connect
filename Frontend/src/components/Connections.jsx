import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionsSlice'
import ConnectionCard from './ConnectionCard'

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store)=>store.connections);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchConnections= async ()=>{
        setIsLoading(true);
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
        finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchConnections();
    },[]);

    if(isLoading) return (
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className="text-center mb-10">
          <div className="skeleton h-10 w-64 mx-auto mb-2"></div>
          <div className="skeleton h-6 w-48 mx-auto"></div>
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
            </div>
          ))}
        </div>
      </div>
    )

    if(!connections || connections.length===0) return (
      <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 animate-fade-in'>
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className='font-bold text-3xl text-secondary mb-3'>No Connections Yet</h2>
          <p className='text-secondary-lighter text-lg leading-relaxed'>Start exploring and connecting with amazing developers!</p>
        </div>
      </div>
    )
    
  return (
    <div className='max-w-4xl mx-auto px-4 py-8 sm:py-12'>
      <div className="text-center mb-8 sm:mb-10">
        <h1 className='font-bold text-3xl sm:text-4xl text-secondary mb-2'>Your Connections</h1>
        <p className="text-secondary-lighter text-sm sm:text-base">
          {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {connections.map((connection, index) => (
          <div key={connection._id} style={{animationDelay: `${index * 50}ms`}} className="animate-fade-in">
            <ConnectionCard user={connection} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Connections
