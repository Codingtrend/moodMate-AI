import React, { useState, useEffect } from 'react';

import { moodDisplayData } from '../utils/MoodMap';



function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setHistory(storedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('moodHistory');
    setHistory([]);
  };

  return (
    
    <div style={{ padding: '40px', fontFamily: 'Poppins, Arial' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📈 Your Mood History</h2>

      {history.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>No mood history yet.</p>
      ) : (
        <>
          <ul style={{ maxWidth: '600px', margin: 'auto', listStyle: 'none', padding: 0 }}>
            {history.map((entry, i) => {
              const moodData = moodDisplayData[entry.mood] || {};
              return (
                <li key={i} style={{
                  backgroundColor: '#f9f9f9',
                  padding: '12px 18px',
                  marginBottom: '12px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    {moodData.emoji || '🙂'} <strong>{entry.mood.toUpperCase()}</strong>
                  </span>
                  <span style={{ color: '#555', fontSize: '0.9rem' }}>{entry.time}</span>
                </li>
              );
            })}
          </ul>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={clearHistory}
              style={{
                backgroundColor: '#6200ee',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Clear History
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default History;
