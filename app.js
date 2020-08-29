require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

app.get('/artist-search', (req, res, next)=>{ 
    res.render("layout") 
    let selectedArtist = req.query.artist
    spotifyApi
    .searchArtists(selectedArtist)
    .then(data => {
      let researchItems = data.body.artists;
      res.render(__dirname + "/views/artist-search-results", researchItems)    
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

  
app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    let albums = data.body.items
  })
  .catch(err => console.log('Error while searching album'))
});

// Our routes go here:

app.listen(3005, () => console.log('My Spotify project running on port 3005 🎧 🥁 🎸 🔊'));
