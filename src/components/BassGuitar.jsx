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

  // Function to play sound (we'll add sound files later)
  const playString = (note) => {
    console.log(`Playing bass string: ${note}`);
    
    // For now, we'll use placeholder - later we'll add actual sound files
    // const sound = new Howl({
    //   src: [`/sounds/bass-${note.toLowerCase()}.mp3`]
    // });
    // sound.play();
  };

  return (
    <div className="bass-guitar-container">
      <h1>Interactive Bass Guitar</h1>
      
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