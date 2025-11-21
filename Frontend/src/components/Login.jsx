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
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleIsLogin = ()=>{
        setIsLogin(!isLogin);
    }
    const handleSignUp = async () => {
        setError("");
        setIsLoading(true);
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
        finally{
            setIsLoading(false);
        }
    }

    const handleLogin = async () => {
        setError("");
        setIsLoading(true);
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
        finally{
            setIsLoading(false);
        }
    };

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-64px)] py-12 px-4'>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2 dark:text-gray-100">
            {isLogin ? "Welcome Back" : "Join DevConnect"}
          </h1>
          <p className="text-secondary-lighter dark:text-gray-300">
            {isLogin ? "Sign in to continue your journey" : "Start connecting with developers"}
          </p>
        </div>

        {/* Card */}
        <div className="card-modern p-8">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
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
                  <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
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
                <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
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
                <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e)=> setPassword(e.target.value)}
                      className="input-field pl-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-lighter hover:text-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <p className='text-red-600 text-sm font-medium text-center dark:text-red-400'>{error}</p>
              </div>
            )}

            <button 
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2" 
              onClick={isLogin ? handleLogin : handleSignUp}
              disabled={isLoading || !emailId || !password || (!isLogin && (!firstName || !lastName))}
              aria-busy={isLoading}
            >
              {isLoading && (
                <svg className="animate-spin-slow h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
            </button>

            <div className="mt-6 text-center">
                <p className="text-secondary-lighter text-sm dark:text-gray-300">
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
        <p className="text-center text-secondary-lighter text-xs mt-6 dark:text-gray-400">
          By continuing, you agree to DevConnect's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default Login;
