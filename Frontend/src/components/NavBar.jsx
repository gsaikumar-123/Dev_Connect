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
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to={user ? "/": "/login"} 
              className="text-2xl font-bold text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <span className="text-primary">Dev</span>Connect
            </Link>
          </div>

          {/* User Section */}
          {user && (
            <div className="flex items-center gap-6">
              <span className="text-secondary-lighter text-sm font-medium hidden sm:block">
                Welcome, <span className="text-secondary font-semibold">{user.firstName}</span>
              </span>
              
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      alt="User Avatar"
                      src={user.photoUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <ul
                  tabIndex={0}
                  className="menu dropdown-content mt-3 w-56 p-2 bg-white rounded-xl shadow-soft border border-gray-100 z-[1]"
                >
                  <li>
                    <Link 
                      to="/profile" 
                      className="text-secondary hover:text-primary hover:bg-accent py-3 px-4 rounded-lg flex items-center justify-between group"
                    >
                      <span className="font-medium">Edit Profile</span>
                      <span className="badge bg-primary/10 text-primary border-none text-xs font-semibold">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/connections" 
                      className="text-secondary hover:text-primary hover:bg-accent py-3 px-4 rounded-lg font-medium"
                    >
                      Connections
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/requests" 
                      className="text-secondary hover:text-primary hover:bg-accent py-3 px-4 rounded-lg font-medium"
                    >
                      Requests
                    </Link>
                  </li>
                  <li className="mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={handleLogOut} 
                      className="text-red-600 hover:bg-red-50 py-3 px-4 rounded-lg font-medium w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
