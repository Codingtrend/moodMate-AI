const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getTracksForMood } = require('./itunes'); // ✅ changed from spotify
const { getAdvice } = require('./controllers/gptController');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/tracks/:mood', async (req, res) => {
  const mood = req.params.mood;
  console.log(`🎧 Mood received from frontend: ${mood}`);

  try {
    const result = await getTracksForMood(mood);
    console.log("🎵 iTunes returned data:", result);

    if (!result.tracks || result.tracks.length === 0) {
      return res.status(404).json({ error: 'No songs found for this mood' });
    }

    res.json({ tracks: result.tracks });
  } catch (error) {
    console.error("🔥 Error:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/advice/:mood', async (req, res) => {
  try {
    const advice = await getAdvice(req.params.mood);
    res.json({ advice });
  } catch (error) {
    console.error('Error in /advice/:mood endpoint:', error);
    res.status(500).json({ error: 'Failed to get advice.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
