// spotify api
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

// youtube music api
const YoutubeMusicApi = require('youtube-music-api')

// youtube download api
const youtubedl = require('youtube-dl-exec')
const fs = require("fs")
const fsp = require('fs').promises
const NodeID3 = require('node-id3')
const request = require('request-promise');

const dummyApi = require("./api/dummy.js")

// cors
const cors = require("cors")

// sequelize
const db = require('./models/index.js');

// openid
const {
    requiresAuth
} = require('express-openid-connect');

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || "http://localhost:" + port

console.log(baseURL, typeof baseURL)

const {
    auth
} = require('express-openid-connect');
const {
    env
} = require('process');
const {
    findSourceMap
} = require('module');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL,
    clientID: process.env.AUTH0_CLIENT_ID || "", // hide!!!
    issuerBaseURL: 'https://dev-l3q9y5qp.us.auth0.com'
};

db.sequelize.sync({})

console.log(process.env.DATABASE_URL);

// SERVER INIT

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use(cors())

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

server.listen(port, function () {
    console.log('Webserver running on Port %d', port);
});

//dummyApi.init(server, "/dummy/ws");

// ROUTES

app.get('/user/get', async (req, res) => {
    if (req.oidc.user) {
        const data = await getUserData(req.oidc.user.email, req.oidc.user.sub);
        res.json({
            user: req.oidc.user,
            data
        })
    } else {
        res.status(401).send(false)
    }
});

app.post('/user/set/data', requiresAuth(), async function (req, res) {
    setData(req, req.body.data)
    res.send(req.body.data)
})

app.post('/user/set', requiresAuth(), async function (req, res) {
    console.log(req)
    console.log(req.body)
    const data = {
        youtubeApiKey: req.body.youtubeApiKey,
        spotifyApiId: req.body.spotifyApiId,
        spotifyApiSecret: req.body.spotifyApiSecret,
        igdbApiId: req.body.igdbApiId,
        igdbApiSecret: req.body.igdbApiSecret,
    }

    setData(req, JSON.stringify(data))

    res.send(data)
})

app.get(["/spotify", "/spotify/", "/spotify/index.html"], requiresAuth(), function (req, res) {
    res.sendFile(__dirname + '/public/spotify/index.html')
})

app.get(["/youtube-dl", "/youtube-dl/", "/youtube-dl/index.html"], requiresAuth(), function (req, res) {
    res.sendFile(__dirname + '/public/youtube-dl/index.html')
})

app.get(["/settings", "/settings/", "/settings/index.html"], requiresAuth(), function (req, res) {
    res.sendFile(__dirname + '/public/settings/index.html')
})

app.post('/spotify/releaseRadar', requiresAuth(), async function (req, res) {
    try {
        spotifyApi.setAccessToken(req.body.accessToken)
        let artists = [ ]

        let data = await spotifyApi.getFollowedArtists({after: 0, limit: 50});
        artists.push(...data.body.artists.items)

        const total = data.body.artists.total

        while (artists.length < total)
        {
            let data = await spotifyApi.getFollowedArtists({
                after: artists.length
            });
            artists.push(...data.body.artists.items)
        }

        artists = artists.filter((obj, index, self) =>
            index === self.findIndex((t) => (
                t.id === obj.id
            ))
        )

        let arts = artists.map(x => x.id)
        let releases = []
        for (let i = 0; i < arts.length; i++) {
            const artist = artists[i]
            const data = await spotifyApi.getArtistAlbums(arts[i], {
                limit: 10
            })
            const latestRelease = data.body.items.sort((a, b) => (a.release_date < b.release_date) ? 1 : ((b.release_date < a.release_date) ? -1 : 0))[0]
            //console.log(artist.name + " - " + latestRelease.name + " [" + i + "]")
            latestRelease.reason = artist.name
            releases.push(latestRelease)
        }
        releases = releases.sort((a, b) => (a.release_date < b.release_date) ? 1 : ((b.release_date < a.release_date) ? -1 : 0))
        res.json(releases)
    } catch (e) {
        console.error(e)
        res.status(401).send("Oh uh, something went wrong.\n(" + JSON.stringify(e) + ")");
    }
});

app.get('/spotify/preview/song/:id', requiresAuth(), async function (req, res) {
    const data = await spotifyApi.getTrack(req.params.id)
    res.redirect(data.body.preview_url)
})

app.get('/spotify/preview/album/:id', requiresAuth(), async function (req, res) {
    const data = await spotifyApi.getAlbumTracks(req.params.id, {
        limit: 1
    })
    res.redirect(data.body.items[0]["preview_url"])
})

app.post('/ytmusic/search', requiresAuth(), async function (req, res) {
    const api = new YoutubeMusicApi()
    const info = await api.initalize();

    let result = await api.search(`${req.body.artist} ${req.body.title}`, "song")

    res.json(result)
})

/*app.get('/ytmusic/download/artist/:artist/title/:title', async function (req, res) {
    const api = new YoutubeMusicApi()
    const info = await api.initalize();

    let result = await api.search(`${req.params.artist} ${req.params.title}`)

    result = result.content.filter(x => x.type == "song");

    //res.json(result[0])

    console.log(req.params, result[0].videoId)

    const filename = await downloadFile(result[0].videoId)
    res.sendFile(filename, (err) => {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', filename);
            fs.unlink(filename, function (err) {
                // log any error
                if (err) {
                    console.log(err);
                }
            });
        }
    })
    //fs.rm(filename);
})*/

app.get('/spotify/metadata/album/:id/token/:token', requiresAuth(), async function (req, res) {
    try
    {
        spotifyApi.setAccessToken(req.params.token)
        const data = await spotifyApi.getAlbum(req.params.id);
        res.json(data.body);
    }
    catch (e) {
        res.status(500).send(e);
        return 500
    }
})

app.get('/spotify/metadata/song/:id/token/:token', requiresAuth(), async function (req, res) {
    try
    {
        spotifyApi.setAccessToken(req.params.token)
        const data = await getMetadataOnline(req.params.id);
        res.json(data);
    }
    catch (e) {
        res.status(500).send(e);
        return 500
    }
})

function SpotifyComment(features, track)
{
    return JSON.stringify({
        energy: Math.round(features.energy * 100) || 0,
        danceability: Math.round(features.danceability * 100) || 0,
        happiness: Math.round(features.valence * 100) || 0,
        loudness: Math.round(features.loudness * 100) || 0,
        acousticness: Math.round(features.acousticness * 100) || 0,
        instrumentalness: Math.round(features.instrumentalness * 100) || 0,
        liveness: Math.round(features.liveness * 100) || 0,
        speechiness: Math.round(features.speechiness * 100) || 0,
        key: features.key || 0,
        popularity: track.popularity || 0,
        releaseDate: track.album.release_date || ""
    })
}

async function getMetadataOnline(id)
{
    const track = (await spotifyApi.getTrack(id))?.body;

    const features = (await spotifyApi.getAudioFeaturesForTrack(track.id))?.body;

    const genres = (await spotifyApi.getAlbum(track.album.id))?.body?.genres;

    const tags = {
        title: track.name,
        artist: track.artists.map(x => x.name).join(", "),
        album: track.album.name,
        bpm: Math.round(features.tempo),
        comment: { "language": "eng", "text": SpotifyComment(features, track)},
        genre: genres.join(", "),
        cover: track.album.images[0].url
    }

    return tags;
}

async function getMetadataLocal(id)
{
    let tags = await getMetadataOnline(id);
    return await createMetadataFromJson(tags);
}

async function createMetadataFromJson(jdata) {
    const r = await request(jdata.cover, {
        resolveWithFullResponse: true,
        encoding: null,
        headers: {
            "Content-type": "image/jpeg"
        }
    })

    jdata.image = {
            mime: "image/jpeg",
            type: {
                id: 3,
                name: "Front Cover"
            },
            description: "Cover",
            imageBuffer: r.body
    }

    return jdata;
}

app.get("/one/download", async function(req, res) {
    try {
        const tags = JSON.parse(req.query.data)
        const src = tags.source
        delete tags.source
        const id = src.split("/")[src.split("/").length - 1]
        
        const filename = await downloadFromAny(src)
        const rtags = await createMetadataFromJson(tags)

        NodeID3.write(rtags, filename)

        res.download(filename, `${tags.artist} - ${tags.title}.mp3`, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Sent:', filename);
                fs.unlink(filename, function (err) {
                    // log any error
                    if (err) {
                        console.log(err);
                    }
                });
                fs.unlink(`${__dirname}\\c-${req.params.id}.jpg`, err => {})
            }
        })    
    } catch (e) {
        console.error(e)
        res.status(500).send(e);
        return 500
    }
})

app.get('/ytmusic/download/id/:id/spotifyId/:spotify/token/:token', async function (req, res) {
    try {
        console.log(req.params.id, req.params.spotify)
        spotifyApi.setAccessToken(req.params.token)

        const filename = await downloadFile(req.params.id)
        //const filename = `${__dirname}\\1l8G2ybbEpw.mp3`;

        const tags = await getMetadataLocal(req.params.spotify);

        NodeID3.write(tags, filename)

        res.download(filename, `${tags.artist} - ${tags.title}.mp3`, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Sent:', filename);
                fs.unlink(filename, function (err) {
                    // log any error
                    if (err) {
                        console.log(err);
                    }
                });
                fs.unlink(`${__dirname}\\c-${req.params.id}.jpg`, err => {})
            }
        })
    } catch (e) {
        res.status(500).send(e);
        return 500
    }
})

async function downloadFile(id) {
    return await downloadFromAny('http://www.youtube.com/v/' + id)
}

async function downloadFromAny(url) {
    const id = url.split("/")[url.split("/").length - 1]
    await youtubedl(url, {
        continue: true,
        ignoreErrors: true,
        noOverwrites: true,
        extractAudio: true,
        audioFormat: "mp3",
        output: __dirname + "/tmp/" + id + ".%(ext)s"
    });

    console.log("downloaded!")

    return __dirname + "/tmp/" + id + ".mp3"
}

app.use(express.static(__dirname + '/public'));

// FUNCTIONS

async function setData(req, data) {
    const entry = await userExists(req.oidc.user.email, req.oidc.user.sub)

    if (!entry) {
        await db.UserDb.create({
            username: req.oidc.user.email,
            password: req.oidc.user.sub,
            data: data
        })
        return;
    } else {

        await db.UserDb.update({
            data: data
        }, {
            where: {
                username: req.oidc.user.email,
                password: req.oidc.user.sub
            }
        })
    }
}

async function userExists(username, password) {
    const entries = await db.UserDb.findAll({
        where: {
            username,
            password
        },
        limit: 1
    });

    return entries[0]
}

async function getUserData(username, password) {
    const entry = await userExists(username, password)
    if (!entry) {
        return 404;
    }

    if (entry.dataValues.password != password) {
        res.status(401).send("Invalid Password")
        return 401;
    }

    try {
        const jdata = JSON.parse(entry.dataValues.data);
        return jdata
    } catch {
        return data
    }
}

function findUserByKey(socket, key) {
    db.GameLib.findAll({
            where: {
                key: key.toUpperCase()
            },
            limit: 1
        })
        .then(entries => {
            console.log(entries.length + " entries")
            if (entries.length > 0) {
                socket.emit('game library of', JSON.parse(entries[0].dataValues.lib));
            } else {
                socket.emit('game library of', "null");
            }
        });
}

function authoriseUser(json) {
    updateKeyLib(json.key, json.value);
}

function writeKeyLib(key, lib) {
    db.GameLib.findOrCreate({
        where: {
            key: key
        },
        defaults: {
            lib: lib
        }
    });
}

function updateKeyLib(key, lib) {
    db.GameLib.findAll({
            where: {
                key: key.toUpperCase()
            },
            limit: 1
        })
        .then(entries => {
            if (entries.length > 0) {
                db.GameLib.update({
                    lib: lib
                }, {
                    where: {
                        key: key
                    }
                });
            } else {
                writeKeyLib(key, lib);
            }
        });
}

function synchroniseGameDatabase(socket, dbProposed) {
    db.GameLib.findAll({
            where: {
                key: "MASTER"
            },
            limit: 1
        })
        .then(entries => {
            console.log(entries.length + " entries")
            if (entries.length > 0) {
                const mstr = JSON.parse(entries[0].dataValues.lib);

                const filtered = Object.values({
                    ...mstr,
                    ...dbProposed
                });
                //var merged = mstr.concat(JSON.parse(dbProposed));
                //var filtered = merged.filter((item, pos) => merged.indexOf(item) === pos);

                updateKeyLib("MASTER", JSON.stringify(filtered));

                socket.emit('synchronised game database', filtered);
            }
        });
}

/* socket part */
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const listeningSockets = {}

io.on('connection', function (socket) {
    var addedUser = false; // has logged in

    socket.on("web.fileSubscribe", async msg => {
        if (!listeningSockets[msg]) {
            listeningSockets[msg] = []
        }

        listeningSockets[msg].push(socket);
    })

    socket.on('web.fileShare', async image => {
        if (!listeningSockets[image.code]) {
            return;
        }

        for (let i = 0; i < listeningSockets[image.code].length; i++) {
            listeningSockets[image.code][i].emit("web.fileReceived", image)
        }
    });

    socket.on('web.fileMsg', async msg => {
        if (!listeningSockets[msg.code]) {
            return;
        }

        for (let i = 0; i < listeningSockets[msg.code].length; i++) {
            listeningSockets[msg.code][i].emit("web.msgReceived", msg)
        }
    });

    // on attempted login
    socket.on('authorise', function (msg) {
        //const json = JSON.parse(msg);
        const json = msg;
        authoriseUser(json);

        socket.username = json.key;
        addedUser = true;

        socket.emit('authorised');
        console.log(socket.username + ": authorised");

        // notify others
        socket.broadcast.emit('msc/authorised', socket.username);
    });

    socket.on('get game library of', function (key) {
        socket.broadcast.emit('msg/get game library of', {
            username: socket.username,
            key: key
        });
        findUserByKey(socket, key)
    });

    socket.on('synchronise game database', function (db) {
        socket.broadcast.emit('msg/synchronise game database', socket.username);
        synchroniseGameDatabase(socket, db)
    });

    socket.on('verify root', function (password) {
        if (password != "pAsSwOrD") {
            socket.emit('declined');
            return;
        }
        socket.username = "root";
        addedUser = true;
        socket.emit('accepted');
    });

    socket.on('launch game', function (game) {
        const msg = {
            inviter: socket.username,
            receiver: game.receiver,
            gameId: game.id
        };
        socket.broadcast.emit('game invite', msg);
    });

    socket.on('disconnect', function () {
        if (addedUser) {
            socket.broadcast.emit('msg/disconnect', socket.username);
        }
    });
});