require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:

app.get("/", function (req, res, next) {
  res.render("index");
  console.log("layout connected");
});

app.get("/artist-search", function (req, res, next) {
  // 1. recuperer le nom saisi par le user: "Madonna"
  const artistName = req.query.artist;
  //2.interroger l'API pour obtenir une liste de tous les artistes correspondant a "Madonna"
  spotifyApi
    .searchArtists(artistName)
    .then((reponse) => {
    console.log("The received data from the API: ", reponse.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      const artistsList = reponse.body.artists.items; // [ {..}, {} ]

      // 3. rendre le template affichant cette liste
      res.render("artist-search-results", {
        artists: artistsList,
      });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

//iteration 4
app.get('/albums/:artistId', (req, res, next) => {
  //1.récuperer l'id de l'artiste dans l'URL qui apparait quand on clique sur le bouton "view albums"
  const artistId = req.params.id;
  //2. interroger l'APi pour récuperer le nom et la photo de chaque album
  spotifyApi
    .getArtistAlbums(artistId)
    .then((reponse) => {
      console.log("Artist albums", reponse.body.items);
      const artistAlbums = reponse.body.items; //[]
      //3.rendre le template des albums
      res.render("albums", {
        albums : artistAlbums,
      });
      })
    .catch((err) => console.log("The error while searching artist's albums occurred: ", err));
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
