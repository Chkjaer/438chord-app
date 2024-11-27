/* global scales_chords_api_onload */

import React, { useState, useEffect } from "react";
const ChordGenerator = () => {
  const [chordName, setChordName] = useState(null); // State to store the chord data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const chordNames = [
    "C", "Cm", "C#", "C#m", "D", "Dm", "D#", "D#m", "E", "Em", "F", "Fm", "F#", "F#m", "G", "Gm", "G#", "G#m", "A", "Am", "A#", "A#m", "B", "Bm", "C/E", "C/G", "Cm/D#", "Cm/G", "Db", "Dbm", "Eb", "Ebm", "Gb", "Gbm", "Ab", "Abm", "Bb", "Bbm", "Cm/Eb",
  ];

  const getRandomChord = () => {
    const randomIndex = Math.floor(Math.random() * chordNames.length);
    return chordNames[randomIndex];
  };

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
  
  return (
    <section>
    <button onClick={generateChord}>Generate Chord</button>
    {loading && <p>Fetching your chord...</p>}
      {chordName ? (
        <div>
          <h3>Chord: {chordName}</h3>
        <ins
          className="scales_chords_api"
          chord={chordName}
        ></ins>
        </div>
      ) : (
        <p>No Chord Yet.</p>
      )}
      {error && <p className="error">{error}</p>}
      </section>
  );
}

export default ChordGenerator;