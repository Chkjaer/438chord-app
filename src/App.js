import './App.css';
import React, {useEffect, useState} from 'react';
import ChordGenerator from './ChordGenerator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>Chord Declogger</h1>
      </header>
      <div className="container">
        <div className = "main-content">
        <ChordGenerator />
          <button>Play Chord</button>
        </div>
        </div>
    </div>
  );
}


export default App;
