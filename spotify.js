var SpotifyWebApi = require('spotify-web-api-node');

const clientId = "18c4212a7c2d4682a6415d3d7fed5762"
const clientSecret = "003c372736d440beb3b8bb0f9e4948aa"
const redirectUri = 'http://reap.ml/callback/'

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
});

const scope = "user-follow-read playlist-modify-public"
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`

const code = "AQBin95QPP92XdP4ODfsWHsgmbPTc8KozpBKXIPS66b0YQOR7E4DVaDNmVwRRWH3g5mTiJsJ_9TYONtRuMxXuacK4-LvyIy6sZ7dba-js7FKkaOpyZnpaXJW_2X9pRPTbku9w8uUVA9TcjEEPKIEm8aeTRIqUlMmpL7seoHztTtxPs0lvC1QoBYXWt4fQBZ3rvpueeZ0aGFpOq8a4aN7WNRIHrizug"

spotifyApi.setAccessToken("BQCSUfpGdySN55u-9xxSm621iyT0DXTxQ2GTjD8I3IXMDlrg7sv7dItfyiOPbHyxN1aDV6he6Uy37RtqWZ36xA9xEmOMMd48JO_MBUhltR5filzB9ZFPpxcPAQuPcz1utc0l93VcaWOSnjPVhL2MxJwiCkjq6f4pUZZC7lkLtXWii3DYj_nlqE1Z2g-TSVbsGrNRvA")

spotifyApi.getFollowedArtists({
        limit: 50
    })
    .then(function (data) {
        return data.body.artists.items.map(x => x.id)
    })
    .then(artists => {
        artists.forEach(artist => {
            spotifyApi.getArtistAlbums(artist, {
                    limit: 10
                })
                .then(function (data) {
                    const latestRelease = data.body.items.sort((a, b) => (a.release_date < b.release_date) ? 1 : ((b.release_date < a.release_date) ? -1 : 0))[0]
                    console.log(latestRelease.artists[0].name + " - " + latestRelease.name)
                    console.log(latestRelease)
                }, function (err) {
                    console.log('Something went wrong!', err);
                });
        })
    });