// ✅ Landing.js (beautiful homepage with CTA buttons)
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #8360c3, #2ebf91)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🎵 MoodMate AI</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '500px' }}>
        Discover music that matches your mood! Use facial expressions or text input to let MoodMate suggest tracks tailored to your vibe.
      </p>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <button onClick={() => navigate('/login')} style={buttonStyle}>Login</button>
        <button onClick={() => navigate('/signup')} style={{ ...buttonStyle, backgroundColor: '#ff4081' }}>Sign Up</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '1rem',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  color: '#333',
  fontWeight: '600',
  transition: 'all 0.3s ease'
};

export default Landing;