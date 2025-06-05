import React, { useEffect } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store)=>store.user); 

  const fetchUser = async()=>{
    try{
      const res = await axios.get(BASE_URL+"/profile/view",{withCredentials:true});
      dispatch(addUser(res.data));
    }
    catch(err){
      if(err.status === 401){ //Unauthorized Access
        return navigate("/login");
      }
      console.log(err);
    }
  }

  useEffect(()=>{
    if(!user){
      fetchUser();
    }
  },[])
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Body
