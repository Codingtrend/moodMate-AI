// moodcast-ai/src/App.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Import all your page and component files
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Result from './pages/Result';
import History from './pages/History';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { moodDisplayData } from './utils/MoodMap';

function App() {
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [mood, setMood] = useState('');
  const [advice, setAdvice] = useState('');
  const [tracks, setTracks] = useState([]); // State to store the array of tracks
  const [playlist, setPlaylist] = useState(null); // State to store the playlist object

  const navigate = useNavigate();

  // Function for text-to-speech
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.cancel(); // Stop any ongoing speech
    speechSynthesis.speak(utterance);
  };

  // Main function to fetch music and advice based on mood
  const fetchMusicByMood = async (moodInput) => {
    setLoading(true); // Start loading animation
    setMood(moodInput); // Set the current mood
    setNoResult(false); // Reset no result flag
    setTracks([]); // Clear previous tracks
    setPlaylist(null); // Clear previous playlist

    // Update body background color based on mood
    document.body.style.backgroundColor = moodDisplayData[moodInput]?.bgColor || '#fff';

    // Speak mood-related quote
    const currentMoodData = moodDisplayData[moodInput];
    if (currentMoodData) {
      speak(`Your mood is ${moodInput}. ${currentMoodData.quote}`);
    }

    // Update mood history in local storage
    localStorage.setItem('lastMood', moodInput);
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const newHistory = [{ mood: moodInput, time: new Date().toLocaleString() }, ...history];
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));

    try {
      // 1. Fetch music (tracks and playlist) from your backend
      // Corrected: Target the new /tracks endpoint
      const musicResponse = await fetch(`http://localhost:5000/tracks/${moodInput}`); // Change /playlist to /tracks
      const musicData = await musicResponse.json();

      if (musicResponse.ok && musicData.tracks && musicData.tracks.length > 0) {
        setTracks(musicData.tracks); // Update tracks state with fetched data
        setPlaylist(musicData.playlist); // Update playlist state with fetched data
        setNoResult(false); // Songs found
      } else {
        setNoResult(true); // No songs found
        setTracks([]);
        setPlaylist(null);
      }

      // 2. Fetch advice from your backend
      const adviceResponse = await fetch(`http://localhost:5000/advice/${moodInput}`);
      const adviceData = await adviceResponse.json();
      setAdvice(adviceData.advice || ''); // Set advice

      // Navigate to dashboard after successful data fetch
      navigate('/dashboard');
    } catch (err) {
      console.error('Error fetching mood-based data:', err);
      setNoResult(true); // Show no result on error
      setTracks([]); // Clear tracks on error
      setPlaylist(null);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard
              fetchMusicByMood={fetchMusicByMood}
              mood={mood}
              loading={loading}
              noResult={noResult}
              advice={advice}
              tracks={tracks} // Pass the tracks array to Dashboard
              playlist={playlist} // Pass the playlist object to Dashboard
            />
          </PrivateRoute>
        }
      />

      <Route
        path="/result"
        element={
          <PrivateRoute>
            <Result
              loading={loading}
              noResult={noResult}
              mood={mood}
              advice={advice}
              tracks={tracks} // Also pass tracks to Result if it displays them
              playlist={playlist}
            />
          </PrivateRoute>
        }
      />

      {/* Other routes */}
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;