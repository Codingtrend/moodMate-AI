import React, { useState } from 'react';

function MoodInput({ onSubmit }) {
  const [mood, setMood] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit(mood);
      setMood('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Enter your mood (e.g., happy, sad, chill)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '1rem',
          width: '300px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
      <button type="submit" style={{
        marginLeft: '10px',
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#6200EE',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Get Songs
      </button>
    </form>
  );
}

export default MoodInput;
