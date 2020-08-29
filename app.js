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

  // {ärtist: }

  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0]);

    res.render('artist-search-results', {
      artists: data.body.artists.items // [ {}, {} ]
    })

    //res.send('')
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})



// Route to display found artists
// app.get('/artist-search-results', (req, res, next) => {
//   res.send({name:},{}); // object {artist: "The Beatles"}
// })


app.listen(3005, () => console.log('My Spotify project running on port 3005 🎧 🥁 🎸 🔊'));

