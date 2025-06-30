import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Chart.js Imports
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('email');

    if (!storedName || !storedEmail) {
      navigate('/login');
    } else {
      setName(storedName);
      setEmail(storedEmail);
    }

    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(history.slice(0, 10).reverse());
  }, [navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', name);
    localStorage.setItem('email', email);
    setMessage('✅ Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // ✅ Chart Data
  const chartData = {
    labels: moodHistory.map(entry => entry.time.split(',')[0]),
    datasets: [{
      label: 'Mood Level',
      data: moodHistory.map(entry => {
        const moodMap = { happy: 7, surprised: 6, neutral: 5, sad: 4, disgusted: 3, fearful: 2, angry: 1 };
        return moodMap[entry.mood.toLowerCase()] || 0;
      }),
      fill: false,
      borderColor: '#0072ff',
      tension: 0.4
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        min: 1,
        max: 7,
        ticks: {
          stepSize: 1,
          callback: val => {
            const labels = { 7: 'Happy', 6: 'Surprised', 5: 'Neutral', 4: 'Sad', 3: 'Disgusted', 2: 'Fearful', 1: 'Angry' };
            return labels[val] || '';
          }
        }
      }
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleUpdate} style={formStyle}>
        <h2 style={{ marginBottom: '20px' }}>👤 Your Profile</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <button type="submit" style={buttonStyle}>Save Changes</button>
        {message && <p style={successMsg}>{message}</p>}

        <h3 style={{ marginTop: '40px', marginBottom: '20px', fontSize: '1.5rem' }}>📊 Mood Trends</h3>
        {moodHistory.length === 0 ? (
          <p style={{ color: '#555' }}>No mood history to analyze.</p>
        ) : (
          <div style={{ maxWidth: '700px', margin: 'auto' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </form>
    </div>
  );
}

// ✅ Styling
const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '40px 20px',
  background: 'linear-gradient(to right, #00c6ff, #0072ff)'
};

const formStyle = {
  backgroundColor: '#fff',
  padding: '40px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  width: '100%',
  maxWidth: '500px',
  fontFamily: 'Poppins, sans-serif'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#0072ff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer'
};

const successMsg = {
  marginTop: '15px',
  color: 'green',
  fontWeight: '500'
};

export default Profile;
