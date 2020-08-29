require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/home", function (req, res, next) {
  res.render("index");
});

app.get("/artist-search", function (req, res, next) {
  // const search = req.query
  // console.log(search)
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists);
      res.render("artist-search-results", {
        artist: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", function (req, res, next) {
  spotifyApi
    .getArtistAlbums(req.params.id, {
      limit: 10,
      offset: 20,
    })
    .then((data) => {
      console.log(req.params);
      console.log("The received data from the API: ", data.body);
      res.render("album", {
        albums: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:id", function (req, res, next) {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      res.render("tracks", {
        tracks: data.body.items,
      });
      console.log(data.body.items);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
