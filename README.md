# Random Seinfeld

This is based off the [appletv-boilerplate](https://github.com/emadalam/appletv-boilerplate) project which uses [atvjs](https://github.com/emadalam/atvjs).

![Screenshot](https://github.com/dnicolson/Random-Seinfeld/raw/master/screenshot.jpg)

### Installation

```shell
$ npm install -g gulp
$ npm install
```

### Running

By default the project will request `http://localhost:9001` for both the application payload and the API endpoints.

The application payload can be generated with the `gulp build` command, the resulting `web/public/app.js` file can be placed in the root directory of an Express server. This server is required for metadata and streaming links, the following Express server shows the required methods:

```javascript
const TVDB = require('node-tvdb');
const express = require('express');
const fs = require('fs');
const tvdb = new TVDB('<API key>');
const app = express();
const port = 9001;

app.get('/episode', async (req, res) => {
  const seasons = [5, 12, 23, 24, 22, 24, 24, 22, 24];
  const season = Math.floor(Math.random() * seasons.length);
  const episode = {season: Math.floor(Math.random() * seasons.length) + 1, episode:Math.floor(Math.random() * seasons[season]) + 1};
  try {
    const episodeResponse = await tvdb.getEpisodesBySeriesId(79169, {query: {airedSeason: episode.season, airedEpisode: episode.episode}})
    const episodeInfo = {episodeName: episodeResponse[0].episodeName,
      season: episode.season,
      episode: episode.episode,
      description: episodeResponse[0].overview,
      director: episodeResponse[0].directors[0],
      writers: episodeResponse[0].writers,
      guestStars: episodeResponse[0].guestStars,
      firstAired: episodeResponse[0].firstAired,
      siteRating: episodeResponse[0].siteRating,
      contentRating: episodeResponse[0].contentRating.toLowerCase(),
      image: `https://thetvdb.com/banners/${episodeResponse[0].filename}`};
      res.send(episodeInfo);
    } catch(error) {
      res.status(500);
      res.send(error);
    }
});

app.get('/download', async (req, res) => {
  res.send('<streaming link>');
});

app.get('/cleanup', async (req, res) => {
  // any action to perform after the episode has finished
});

app.get('/app.js', (req, res) => {
  res.send(fs.readFileSync('app.js','utf8'));
});

app.listen(port);
```

### Deployment
The hostname needs be changed in the `config.js` and `AppDelegate.swift` files to be externally accessible from the Apple TV, the `app.js` file also needs to be copied to a server with the new hostname.

### License
[MIT License](http://opensource.org/licenses/MIT).
