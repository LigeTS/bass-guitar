import React, { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import './BassGuitar.css';

const BassGuitar = () => {
  // State for tracking vibrating strings and active techniques
  const [vibratingStrings, setVibratingStrings] = useState({});
  const [playingTechnique, setPlayingTechnique] = useState('fingered');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [volume, setVolume] = useState(0.8);
  
  // Bass guitar strings with enhanced data
  const strings = [
    { note: 'E', frequency: '41.2 Hz', color: '#8B4513', openFreq: 82.41 },
    { note: 'A', frequency: '55.0 Hz', color: '#A0522D', openFreq: 110.0 },
    { note: 'D', frequency: '73.4 Hz', color: '#CD853F', openFreq: 146.83 },
    { note: 'G', frequency: '98.0 Hz', color: '#D2691E', openFreq: 196.0 }
  ];

  // Fret positions (semitone multipliers)
  const frets = [0, 1, 2, 3, 4, 5]; // Open string + 5 frets

  // Playing techniques with different tone characteristics
  const techniques = {
    fingered: { 
      label: '👆 Fingered', 
      type: 'sawtooth', 
      attack: 0.1, 
      release: 1.5,
      volume: 1.0 
    },
    picked: { 
      label: '🥄 Picked', 
      type: 'square', 
      attack: 0.02, 
      release: 1.0,
      volume: 1.2 
    },
    slap: { 
      label: '✋ Slap', 
      type: 'triangle', 
      attack: 0.01, 
      release: 0.8,
      volume: 1.5 
    }
  };

  // Enhanced tone generation with technique variations
  const playTone = async (note, fret = 0, technique = playingTechnique) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      // Calculate frequency with fret position
      const baseFreq = strings.find(s => s.note === note).openFreq;
      const frequency = baseFreq * Math.pow(2, fret / 12);
      
      const tech = techniques[technique];
      
      // Set up audio nodes
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure based on technique
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = tech.type;
      
      // Filter settings for different techniques
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(
        technique === 'slap' ? 8000 : technique === 'picked' ? 5000 : 3000,
        audioContext.currentTime
      );
      
      // Volume envelope
      const attackTime = tech.attack;
      const releaseTime = tech.release;
      const peakVolume = (tech.volume * volume * 0.3);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(peakVolume, audioContext.currentTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + releaseTime);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + releaseTime);
      
      console.log(`${technique} ${note}${fret} at ${frequency.toFixed(2)}Hz`);
      
      // Record the note if recording
      if (isRecording) {
        setRecordedNotes(prev => [...prev, { note, fret, technique, time: Date.now() }]);
      }
      
    } catch (error) {
      console.error('Error playing tone:', error);
    }
  };

  // Play string with visual feedback
  const playString = (note, fret = 0) => {
    // First try to load actual sound file, fallback to synthesized tone
    const sound = new Howl({
      src: [`/sounds/bass-${note.toLowerCase()}.mp3`, `/sounds/bass-${note.toLowerCase()}.wav`],
      volume: volume,
      onloaderror: () => {
        playTone(note, fret);
      }
    });
<<<<<<< HEAD
    
    if (sound._src[0]) {
      sound.play();
    }
    
    // Add vibration effect
    const stringKey = `${note}-${fret}`;
    setVibratingStrings(prev => ({ ...prev, [stringKey]: true }));
    
    // Remove vibration after animation
    setTimeout(() => {
      setVibratingStrings(prev => {
        const newState = { ...prev };
        delete newState[stringKey];
        return newState;
      });
    }, 500);
  };

  // Play recorded sequence
  const playRecording = () => {
    if (recordedNotes.length === 0) return;
    
    const startTime = recordedNotes[0].time;
    recordedNotes.forEach(note => {
      const delay = note.time - startTime;
      setTimeout(() => {
        playString(note.note, note.fret);
      }, delay / 2); // Play at 2x speed for demo
    });
=======
    sound.play();
  };

  // Fallback function to generate simple tones
  const playTone = async (note) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context if it's suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Set frequencies for each bass string
      const frequencies = {
        'E': 82.41,  // E2
        'A': 110.0,  // A2
        'D': 146.83, // D3
        'G': 196.0   // G3
      };
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequencies[note], audioContext.currentTime);
      oscillator.type = 'sawtooth'; // Gives a richer bass sound
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);
      
      console.log(`Generated tone for ${note} at ${frequencies[note]}Hz`);
    } catch (error) {
      console.error('Error playing tone:', error);
    }
>>>>>>> 41779c3fc61bf8233fedc8aaeea1f41883ab5341
  };

<<<<<<< HEAD
  // Clear recording
  const clearRecording = () => {
    setRecordedNotes([]);
  };

  // Simple test function
  const testAudio = async () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      console.log('Test audio played - if no sound, check volume/speakers');
    } catch (error) {
      console.error('Error playing test audio:', error);
    }
  };

=======
  // Simple test function
  const testAudio = async () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context if it's suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      console.log('Test audio played - if no sound, check volume/speakers');
    } catch (error) {
      console.error('Error playing test audio:', error);
    }
  };

>>>>>>> 41779c3fc61bf8233fedc8aaeea1f41883ab5341
  return (
    <div className="bass-guitar-container">
      <h1>Interactive Bass Guitar Studio</h1>
      
<<<<<<< HEAD
      {/* Controls Panel */}
      <div className="controls-panel">
        <div className="technique-selector">
          <label>Playing Technique:</label>
          {Object.entries(techniques).map(([key, tech]) => (
            <button
              key={key}
              className={`technique-btn ${playingTechnique === key ? 'active' : ''}`}
              onClick={() => setPlayingTechnique(key)}
            >
              {tech.label}
            </button>
          ))}
        </div>
        
        <div className="volume-control">
          <label htmlFor="volume">Volume: {Math.round(volume * 100)}%</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
        
        <div className="recording-controls">
          <button
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? '⏹️ Stop Recording' : '🔴 Record'}
          </button>
          <button onClick={playRecording} disabled={recordedNotes.length === 0}>
            ▶️ Play Recording
          </button>
          <button onClick={clearRecording} disabled={recordedNotes.length === 0}>
            🗑️ Clear
          </button>
          <span className="note-count">
            {recordedNotes.length} notes recorded
          </span>
        </div>
        
        <button onClick={testAudio} className="test-btn">
          🔊 Test Audio
        </button>
      </div>
      
=======
      {/* Test button */}
      <button onClick={testAudio} style={{margin: '10px', padding: '10px', fontSize: '16px'}}>
        🔊 Test Audio
      </button>
      
>>>>>>> 41779c3fc61bf8233fedc8aaeea1f41883ab5341
      <div className="bass-guitar">
        {/* Enhanced Neck with clickable frets */}
        <div className="neck">
          {frets.map(fret => (
            <div key={fret} className="fret" style={{ left: `${60 + fret * 48}px` }}>
              {fret > 0 && <span className="fret-number">{fret}</span>}
            </div>
          ))}
          {/* Fret markers */}
          <div className="fret-marker" style={{ left: '156px' }}></div>
          <div className="fret-marker" style={{ left: '252px' }}></div>
        </div>
        
        {/* Enhanced Strings with fret positions */}
        <div className="strings">
          {strings.map((string, index) => (
            <div key={string.note} className="string-container">
              {/* String line with fret positions */}
              <div
                className={`string ${vibratingStrings[`${string.note}-0`] ? 'vibrating' : ''}`}
                style={{ 
                  backgroundColor: string.color,
                  top: `${20 + index * 60}px`
                }}
              >
                {/* Fret positions on string */}
                {frets.map(fret => (
                  <div
                    key={fret}
                    className="fret-position"
                    style={{ left: `${20 + fret * 48}px` }}
                    onClick={() => playString(string.note, fret)}
                  >
                    <span className="string-label">
                      {string.note}{fret > 0 ? `+${fret}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Body */}
        <div className="body">
          <div className="pickups">
            <div className="pickup" />
            <div className="pickup" />
          </div>
          
          {/* Bass type selector */}
          <div className="bass-type-selector">
            <div className="bass-type active">Electric</div>
          </div>
        </div>
      </div>
      
      <div className="instructions">
        <p>🎸 Click anywhere on the strings to play notes</p>
        <p>🎯 Click closer to the body for open strings, closer to the neck for higher frets</p>
        <p>🎵 Try different playing techniques and record your bass lines!</p>
      </div>
    </div>
  );
};

export default BassGuitar;