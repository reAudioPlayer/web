if (window.hideBody == undefined)
{
    window.hideBody = true
}

fetch("/user/get")
    .then(x => {
        console.log(x.status)
        if (x.status == 401) { // logged out
            document.getElementById("user-loggedOut").classList.remove("hidden")
            document.getElementById("user-loggedIn").classList.add("hidden")
            if (window.hideBody)
            {
                document.getElementById("body").classList.add("hidden")
            }
            console.log("logged out")
            return;
        } else { // logged in
            document.getElementById("user-loggedOut").classList.add("hidden")
            document.getElementById("user-loggedIn").classList.remove("hidden")
            document.getElementById("body").classList.remove("hidden")
            console.log("logged in")
            return x.json()
        }
    })
    .then(json => {
        if (json && json.user) {
            document.getElementById("user-icon").src = json.user.picture
            document.getElementById("user-email").innerText = json.user.email

            try {
            document.getElementById("spotify-client-id").innerText = json.data.spotifyApiId || ""
            document.getElementById("spotify-client-secret").innerText = json.data.spotifyApiSecret || ""
            document.getElementById("igdb-client-id").innerText = json.data.igdbApiId || ""
            document.getElementById("igdb-client-secret").innerText = json.data.igdbApiSecret || ""
            document.getElementById("youtube-client-key").innerText = json.data.youtubeApiKey || ""
            } catch { }
        }
    })