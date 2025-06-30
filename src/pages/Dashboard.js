// ✅ Dashboard.js (final version for iTunes-based setup)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHistory, FaHome, FaMoon, FaSun, FaSignOutAlt, FaUser } from 'react-icons/fa';
import MoodInput from '../MoodInput';
import FaceMoodDetector from '../FaceMoodDetector';
import { moodDisplayData } from '../utils/MoodMap';

function Dashboard({ fetchMusicByMood, tracks = [], mood = '', loading = false, noResult = false, advice = '' }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const userName = localStorage.getItem('userName') || 'Guest';

  useEffect(() => {
    document.body.style.background = darkMode ? '#1e1e1e' : 'linear-gradient(to right, #ffecd2, #fcb69f)';
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const moodData = moodDisplayData[mood];

  return (
    <div style={styles.layout}>
      <div style={{ ...styles.sidebar, background: darkMode ? '#181818' : '#ffffffcc', backdropFilter: 'blur(10px)' }}>
        <div style={styles.logo}>🎧 MoodMate</div>
        <div style={styles.menuItem} onClick={() => navigate('/dashboard')}><FaHome /> Dashboard</div>
        <div style={styles.menuItem} onClick={() => navigate('/history')}><FaHistory /> History</div>
        <div style={styles.menuItem} onClick={() => navigate('/profile')}><FaUser /> Profile</div>
        <div style={styles.menuItem} onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode
        </div>
        <div style={styles.menuItem} onClick={() => {
          localStorage.clear();
          navigate('/');
        }}><FaSignOutAlt /> Logout</div>
      </div>

      <div style={{ ...styles.main, color: darkMode ? '#fff' : '#000' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ ...styles.card, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div style={styles.headerRow}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>👋 Hello, {userName}</h2>
            <p style={styles.subheading}>Let’s find your perfect mood-based music</p>
          </div>

          <div style={styles.section}><h3>📝 Enter Your Mood</h3><MoodInput onSubmit={fetchMusicByMood} /></div>
          <div style={styles.section}><h3>📷 Or Use Camera</h3><FaceMoodDetector onMoodDetected={fetchMusicByMood} /></div>

          {mood && (
            <motion.div style={{ ...styles.moodBox, backgroundColor: moodData?.bgColor || '#eee' }}>
              <h2>{moodData?.emoji} Mood: {mood.toUpperCase()}</h2>
              <p style={styles.quote}>{moodData?.quote}</p>
            </motion.div>
          )}

          {advice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                marginTop: '20px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeeba',
                padding: '15px 20px',
                borderRadius: '12px',
                fontStyle: 'italic',
                color: '#856404'
              }}
            >
              💡 <strong>Advice:</strong> {advice}
            </motion.div>
          )}

          {loading ? (
            <div className="spinner" style={{ marginTop: '30px' }} />
          ) : noResult ? (
            <p style={styles.noResult}>😔 No songs found for this mood</p>
          ) : (
            <motion.div className="song-grid" style={styles.grid}>
              {tracks.map((track, index) => (
                <motion.div key={index} whileHover={{ scale: 1.04 }} style={styles.trackCard}>
                  <img src={track.img} alt={track.name} style={styles.trackImg} />
                  <h4>{track.name}</h4>
                  <p style={styles.artist}>{track.artist}</p>
                  {track.preview && (
                    <audio controls style={styles.audio}>
                      <source src={track.preview} type="audio/mp4" />
                    </audio>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Poppins, sans-serif'
  },
  sidebar: {
    width: '240px',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontSize: '1rem',
    borderRight: '1px solid #e5e5e5'
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center'
  },
 menuItem: (darkMode) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  fontWeight: '500',
  color: darkMode ? '#f5f5f5' : '#222'
}),

  main: {
    flex: 1,
    padding: '40px 20px',
    overflowY: 'auto'
  },
  card: {
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.1)',
    maxWidth: '1100px',
    margin: 'auto'
  },
  headerRow: {
    marginBottom: '30px'
  },
  subheading: {
    color: '#777',
    fontSize: '1rem'
  },
  section: {
    marginBottom: '30px'
  },
  moodBox: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '12px'
  },
  quote: {
    fontStyle: 'italic',
    fontSize: '0.95rem'
  },
  noResult: {
    fontSize: '1.1rem',
    color: '#777',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginTop: '20px'
  },
  trackCard: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
  },
  trackImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '10px'
  },
  artist: {
    fontSize: '0.9rem',
    color: '#666'
  },
  audio: {
    width: '100%',
    marginTop: '10px'
  }
};
export default Dashboard;
