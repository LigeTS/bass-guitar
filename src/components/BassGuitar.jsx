import React from 'react';
import { Howl } from 'howler';
import './BassGuitar.css';

const BassGuitar = () => {
  // Bass guitar strings (from thickest to thinnest)
  const strings = [
    { note: 'E', frequency: '41.2 Hz', color: '#8B4513' },
    { note: 'A', frequency: '55.0 Hz', color: '#A0522D' },
    { note: 'D', frequency: '73.4 Hz', color: '#CD853F' },
    { note: 'G', frequency: '98.0 Hz', color: '#D2691E' }
  ];

  // Function to play sound
  const playString = (note) => {
    console.log(`Playing bass string: ${note}`);
    
    // First try to load and play the sound file
    const sound = new Howl({
      src: [`/sounds/bass-${note.toLowerCase()}.mp3`, `/sounds/bass-${note.toLowerCase()}.wav`],
      volume: 0.8,
      onloaderror: () => {
        console.log(`Could not load sound file for ${note}. Using Web Audio API instead.`);
        // Fallback: Create a simple tone using Web Audio API
        playTone(note);
      }
    });
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
  };

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

  return (
    <div className="bass-guitar-container">
      <h1>Interactive Bass Guitar</h1>
      
      {/* Test button */}
      <button onClick={testAudio} style={{margin: '10px', padding: '10px', fontSize: '16px'}}>
        🔊 Test Audio
      </button>
      
      <div className="bass-guitar">
        {/* Neck of the bass */}
        <div className="neck">
          {/* Frets */}
          {[1, 2, 3, 4, 5].map(fret => (
            <div key={fret} className="fret" />
          ))}
        </div>
        
        {/* Strings */}
        <div className="strings">
          {strings.map((string, index) => (
            <div
              key={string.note}
              className="string"
              style={{ 
                backgroundColor: string.color,
                top: `${20 + index * 60}px`
              }}
              onClick={() => playString(string.note)}
            >
              <span className="string-label">
                {string.note} ({string.frequency})
              </span>
            </div>
          ))}
        </div>
        
        {/* Body of the bass */}
        <div className="body">
          <div className="pickups">
            <div className="pickup" />
            <div className="pickup" />
          </div>
        </div>
      </div>
      
      <div className="instructions">
        <p>Click on any string to play its sound!</p>
      </div>
    </div>
  );
};

export default BassGuitar;