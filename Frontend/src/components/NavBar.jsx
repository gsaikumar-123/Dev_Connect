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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogOut = async ()=>{
    await axios.post(BASE_URL+"/logout",{},{withCredentials:true});
    dispatch(removeUser());
    navigate("/login");
    setMobileMenuOpen(false);
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to={user ? "/user/feed": "/login"} 
              className="text-2xl font-bold text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <span className="text-primary">Dev</span>Connect
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  to="/user/feed" 
                  className="text-secondary-lighter hover:text-primary font-medium transition-colors px-3 py-2 rounded-lg hover:bg-accent"
                >
                  Feed
                </Link>
                <Link 
                  to="/connections" 
                  className="text-secondary-lighter hover:text-primary font-medium transition-colors px-3 py-2 rounded-lg hover:bg-accent"
                >
                  Connections
                </Link>
                <Link 
                  to="/requests" 
                  className="text-secondary-lighter hover:text-primary font-medium transition-colors px-3 py-2 rounded-lg hover:bg-accent"
                >
                  Requests
                </Link>
                
                <div className="h-6 w-px bg-gray-200"></div>
                
                <span className="text-secondary-lighter text-sm font-medium hidden lg:block">
                  Welcome, <span className="text-secondary font-semibold">{user.firstName}</span>
                </span>
                
                <div className="dropdown dropdown-end">
                  <div 
                    tabIndex={0} 
                    role="button" 
                    className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200"
                    aria-label="User menu"
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
                        className="text-secondary hover:text-primary hover:bg-accent py-3 px-4 rounded-lg flex items-center gap-3 group"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Edit Profile</span>
                      </Link>
                    </li>
                    <li className="mt-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={handleLogOut} 
                        className="text-red-600 hover:bg-red-50 py-3 px-4 rounded-lg font-medium w-full text-left flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-secondary hover:bg-accent transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-accent rounded-lg">
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <p className="text-secondary font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-secondary-lighter text-sm">View Profile</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link 
                to="/user/feed" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-accent rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Feed
              </Link>
              <Link 
                to="/connections" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-accent rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Connections
              </Link>
              <Link 
                to="/requests" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-accent rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Requests
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-accent rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Edit Profile
              </Link>
              <button 
                onClick={handleLogOut}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium w-full transition-colors mt-2 border-t border-gray-100 pt-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar;
