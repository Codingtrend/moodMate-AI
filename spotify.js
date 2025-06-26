const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI || 'http://localhost:3000/callback',
});

async function getAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body['access_token']);
}

async function getPlaylistForMood(mood) {
  await getAccessToken();
  const moodMap = {
    happy: 'party',
    sad: 'chill',
    angry: 'metal',
    surprised: 'pop',
    disgusted: 'calm'
  };
  const genre = moodMap[mood] || 'lofi';

  const res = await spotifyApi.searchPlaylists(`${genre} music`);
  return res.body.playlists.items[0];
}

module.exports = { getPlaylistForMood };