import React from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { removeUser } from '../utils/userSlice';

const NavBar = () => {
  const user = useSelector((store)=>store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = async ()=>{
    await axios.post(BASE_URL+"/logout",{},{withCredentials:true});
    dispatch(removeUser());
    navigate("/login");
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to={user ? "/": "/login"} className="btn btn-ghost text-xl">Dev_Connect</Link>
        </div>
        {user && <div className="flex gap-2 items-center">Welcome, {user.firstName}
            <div className="dropdown dropdown-end mx-10">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User Photo"
                    src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                  <Link to="/profile" className="justify-between">
                    Edit Profile
                    <span className="badge">New</span>
                  </Link> 
                </li>
                <li><Link to="/connections">Connections</Link></li>
                <li><Link to="/requests">Requests</Link></li>
                <li><button onClick={handleLogOut}>Logout</button></li>
              </ul>
            </div>
        </div>}
      </div>
  )
}

export default NavBar;
