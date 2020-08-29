require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  console.log('ok');
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', data.body);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res) => {  
  spotifyApi.getArtistAlbums(req.params.id).then(
    function(data) {
      console.log('Artist albums', data.body);
      res.render('albums', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/albums/:id/tracks', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id).then(
    function(data) {
      console.log('Album tracks', data.body);
      res.render('tracks', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
