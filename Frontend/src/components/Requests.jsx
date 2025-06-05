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

    if(!requests || requests.length===0) return <div className='text-center'><h1 className='font-bold text-2xl'>Requests</h1> <h1>No Requests found</h1> </div>
  return (
    <div>
      {
        requests.map((request)=>(
            <div key={request._id}><ConnectionCard user={request} sign={1}/></div>
        ))
      }
    </div>
  )
}

export default Requests;
