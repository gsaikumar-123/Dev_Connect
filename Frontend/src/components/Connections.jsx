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

    if(!connections || connections.length===0) return <div className='text-center'><h1 className='font-bold text-2xl'>Connections</h1> <h1>No Connections found</h1> </div>
  return (
    <div>
        <h1 className='font-bold text-2xl text-center'>Connections</h1>
      {
        connections.map((connection)=>(
            <div key={connection._id}><ConnectionCard user={connection}/></div>
        ))
      }
    </div>
  )
}

export default Connections
