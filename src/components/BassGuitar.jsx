import React, { useState } from 'react';
import { Howl } from 'howler';
import './BassGuitar.css';

const BassGuitar = () => {
  // State for tracking vibrating strings and active techniques
  const [vibratingStrings, setVibratingStrings] = useState({});
  const [playingTechnique, setPlayingTechnique] = useState('fingered');
  const [volume, setVolume] = useState(0.8);
  
  // Bass guitar strings with enhanced data
  const strings = [
    { note: 'E', frequency: '41.2 Hz', color: '#8B4513', openFreq: 82.41 },
    { note: 'A', frequency: '55.0 Hz', color: '#A0522D', openFreq: 110.0 },
    { note: 'D', frequency: '73.4 Hz', color: '#CD853F', openFreq: 146.83 },
    { note: 'G', frequency: '98.0 Hz', color: '#D2691E', openFreq: 196.0 }
  ];

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
  const playTone = async (note, technique = playingTechnique) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      // Get base frequency
      const baseFreq = strings.find(s => s.note === note).openFreq;
      
      const tech = techniques[technique];
      
      // Set up audio nodes
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure based on technique
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
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
      
      console.log(`${technique} ${note} at ${baseFreq.toFixed(2)}Hz`);
      
    } catch (error) {
      console.error('Error playing tone:', error);
    }
  };

  // Play string with visual feedback
  const playString = (note) => {
    // First try to load actual sound file, fallback to synthesized tone
    const sound = new Howl({
      src: [`/sounds/bass-${note.toLowerCase()}.mp3`, `/sounds/bass-${note.toLowerCase()}.wav`],
      volume: volume,
      onloaderror: () => {
        playTone(note);
      }
    });
    
    sound.play();
    
    // Add vibration effect
    setVibratingStrings(prev => ({ ...prev, [note]: true }));
    
    // Remove vibration after animation
    setTimeout(() => {
      setVibratingStrings(prev => {
        const newState = { ...prev };
        delete newState[note];
        return newState;
      });
    }, 500);
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

  return (
    <div className="bass-guitar-container">
      <h1>Interactive Bass Guitar</h1>
      
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
        
        <button onClick={testAudio} className="test-btn">
          🔊 Test Audio
        </button>
      </div>
      
      <div className="bass-guitar">
        {/* Neck of the bass */}
        <div className="neck">
          {/* Frets */}
         {[1, 2, 3, 4, 5].map(fret => (
  <div key={fret} className="fret" style={{ '--fret-index': fret }}>
    {[1, 4].includes(fret) && <div className="fret-marker" />}
  </div>
))}
        </div>
        
        {/* Strings */}
        <div className="strings">
         {strings.map((string, index) => (
  <div
    key={string.note}
    className={`string ${vibratingStrings[string.note] ? 'vibrating' : ''}`}
    style={{ 
      backgroundColor: string.color,
      top: `${50 + index * 65}px`  /* Changed from 10 + index * 40px */
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
        <p>🎸 Click on any string to play its sound!</p>
        <p>🎵 Try different playing techniques for different tones</p>
        <p>🔊 Adjust the volume to your preference</p>
      </div>
    </div>
  );
};

export default BassGuitar;