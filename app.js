require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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
//ROUTE FOR ARTIST SEARCH HOME PAGE
app.get("/", (req, res, next) => {
  res.render("home-page");
})

//ROUTE FOR RESULTS PAGE
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artists:data.body.artists.items})
  })
  	.catch(err => console.log('The error while searching artists occurred: ', err));
})


// ROUTE for Album Page
app.get("/albums/:artistId", (req, res, next) => {
	// .getArtistAlbums() code goes here
	spotifyApi
		.getArtistAlbums(req.params.artistId)
		.then(data => {
			console.log(req.params);
			console.log('Artist albums', data.body.items);
			// renders albumObj to albums page
			res.render('albums', {albums: data.body.items})
  })
  	.catch(err => console.log('The error while searching artists occurred: ', err));
});

// Route to get tracks in an album
app.get("/tracks/:albumId", (req, res, next) => {
	spotifyApi
	.getAlbumTracks((req.params.albumId)) // Utilisation des params
		.then(data => {
			console.log('The received data for the songs: ', data.body.items);
		
			// renders trackObj to tracks page
			res.render('tracks', {
				tracks: data.body.items
			})
		})
		.catch(err => 
			console.log('Something went wrong!', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
