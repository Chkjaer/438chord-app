import './App.css';
import React, {useEffect, useState} from 'react';
import ChordGenerator from './ChordGenerator';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { auth } from "./firebase";
import { collection, query, getDocs, deleteDoc, doc} from "firebase/firestore";


function Home() {
  const [user, setUser] = useState(null);
  const [savedChords, setSavedChords] = useState([])
  const [displayedChord, setDisplayedChord] = useState(null);
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

  
  useEffect(() => {
    if (user) {
      fetchSavedChords();
      }}, [user]);

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

  const fetchSavedChords = async () => {
    try {
      const q = query(
        collection(db, auth.currentUser.uid )
      );
      const querySnapshot = await getDocs(q);
      const chords = querySnapshot.docs.map((doc) => doc.data().chordName,
        );
      setSavedChords(chords);
    } catch (e) {
      console.error("Error Fetching saved chords:", e);
    }
    };
   

  const addChordToList = (chord) => {
    setSavedChords((prevChords) => {
    if (prevChords.includes(chord)) {
      console.error(`${chord} is already in the list!`);
      return prevChords; // Return the current list if the chord already exists
    }
    return [...prevChords, chord];
  });
};

// // Function to delete a chord
// const deleteChord = async (chordName) => {
//   try {
//     // Find the chord document in Firestore
//     const chordDoc = savedChords.find((chord) => chord.chordName === chordName);
//     if (!chordDoc) {
//       alert("Chord not found.");
//       return;
//     }

//     const chordRef = doc(db, `users/${user.uid}/savedChords`, chordDoc.id);

//     // Delete the document
//     await deleteDoc(chordRef);

//     // Update local state
//     setSavedChords((prevChords) => prevChords.filter((chord) => chord.chordName !== chordName));

//     alert("Chord deleted successfully!");
//   } catch (e) {
//     console.error("Error deleting chord:", e);
//     alert("Failed to delete chord.");
//   }
//};

return (
    <div className="App">
      <header className="App-header">
      <h1>Chord Declogger</h1>
      {!user ? (
        <div className="Account-Group">
          <h4>Sign-in to Save Chords!</h4>
          <button className="header-btn" onClick={() => navigate("/login")}>Login</button>
          </div>
      ) : (
        <div className="Account-Group">
          <h4>Welcome, {user.email}</h4>
          <button className="header-btn" onClick={HandleSignOut}>Sign out</button>
        </div>
      )}
        </header>
      <div className="container">
        <div className = "main-content">
          <ChordGenerator user={user} addChordToList={addChordToList} savedChords={savedChords} displayedChord={displayedChord}/>
        </div>
        </div>
        <div>
          {user && savedChords.length > 0 && (
            <div>
              <h2>Saved Chords</h2>
              <ul>
                {savedChords.map((chord, index) => (
                  <li key={index}> 
                  <button onClick={() => setDisplayedChord(chord)}>
                  {chord}
                  </button>
                {/* <button 
                  className="trash-button"
                  onClick={() => deleteChord(chord)}></button> */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
}

export default Home;
