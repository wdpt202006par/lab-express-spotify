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
app.get('/' ,(req, res, next)=>{
    res.render('home')
})

app.get('/artist-search' , (req, res, next)=>{
    console.log('mot tape par le user', req.query.search)

    // 1. recup le mot tape
    // 2. interroger spotify pour obtenir la liste des artistes matchant avec le mot
    // 3. rendre un template des artistes retournes par spotify

    //1.

    const mot = req.query.search

    //2.
    spotifyApi...then(data => {

        //3.
        res.render('artist-search-results', {
          artists: data.body..... // [ {name: 'Madonna', ... }, {}, ...]
        })
    })

    
})

app.listen(3003, () => console.log('My Spotify project running on port 3003 🎧 🥁 🎸 🔊'));


