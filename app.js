require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));// setting the spotify-api goes here:

// Our routes go here:

// Route pour la home
app.get('/',(req, res, next) => {
  res.render('home');
})

// Route pour pour la recherche
app.get('/artist-search', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    res.render('artist-search-results', {
      artists: data.body.artists.items // [ {}, {} ] // Les éléments que j'ai mis dans "artist-search-results" se trouvent dans data.body.artists.items 
    })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})

//Route pour obtenir tous les albums de l'artiste qu'on recherche
app.get('/albums/:artistId',(req,res,next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId) // utilisation des params
  .then(data => {
    res.render('albums', {
      albums: data.body.items
    })
  }) 
  .catch(err => console.log('Error',err));
})

//Route pour les morceaux de sons de l'album sur lequel on a cliqué
app.get('/tracks/:albumId',(req,res,next) => {
  spotifyApi
  .getAlbumTracks((req.params.albumId)) // Utilisation des params
  .then(data => {
    console.log('The received data for the songs: ', data.body.items); 
    res.render('tracks', {
      tracks: data.body.items
    })
  }) 
  .catch(err => console.log('Error', err));
})


app.listen(3005, () => console.log('My Spotify project running on port 3005 🎧 🥁 🎸 🔊'));

