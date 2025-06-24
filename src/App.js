import React, { useState } from 'react';
import MoodInput from './MoodInput';
import FaceMoodDetector from './FaceMoodDetector'; // ✅ import webcam detector

function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [mood, setMood] = useState('');
  const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1.2;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
};

   
  const moodDisplayData = {
  happy: {
    emoji: "😄",
    quote: "Happiness is contagious—spread it!",
    bgColor: "#fffbe7"
  },
  sad: {
    emoji: "😢",
    quote: "Even the darkest night will end and the sun will rise.",
    bgColor: "#e0f7fa"
  },
  angry: {
    emoji: "😠",
    quote: "Speak when you are angry—and you'll make the best speech you'll ever regret.",
    bgColor: "#ffe0e0"
  },
  fearful: {
    emoji: "😨",
    quote: "Fear is only as deep as the mind allows.",
    bgColor: "#ede7f6"
  },
  surprised: {
    emoji: "😲",
    quote: "Surprise is the greatest gift life can grant us.",
    bgColor: "#f3e5f5"
  },
  disgusted: {
    emoji: "🤢",
    quote: "Disgust is often just a signal for change.",
    bgColor: "#e0f2f1"
  },
  neutral: {
    emoji: "😐",
    quote: "Sometimes being neutral is the best choice.",
    bgColor: "#f5f5f5"
  }
};

  const mapMoodToGenre = (mood) => {
    const moodMap = {
      happy: "happy upbeat",
      sad: "calm lo-fi",
      angry: "instrumental rock",
      fearful: "soft piano",
      surprised: "edm",
      disgusted: "ambient",
      neutral: "acoustic chill"
    };
    return moodMap[mood] || (mood + " music");
  };

  // 🔁 Common fetch logic used by text input and camera mood
  const fetchMusicByMood = async (moodInput) => {
    const genre = mapMoodToGenre(moodInput);
    setMood(moodInput);
document.body.style.backgroundColor = moodDisplayData[moodInput]?.bgColor || "#fff";
const moodData = moodDisplayData[moodInput];
if (moodData) {
  speak(`Your mood is ${moodInput}. ${moodData.quote}`);
}

    setLoading(true);
    setNoResult(false);
    setTracks([]);

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(genre)}&media=music&limit=12`
      );
      const data = await response.json();

      if (data.results.length === 0) {
        setNoResult(true);
      } else {
        const formattedTracks = data.results.map(track => ({
          name: track.trackName,
          artist: track.artistName,
          img: track.artworkUrl100.replace('100x100bb.jpg', '300x300bb.jpg'),
          preview: track.previewUrl
        }));
        setTracks(formattedTracks);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setNoResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Poppins, Arial', padding: '40px' }}>
      <h1>🎙️ MoodCast AI</h1>
      <p>Your AI Radio Host & Mood Buddy</p>

      {/* 🎯 Text Mood Input */}
      <MoodInput onSubmit={fetchMusicByMood} />

      {/* 📷 Face Detection Mode */}
      <h3 style={{ marginTop: '40px' }}>OR Use Camera to Detect Your Mood</h3>
     <FaceMoodDetector onMoodDetected={fetchMusicByMood} />


      {/* 🧠 Detected Mood Display */}
      {mood && (
  <div style={{
    backgroundColor: moodDisplayData[mood]?.bgColor || '#f0f0f0',
    padding: '20px',
    marginTop: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: '0.4s'
  }}>
    <h2 style={{ fontSize: '24px' }}>
      {moodDisplayData[mood]?.emoji || '🧠'} Detected Mood: <strong>{mood.toUpperCase()}</strong>
    </h2>
    <p style={{ fontStyle: 'italic', marginTop: '10px' }}>
      "{moodDisplayData[mood]?.quote || 'No quote found.'}"
    </p>
  </div>
)}


      {/* 🔄 Loading / No result */}
      {loading && <p style={{ fontSize: '18px', marginTop: '30px' }}>🔄 Loading songs...</p>}
      {noResult && !loading && <p style={{ fontSize: '18px', marginTop: '30px' }}>😔 No songs found for this mood.</p>}

      {/* 🎵 Tracks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        {tracks.map((track, index) => (
          <div key={index} style={{
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <img src={track.img} alt={track.name} style={{ width: '100%', borderRadius: '8px' }} />
            <h4 style={{ margin: '10px 0 5px' }}>{track.name}</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{track.artist}</p>
            {track.preview ? (
              <audio controls style={{ width: '100%', marginTop: '10px' }}>
                <source src={track.preview} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#999' }}><i>No preview available</i></p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
