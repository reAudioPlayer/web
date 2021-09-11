function spotifyStart(redirectEndpoint, callback, noFetch = false) {
    fetch("/user/get")
        .then(resp => {
            const contentType = resp.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return resp.json()
            }
            return resp.text()
        })
        .then(user => {
            console.info(user)
            let clientId = ""
            let clientSecret = ""

            if (typeof user.data === "object") {
                clientId = user.data.spotifyApiId
                clientSecret = user.data.spotifyApiSecret
            } else {
                clientId = prompt("client id?")
                clientSecret = prompt("client secret?")

                fetch("/user/set", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        spotifyApiId: clientId,
                        spotifyApiSecret: clientSecret
                    })
                }).then(x => {
                    console.log(x)
                })
            }

            const redirectUri = window.location.origin + '/' + redirectEndpoint
            const scope = "user-follow-read playlist-modify-public"

            function getToken() {
                window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&state=123`
            }

            function filterLib() {
                let search = document.getElementById("search").value;
                const library = document.getElementById("library");

                const invertedSearch = search.substr(0, 1) == "-";
                search = search.substr(0, 1) == "-" ? search.substr(1) : search;

                const onmatch = invertedSearch ? hide : show;
                const onnomatch = invertedSearch ? show : hide;

                if (search.length == 0) {
                    for (let i = 0; i < library.children.length; i++) {
                        show(library.children[i].classList)
                    }
                    return;
                }

                for (let i = 0; i < library.children.length; i++) {
                    const game = library.children[i];

                    const results = search.split(' ').filter(x => jdata[i].keywords.toLowerCase().includes(x.toLowerCase()));

                    if (results && results.length == search.split(' ').length) {
                        onmatch(game.classList);
                    } else {
                        onnomatch(game.classList);
                    }
                }
            }

            function show(classlist) {
                if (classlist.contains("hidden")) {
                    classlist.remove("hidden");
                }
            }

            function hide(classlist) {
                if (!classlist.contains("hidden")) {
                    classlist.add("hidden");
                }
            }

            if (!window.location.href.includes("#access_token=")) {
                getToken();
            } else {
                window.accessToken = window.location.hash.replace("#access_token=", "").split("&")[0]

                if (noFetch)
                {
                    return
                }

                fetch("/spotify/releaseRadar", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: window.accessToken,
                        clientId,
                        clientSecret,
                        redirectUri,
                        scope
                    })
                }).then(x => {
                    if (x.status == 401) {
                        getToken();
                    }

                    return x.json();
                }).then(json => {
                    console.log(json)
                    callback(json)
                })
            }
        })
}