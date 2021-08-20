// spotify api
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

// youtube music api
const YoutubeMusicApi = require('youtube-music-api')

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

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL,
    clientID: process.env.AUTH0_CLIENT_ID, // hide!!!
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

app.get(["/settings", "/settings/", "/settings/index.html"], requiresAuth(), function (req, res) {
    res.sendFile(__dirname + '/public/settings/index.html')
})

app.post('/spotify/releaseRadar', requiresAuth(), async function (req, res) {
    try {
        spotifyApi.setAccessToken(req.body.accessToken)
        let artists = []
        let data = await spotifyApi.getFollowedArtists({
            limit: req.body.limit || 50
        });
        artists = data.body.artists.items
        arts = artists.map(x => x.id)
        let releases = []
        for (let i = 0; i < arts.length; i++) {
            const artist = artists[i]
            const data = await spotifyApi.getArtistAlbums(arts[i], {
                limit: 10
            })
            const latestRelease = data.body.items.sort((a, b) => (a.release_date < b.release_date) ? 1 : ((b.release_date < a.release_date) ? -1 : 0))[0]
            //console.log(artist.name + " - " + latestRelease.name)
            latestRelease.reason = artist.name
            releases.push(latestRelease)
        }
        releases = releases.sort((a, b) => (a.release_date < b.release_date) ? 1 : ((b.release_date < a.release_date) ? -1 : 0))
        res.json(releases)
    } catch (e) {
        res.status(401).send("Oh uh, something went wrong.\n(" + JSON.stringify(e) + ")");
    }
});

app.get('/spotify/preview/album/:id', requiresAuth(), async function (req, res) {
    const data = await spotifyApi.getAlbumTracks(req.params.id, {
        limit: 1
    })
    res.redirect(data.body.items[0]["preview_url"])
})

app.post('/ytmusic/search', requiresAuth(), async function (req, res) {
    const api = new YoutubeMusicApi()
    const info = await api.initalize();

    let result = await api.search(`${req.body.artist} ${req.body.title}`)
    console.log(req.body)
    result = result.content.filter(x => x.type == "song");
    res.json(result)
})

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

const listeningSockets = { }

io.on('connection', function (socket) {
    var addedUser = false; // has logged in

    /*socket.on('share', function (msg) {
        console.log("received")
        socket.emit("received", msg)
    });*/

    socket.on("file subscribe", async msg => {
        if (!listeningSockets[msg])
        {
            listeningSockets[msg] = [ ]
        }

        listeningSockets[msg].push(socket);
    })

    socket.on('share', async image => {
        // image is an array of bytes
        if (!listeningSockets[image.code])
        {
            return;
        }

        for (let i = 0; i < listeningSockets[image.code].length; i++)
        {
            listeningSockets[image.code][i].emit("received", image)
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