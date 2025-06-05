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
    <div className='flex justify-center'>
      <div className="card card-dash bg-base-300 w-96 ">
        <div className="card-body">
            <h2 className="card-title justify-center">Login</h2>
            {!isLogin && 
            <>
            <legend className="fieldset-legend">First Name : </legend>
            <label className="input validator">
                <input 
                    type="text" 
                    placeholder="Enter your First Name" 
                    required
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </label>

            <legend className="fieldset-legend">Last Name : </legend>
            <label className="input validator">
                <input 
                    type="text" 
                    placeholder="Enter your Last Name" 
                    required
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                />
            </label>
            </>}

            <legend className="fieldset-legend">EmailId</legend>

            <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                </svg>
                <input 
                    type="email" 
                    placeholder="Enter your Mail" 
                    required
                    value={emailId} 
                    onChange={(e) => setEmailId(e.target.value)}
                />
            </label>

            <legend className="fieldset-legend">Password</legend>

            <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                </svg>
                
                <input
                    type="password"
                    required
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />

            </label>
            <p className='text-red-600'>{error}</p>
            <div className="card-actions justify-center my-4">
                <button className="btn btn-primary justify-centre" onClick={isLogin ? handleLogin: handleSignUp}>{isLogin?"Sign In" : "Sign Up"}</button>
            </div>

            <div className="flex items-center">
                <p>{isLogin ? "New to Dev_Connect? " : "Already a user? "}<span><button onClick={handleIsLogin} className="font-bold hover:underline">
                    {isLogin ? "Sign Up now" : "Login now"}
                </button></span></p>
                </div>
        </div>
    </div>

    </div>
  )
}

export default Login;
