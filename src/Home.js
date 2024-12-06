import './App.css';
import React, {useEffect, useState} from 'react';
import ChordGenerator from './ChordGenerator';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { auth } from "./firebase";


function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    
    return () => unsubscribe();
  }, []);


  const HandleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
        navigate('/'); // Redirect to login page after sign-out
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

return (
    <div className="App">
      <header className="App-header">
      <h1>Chord Declogger</h1>
      {!user ? (
        <button className="header-btn" onClick={() => navigate("/login")}>Login</button>
      ) : (
        <div>
          <h3>Welcome, {user.email}</h3>
          <button className="header-btn" onClick={HandleSignOut}>signOut</button>
        </div>
      )}
        </header>
      <div className="container">
        <div className = "main-content">
          <ChordGenerator />
        </div>
        </div>
      </div>
    );
}

export default Home;
