import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { setTheme } from '../utils/themeSlice'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store)=>store.user); 

  const fetchUser = async()=>{
    try {
      const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        return navigate("/login");
      }
      console.log(err);
    }
  }

  const themeMode = useSelector(store => store.theme.mode);

  useEffect(()=>{
    if(!user){
      fetchUser();
    }
    // apply theme on mount and whenever it changes
  },[])

  useEffect(() => {
    // Ensure theme class & persistence
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (themeMode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', themeMode);
    }
  }, [themeMode]);
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  )
}

export default Body
