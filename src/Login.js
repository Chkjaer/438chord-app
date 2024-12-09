import React, {useState} from 'react';

import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    function LoginUser(e) {
        e.preventDefault();
        setError();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            navigate("/");
        })
        .catch((error) => {
            setError(error.message)
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
            <form onSubmit={LoginUser}>
            <h2>Log In</h2>
            <div className='input-group'>
                <label htmlFor="email">Email: </label>
                <input
                value={email}
                type="email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='input-group'>
                <label htmlFor="password">Password: </label>
                <input
                value={password}
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">
                Log in
            </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <p className="signup-link">
          New user? <Link to="/signup">Sign up here</Link>
        </p>
        </div>
      </div>
    );
  }
        
export default Login;