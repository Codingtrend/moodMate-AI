const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getPlaylistForMood } = require('./spotify');
const { getAdvice } = require('./controllers/gptController');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/playlist/:mood', async (req, res) => {
  const playlist = await getPlaylistForMood(req.params.mood);
  res.json(playlist);
});

app.get('/advice/:mood', async (req, res) => {
  const advice = await getAdvice(req.params.mood);
  res.json({ advice });
});

app.listen(5000, () => console.log('Server running on port 5000'));