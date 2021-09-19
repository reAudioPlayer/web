const WebSocketServer = require("ws").Server
const fs = require("fs");

const dummyNowPlugin = {
    accentColour: "178, 134, 87",
    album: "Rick Roll",
    artist: "Rick Astley",
    autoRating: {
        id: "D:\\Users\\David\\Musik\\Progressive House\\Somero, Revealed Recordings - All My Life.mp3",
        score: 33,
        stats: {
            active: false,
            boost: 0,
            dailyPlayScore: 0,
            plays: {"2021-09-16T21:05:56.0870476+02:00": 41, "2021-09-16T21:05:59.5004811+02:00": 0},
            weeklyPlayScore: 0
        }
    },
    oneLiner: "Rick Astley - Never Gonna Give You Up",
    background: "System.Drawing.Bitmap",
    cover: "System.Drawing.Bitmap",
    coverUri: null,
    creationTime: "2021-09-16T21:03:11.0776869+02:00",
    id: 455,
    index: 0,
    info: {
        accousticness: 0,
        camelot: null,
        danceability: 50,
        energy: 93,
        happiness: 29,
        instrumentalness: 0,
        key: "1",
        liveness: 50,
        loudness: -467,
        popularity: 0,
        releaseDate: "2021-09-17"
    },
    keywords: "Never Gonna Give You Up Rick Astley Never Gonna Give You Up pop:0 nrg:93 dnc:50 hap:29 loud:-467 acc:0 inst:0 live:50 spe:7 key:1 dat:2021-09-17",
    location: "C:\\GreatSongs\\Never Gonna Give You Up.mp3",
    playCount: 6,
    secondLiner: "Rick Astley - Rick Roll",
    spotifyEqual: null,
    title: "Never Gonna Give You Up"
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer(bitmap).toString('base64');
}

class Data {
    handle(msg) {
        if (msg.apiModule !== "data") {
            return;
        }

        switch (msg.endpoint) {
            case "displayname":
                return this.displayname(msg);
            case "playlists":
                return this.playlists(msg);
            case "playlist":
                return this.playlist(msg);
            case "search":
                return this.search(msg);
            case "position":
                return this.position(msg);
            case "volume":
                return this.volume(msg);
            case "cover":
                return this.cover(msg);
            case "radioProgramme":
                return this.radioProgramme(msg);
            case "accentColour":
                return this.accentColour(msg);
            default:
                msg.data = "404";
                return msg;
        }
    }

    displayname(msg) {
        msg.data = dummyNowPlugin.oneLiner
        return msg;
    }

    playlists(msg) {
        msg.data = JSON.stringify({
            autoplaylists: [{
                date: "18 Sept 2021",
                description: JSON.stringify([{
                    "type": "OrderByDescending",
                    "expr": "creationTime"
                }, {
                    "type": "Take",
                    "expr": "20"
                }]),
                name: "Breaking",
                tags: null
            }],
            customplaylists: [{
                date: "24 Aug",
                description: "104 songs, hand picked by you",
                name: "Great Playlist",
                tags: ["Together", "Animal", "Ace", "Rock The Party"]
            }]
        })
        return msg;
    }

    playlist(msg) {
        msg.data = JSON.stringify(dummyNowPlugin)
        return JSON.stringify([msg]);
    }

    search(msg) {
        let dummies = [dummyNowPlugin]
        dummies = dummies.filter(x => x.keywords.toLowerCase().includes(JSON.parse(msg.data).query.toLowerCase()))
        msg.data = JSON.stringify(dummies)
        return msg;
    }

    position(msg) {
        msg.data = "{\"remainingTime\":\"02:47\",\"duration\":\"03:08\",\"absolutePosition\":\"00:20\",\"relativePosition\":\"11.1%\"}"
        return msg
    }

    volume(msg) {
        msg.data = "15";
        return msg;
    }

    cover(msg) {
        msg.data = base64_encode(__dirname + "/../public/src/music_placeholder.png")
        return msg;
    }

    radioProgramme(msg)
    {
        msg.data = "[]"
        return msg;
    }

    accentColour(msg)
    {
        msg.data = "#F94E44"
        return msg;
    }
}

class Control {
    handle(msg) {
        if (msg.apiModule !== "control") {
            return;
        }

        switch (msg.endpoint) {
            case "playPause":
                return this.playPause(msg);
            default:
                msg.data = "404";
                return msg;
        }
    }

    playPause(msg) {
        msg.data = base64_encode(__dirname + "/../public/src/music_placeholder.png")
        return msg;
    }

    next(msg) {
        msg.data = null
        return msg
    }

    last(msg) {
        msg.data = null
        return msg
    }

    volume(msg) {
        return msg
    }
}

class General {
    handle(msg) {
        if (msg.apiModule !== "general") {
            return;
        }

        switch (msg.endpoint) {
            case "version":
                return this.version(msg);
            default:
                msg.data = "404";
                return msg;
        }
    }

    version(msg) {
        msg.data = "reAudioPlayer Apollo .5 [web dummy]"
        return msg
    }
}

class Game {
    handle(msg) {
        if (msg.apiModule !== "game") {
            return;
        }

        switch (msg.endpoint) {
            case "version":
                return this.version(msg);
            default:
                msg.data = "404";
                return msg;
        }
    }

    version(msg) {
        msg.data = "reAudioPlayer Apollo .5 [web dummy]"
        return msg
    }
}

class Youtube {
    handle(msg) {
        if (msg.apiModule !== "youtube") {
            return;
        }

        switch (msg.endpoint) {
            case "version":
                return this.version(msg);
            default:
                msg.data = "404";
                return msg;
        }
    }

    version(msg) {
        msg.data = "reAudioPlayer Apollo .5 [web dummy]"
        return msg
    }
}

class Playlist {
    handle(msg) {
        if (msg.apiModule !== "playlist") {
            return;
        }

        switch (msg.endpoint) {
            case "version":
                return this.version(msg);
            default:
                msg.data = "404";
                return msg;
        }
    }

    version(msg) {
        msg.data = "reAudioPlayer Apollo .5 [web dummy]"
        return msg
    }
}

const data = new Data();
const general = new General();

function handle(msg) {
    /*console.log(msg)
    console.log(msg.apiModule)*/
    switch (msg.apiModule) {
        case "data":
            return data.handle(msg);
        case "general":
            return general.handle(msg);
        default:
            msg.data = "404";
            return msg;
    }
}

module.exports = {
    init: function (server, path) {
        this.wss = new WebSocketServer({
            server,
            path
        });

        this.wss.on("connection", function (ws) {
            ws.on('message', function incoming(message) {
                ws.send(JSON.stringify(handle(JSON.parse(message))))
            });
        });
    }
}