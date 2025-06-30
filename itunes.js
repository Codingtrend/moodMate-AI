// itunes.js
const axios = require('axios');

async function getTracksForMood(mood) {
  const moodMap = {
    happy: 'happy upbeat music',
    sad: 'melancholy instrumental',
    angry: 'aggressive rock',
    surprised: 'pop surprise',
    disgusted: 'calming ambient',
    fearful: 'soothing instrumental',
    neutral: 'lofi chill'
  };

  const query = moodMap[mood] || `${mood} music`;

  try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: query,
        media: 'music',
        limit: 10
      }
    });

    const tracks = response.data.results.map(track => ({
      id: track.trackId,
      name: track.trackName,
      artist: track.artistName,
      img: track.artworkUrl100.replace('100x100bb.jpg', '300x300bb.jpg'),
      preview: track.previewUrl
    }));

    return { tracks };
  } catch (error) {
    console.error('❌ Error fetching tracks from iTunes:', error.message);
    return { tracks: [] };
  }
}

module.exports = { getTracksForMood };
