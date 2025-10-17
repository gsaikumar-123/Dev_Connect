import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';


const Login = () => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [lastName,setLastName] = useState("");
    const [firstName,setFirstName] = useState("");
    const [isLogin,setIsLogin] = useState(true); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleIsLogin = ()=>{
        setIsLogin(!isLogin);
    }
    const handleSignUp = async () => {
        try{
            const res = await axios.post(BASE_URL + "/signup",{
                emailId,
                password,
                firstName,
                lastName
            },{
                withCredentials:true
            });
            dispatch(addUser(res?.data?.data));
            navigate("/profile");
        }
        catch(err){
            const msg = err.response?.data?.message || "Sign Up failed. Please try again.";
            setError(msg);
        }
    }

    const handleLogin = async () => {
    try {
        const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password
        }, {
        withCredentials: true
        });

        dispatch(addUser(res.data));
        navigate("/user/feed");

    } catch (err) {
        const msg = err.response?.data?.message || "Login failed. Please try again.";
        setError(msg);
    }
    };

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-64px)] py-12 px-4'>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">
            {isLogin ? "Welcome Back" : "Join DevConnect"}
          </h1>
          <p className="text-secondary-lighter">
            {isLogin ? "Sign in to continue your journey" : "Start connecting with developers"}
          </p>
        </div>

        {/* Card */}
        <div className="card-modern p-8">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-secondary font-semibold mb-2 text-sm">
                    First Name
                  </label>
                  <input 
                      type="text" 
                      placeholder="John" 
                      required
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-secondary font-semibold mb-2 text-sm">
                    Last Name
                  </label>
                  <input 
                      type="text" 
                      placeholder="Doe" 
                      required
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field"
                  />
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                      type="email" 
                      placeholder="you@example.com" 
                      required
                      value={emailId} 
                      onChange={(e) => setEmailId(e.target.value)}
                      className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e)=> setPassword(e.target.value)}
                      className="input-field pl-12"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className='text-red-600 text-sm font-medium text-center'>{error}</p>
              </div>
            )}

            <button 
              className="btn-primary w-full mt-6" 
              onClick={isLogin ? handleLogin : handleSignUp}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>

            <div className="mt-6 text-center">
                <p className="text-secondary-lighter text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  {" "}
                  <button 
                    onClick={handleIsLogin} 
                    className="font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
            </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-secondary-lighter text-xs mt-6">
          By continuing, you agree to DevConnect's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default Login;
