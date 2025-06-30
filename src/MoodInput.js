import React, { useState } from 'react';

function MoodInput({ onSubmit }) {
  const [mood, setMood] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit(mood.toLowerCase().trim()); // normalize mood
      setMood('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
      <input
        type="text"
        placeholder="Type your mood e.g. happy, sad, chill..."
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        style={{
          padding: '12px',
          fontSize: '1rem',
          width: '280px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
          transition: 'border-color 0.3s ease',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          backgroundColor: '#6200EE',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#4500b5'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#6200EE'}
      >
        Get Songs
      </button>
    </form>
  );
}

export default MoodInput;
