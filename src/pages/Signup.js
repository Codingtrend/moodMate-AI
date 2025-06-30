// ✅ Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleSignup = (e) => {
  e.preventDefault();
  if (email && password) {
    const nameFromEmail = email.split('@')[0].replace(/\./g, ' ');
    const properName = nameFromEmail
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', properName);
    localStorage.setItem('email', email);

    navigate('/dashboard');
  }
};


  return (
    <div style={container}>
      <form onSubmit={handleSignup} style={formStyle}>
        <h2>Join MoodMate</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Sign Up</button>
      </form>
    </div>
  );
}

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'linear-gradient(to right, #36d1dc, #5b86e5)'
};

const formStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  width: '100%',
  maxWidth: '400px',
  fontFamily: 'Poppins'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#6200ee',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default Signup;
