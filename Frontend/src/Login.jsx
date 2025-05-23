import React from 'react'
import axios from 'axios';


const Login = () => {
    const [emailId, setEmailId] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:1234/login", {
                emailId,
                password
            }, { withCredentials: true });

            console.log("Login success", res.data);
            
        } catch (err) {
            console.error("Login failed", err.response?.data || err.message);
        }
    };



  return (
    <div className='flex justify-center'>
      <div className="card card-dash bg-base-300 w-96 ">
        <div className="card-body">
            <h2 className="card-title justify-center">Login</h2>
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
                    placeholder="mail@gmail.com" 
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
                    placeholder="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />

            </label>

            <div className="card-actions justify-center my-4">
                <button className="btn btn-primary justify-centre" onClick={handleLogin}>Sign in</button>
            </div>
        </div>
    </div>

    </div>
  )
}

export default Login
