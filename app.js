require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

//
// setting the spotify-api goes here (see: https://developer.spotify.com/dashboard)
//

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// ########   #######  ##     ## ######## ########  ######  
// ##     ## ##     ## ##     ##    ##    ##       ##    ## 
// ##     ## ##     ## ##     ##    ##    ##       ##       
// ########  ##     ## ##     ##    ##    ######    ######  
// ##   ##   ##     ## ##     ##    ##    ##             ## 
// ##    ##  ##     ## ##     ##    ##    ##       ##    ## 
// ##     ##  #######   #######     ##    ########  ######  


app.get('/', function (req, res, next) {
  res.render('home', {}); // 👨🏻‍🎨 rendering the `views/home.hbs` template (with no param)
});

app.get('/artists', function (req, res, next) {
  // Make a call to the API to retrieve all the artists matching the one provided as query-string `req.query.artist`
  spotifyApi.searchArtists(`${req.query.artist}`)
    .then(data => {
      // 🕵🏽‍♀️ Inspect the returned data from the API
      console.log("The received data from the API: ", data.body);
      
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      // 👨🏻‍🎨 rendering the `views/artists.hbs` template, passing `artists` to
      res.render('artists', {
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
      
      // Display the error to the user (so he can call the hotline)
      next(err); // 💥 Call the error middleware (see: https://expressjs.com/en/guide/error-handling.html)
    })
  ;
});

app.get('/albums/:id', function (req, res, next) {
  const id = req.params.id; // route-param

  // Make a call to the API to retrieve all the albums of that artist's id
  spotifyApi.getArtistAlbums(id)
    .then(function(data) {
      console.log('Artist albums', data.body.items);

      // 👨🏻‍🎨 rendering the `views/albums.hbs` template, passing `albums` to
      res.render('albums', {
        albums: data.body.items
      })
    })
    .catch(err => next(err)); // 💥 Call the error middleware
});

app.get('/tracks/:albumid', function (req, res, next) {
  const albumid = req.params.albumid;

  // Make a call to the API to retrieve all the tracks of that `albumid`
  spotifyApi.getAlbumTracks(albumid)
    .then(data => {
      console.log('Tracks:', data.body.items);

      // 👨🏻‍🎨 rendering the `views/tracks.hbs` template, passing `tracks` to
      res.render("tracks", {
        tracks: data.body.items
      })
    })
    .catch(err => next(err)) // 💥 Call the error middleware
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
