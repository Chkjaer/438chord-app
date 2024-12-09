/* global scales_chords_api_onload */
import React, { useState, useEffect } from "react";
import { db } from './firebase';
import { auth } from "./firebase";
import { collection, addDoc, getDocs, disablePersistentCacheIndexAutoCreation} from "firebase/firestore";

const ChordGenerator = ({ user, addChordToList, savedChords, displayedChord}) => {
  const [chordName, setChordName] = useState(null); // State to store the chord data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] =  useState("veryImportant");
  const [chordNames, setChordNames] = useState([]);

  const veryImportantChordNames = [
    "C", "Cm", "C#", "C#m", "D", "Dm", "D#", "D#m", "E", "Em", "F", "Fm", "F#", "F#m", "G", "Gm", "G#", "G#m", "A", "Am", "A#", "A#m", "B", "Bm", "C/E", "C/G", "Cm/D#", "Cm/G", "Db", "Dbm", "Eb", "Ebm", "Gb", "Gbm", "Ab", "Abm", "Bb", "Bbm", "Cm/Eb",
  ];
  const frequentlyUsedChordNames = [
    "C7", "C#7", "C#m7", "C#dim7", "Cm7", "Cdim7", "Csus4", "Csus2", "C5", "C#sus4", "C#sus2", "C#5",
"D7", "Dm7", "Ddim7", "Dsus4", "Dsus2", "D5", "D#7", "D#m7", "D#dim7", "D#sus4", "D#sus2", "D#5",
"E7", "Em7", "Edim7", "Esus4", "Esus2", "E5", "F7", "Fm7", "Fdim7", "Fsus4", "Fsus2", "F5", "F#7",
"F#m7", "F#dim7", "F#sus4", "F#sus2", "F#5", "G7", "Gm7", "Gdim7", "Gsus4", "Gsus2", "G5", "G#7",
"G#m7", "G#dim7", "G#sus4", "G#sus2", "G#5", "A7", "Am7", "Adim7", "Asus4", "Asus2", "A5", "A#7",
"A#m7", "A#dim7", "A#sus4", "A#sus2", "A#5", "B7", "Bm7", "Bdim7", "Bsus4", "Bsus2", "B5", "Csus4\\F",
"Csus4\\G", "Cm7\\D#", "Cdim7\\A", "C7\\G", "C7\\E", "Db7", "Dbm7", "Dbdim7", "Dbsus4", "Dbsus2", "Db5",
"Eb7", "Ebm7", "Ebdim7", "Ebsus4", "Ebsus2", "Eb5", "Gb7", "Gbm7", "Gbdim7", "Gbsus4", "Gbsus2", "Gb5",
"Ab7", "Abm7", "Abdim7", "Absus4", "Absus2", "Ab5", "Bb7", "Bbm7", "Bbdim7", "Bbsus4", "Bbsus2", "Bb5",
"Cm7\\Eb"
  ];
  const occasionallyUsedChordNames = [
    "C6", "Cm6", "C6/9", "Cmaj7", "C7b5", "C#6", "C#m6", "C#6/9", "C#maj7", "C#7b5", "C#m7b5", "C#9", "Cm7b5", "C9", "Cm11", "C7sus4", "C7sus2", "Caug", "Cdim", "C#m11", "C#7sus4", "C#7sus2", "C#aug", "C#dim", "D6", "Dm6", "D6/9", "Dmaj7", "D7b5", "Dm7b5", "D9", "Dm11", "D7sus4", "D7sus2", "Daug", "Ddim", "D#6", "D#m6", "D#6/9", "D#maj7", "D#7b5", "D#m7b5", "D#9", "D#m11", "D#7sus4", "D#7sus2", "D#aug", "D#dim", "E6", "Em6", "E6/9", "Emaj7", "E7b5", "Em7b5", "E9", "Em11", "E7sus4", "E7sus2", "Eaug", "Edim", "F6", "Fm6", "F6/9", "Fmaj7", "F7b5", "Fm7b5", "F9", "Fm11", "F7sus4", "F7sus2", "Faug", "Fdim", "F#6", "F#m6", "F#6/9", "F#maj7", "F#7b5", "F#m7b5", "F#9", "F#m11", "F#7sus4", "F#7sus2", "F#aug", "F#dim", "G6", "Gm6", "G6/9", "Gmaj7", "G7b5", "Gm7b5", "G9", "Gm11", "G7sus4", "G7sus2", "Gaug", "Gdim", "G#6", "G#m6", "G#6/9", "G#maj7", "G#7b5", "G#m7b5", "G#9", "G#m11", "G#7sus4", "G#7sus2", "G#aug", "G#dim", "A6", "Am6", "A6/9", "Amaj7", "A7b5", "Am7b5", "A9", "Am11", "A7sus4", "A7sus2", "Aaug", "Adim", "A#6", "A#m6", "A#6/9", "A#maj7", "A#7b5", "A#m7b5", "A#9", "A#m11", "A#7sus4", "A#7sus2", "A#aug", "A#dim", "B6", "Bm6", "B6/9", "Bmaj7", "B7b5", "Bm7b5", "B9", "Bm11", "B7sus4", "B7sus2", "Baug", "Bdim", "C6\\G", "C6/9\\E", "C6/9\\G", "Cmaj7\\G", "Cm6\\A", "C7sus4\\G", "C9\\G", "Db6", "Dbm6", "Db6/9", "Dbmaj7", "Db7b5", "Dbm7b5", "Db9", "Dbm11", "Db7sus4", "Db7sus2", "Dbaug", "Dbdim", "Eb6", "Ebm6", "Eb6/9", "Ebmaj7", "Eb7b5", "Ebm7b5", "Eb9", "Ebm11", "Eb7sus4", "Eb7sus2", "Ebaug", "Ebdim", "Gb6", "Gbm6", "Gb6/9", "Gbmaj7", "Gb7b5", "Gbm7b5", "Gb9", "Gbm11", "Gb7sus4", "Gb7sus2", "Gbaug", "Gbdim", "Ab6", "Abm6", "Ab6/9", "Abmaj7", "Ab7b5", "Abm7b5", "Ab9", "Abm11", "Ab7sus4", "Ab7sus2", "Abaug", "Abdim", "Bb6", "Bbm6", "Bb6/9", "Bbmaj7", "Bb7b5", "Bbm7b5", "Bb9", "Bbm11", "Bb7sus4", "Bb7sus2", "Bbaug", "Bbdim"
  ];
  const rarelyUsedChords = [
    "C7#5", "C#7#5", "C#m(maj7)", "C#9b5", "Cm(maj7)", "C9b5", "C9#5", "Cmaj9", "Cm9", "C13", "Cmaj13", "Cm13", "C9sus4", "C9sus2", "C#9#5", "C#maj9", "C#m9", "C#13", "C#maj13", "C#m13", "C#9sus4", "C#9sus2", "D7#5", "Dm(maj7)", "D9b5", "D9#5", "Dmaj9", "Dm9", "D13", "Dmaj13", "Dm13", "D9sus4", "D9sus2", "D#7#5", "D#m(maj7)", "D#9b5", "D#9#5", "D#maj9", "D#m9", "D#13", "D#maj13", "D#m13", "D#9sus4", "D#9sus2", "E7#5", "Em(maj7)", "E9b5", "E9#5", "Emaj9", "Em9", "E13", "Emaj13", "Em13", "E9sus4", "E9sus2", "F7#5", "Fm(maj7)", "F9b5", "F9#5", "Fmaj9", "Fm9", "F13", "Fmaj13", "Fm13", "F9sus4", "F9sus2", "F#7#5", "F#m(maj7)", "F#9b5", "F#9#5", "F#maj9", "F#m9", "F#13", "F#maj13", "F#m13", "F#9sus4", "F#9sus2", "G7#5", "Gm(maj7)", "G9b5", "G9#5", "Gmaj9", "Gm9", "G13", "Gmaj13", "Gm13", "G9sus4", "G9sus2", "G#7#5", "G#m(maj7)", "G#9b5", "G#9#5", "G#maj9", "G#m9", "G#13", "G#maj13", "G#m13", "G#9sus4", "G#9sus2", "A7#5", "Am(maj7)", "A9b5", "A9#5", "Amaj9", "Am9", "A13", "Amaj13", "Am13", "A9sus4", "A9sus2", "A#7#5", "A#m(maj7)", "A#9b5", "A#9#5", "A#maj9", "A#m9", "A#13", "A#maj13", "A#m13", "A#9sus4", "A#9sus2", "B7#5", "Bm(maj7)", "B9b5", "B9#5", "Bmaj9", "Bm9", "B13", "Bmaj13", "Bm13", "B9sus4", "B9sus2", "Cmaj9\\E", "Cm9\\D#", "C9sus4\\G", "C9#5\\E", "C13\\A#", "Db7#5", "Dbm(maj7)", "Db9b5", "Db9#5", "Dbmaj9", "Dbm9", "Db13", "Dbmaj13", "Dbm13", "Db9sus4", "Db9sus2", "Eb7#5", "Ebm(maj7)", "Eb9b5", "Eb9#5", "Ebmaj9", "Ebm9", "Eb13", "Ebmaj13", "Ebm13", "Eb9sus4", "Eb9sus2", "Gb7#5", "Gbm(maj7)", "Gb9b5", "Gb9#5", "Gbmaj9", "Gbm9", "Gb13", "Gbmaj13", "Gbm13", "Gb9sus4", "Gb9sus2", "Ab7#5", "Abm(maj7)", "Ab9b5", "Ab9#5", "Abmaj9", "Abm9", "Ab13", "Abmaj13", "Abm13", "Ab9sus4", "Ab9sus2", "Bb7#5", "Bbm(maj7)", "Bb9b5", "Bb9#5", "Bbmaj9", "Bbm9", "Bb13", "Bbmaj13", "Bbm13", "Bb9sus4", "Bb9sus2", "Cm9\\Eb", "C13\\Bb"
  ];

  useEffect(() => {
    if (displayedChord) {
      setChordName(displayedChord);
    }
  }, [displayedChord])

  const getRandomChord = () => {
    const randomIndex = Math.floor(Math.random() * chordNames.length);
    return chordNames[randomIndex];
  };
  
   // Update chord names when category changes
   useEffect(() => {
    switch (selectedCategory) {
      case "veryImportant":
        setChordNames(veryImportantChordNames);
        break;
      case "frequentlyUsed":
        setChordNames(frequentlyUsedChordNames);
        break;
      case "occasionallyUsed":
        setChordNames(occasionallyUsedChordNames);
        break;
      case "rarelyUsed":
        setChordNames(rarelyUsedChords);
        break;
      default:
        setChordNames(veryImportantChordNames);
    }
  }, [selectedCategory]);

  const generateChord = async () => {
    try {
        const randomChord = getRandomChord();
        setError(null); //to clear previous errors
        setLoading(true)
        setChordName(randomChord); // Save the chord data in state
    } catch (e) {
        console.error("Error fetching chord:", e);
        setError("Oof having some trouble grabbing you a chord my homie...")
    } finally {
        setLoading(false);
    }
  };

  const saveChord = async () => {
    if (!user) {
      setError("You must be logged in to save chords!");
      return;
    }

    if(savedChords.includes(chordName)) {
      alert("This chord is already saved!");
      return;
    }

    try {
      await addDoc(collection(db, auth.currentUser.uid), {
        chordName,
        timestamp: new Date(),
      });
      addChordToList(chordName);
      // alert("Chord saved!");
    } catch (e) {
      console.error("Error saving chord:", e);
      setError("Failed to save chord.");
    }
  };

  const loadScalesChordsScript = () => {
    const scriptId = "scales-chords-api";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = "https://www.scales-chords.com/api/scales-chords-api.js";
      document.body.appendChild(script);
      script.onload = () => {
        console.log("Scales-Chords API script loaded.");
        if (typeof scales_chords_api_onload === "function") {
          window.scales_chords_api = scales_chords_api_onload;
        } else {
          console.error("scales_chords_api_onload is not defined in the script.");
        }
      };

      script.onerror = () => console.error("Failed to load Scales-Chords API script.");
    }

  };
  useEffect(() => {
    loadScalesChordsScript();
    if (window.scales_chords_api) {
      console.log(`processing chord: ${chordName}`);
      window.scales_chords_api(); // Reprocess `<ins>` tags
    } else {
      console.error("scales_chords_api not avialable")
    }
  }, [chordName]);

  const categorizeChords = (chords) => {
    return {
      veryImportant: chords.filter((chord) => veryImportantChordNames.includes(chord)),
      frequentlyUsed: chords.filter((chord) => frequentlyUsedChordNames.includes(chord)),
      occasionallyUsed: chords.filter((chord) => occasionallyUsedChordNames.includes(chord)),
      rarelyUsed: chords.filter((chord) => rarelyUsedChords.includes(chord)),
    };
  };

  // useEffect(() => {
  //   const categorized = categorizeChords(savedChords);
  //   updateCategorizedChords(categorized);
  // }, [savedChords, updateCategorizedChords]);
  
  return (
    <section>
      <div className="ChordArea">
      <div className="chordCategorySelector">
        <label htmlFor="category">Select Chord Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="veryImportant">Very Important</option>
          <option value="frequentlyUsed">Frequently Used</option>
          <option value="occasionallyUsed">Occasionally Used</option>
          <option value="rarelyUsed">Rarely Used</option>
        </select>
      </div>
      <button onClick={generateChord}>Generate Chord</button>
      {loading && <p>Fetching your chord...</p>}
        {chordName ? (
          <div>
          <h3>Chord: {chordName}</h3>
          <ins
            className="scales_chords_api"
            chord={chordName}
          ></ins>
          <button onClick={saveChord} style={{margin: "20px"}}>Save Chord</button>
          <ins
          className="scales_chords_api"
          chord={chordName}
          output="sound"
          style={{border: "1px green !important;", offsetposition: "15px top;"}}>
        </ins>
          </div>
      ) : (
        <p>No Chord Yet.</p>
      )}
        </div>
      {error && <p className="error">{error}</p>}
      </section>
  );
}

export default ChordGenerator;