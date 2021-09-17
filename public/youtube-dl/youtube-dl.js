window.ytdl = {
    download: function(ytid, spid) {
        ytid = this.youtubeParser(ytid);
        spid = this.spotifyParser(spid);

        window.open(`/ytmusic/download/id/${ytid}/spotifyId/${spid}/token/${window.accessToken}`);
    },

    youtubeParser: function(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    },

    spotifyParser: function(url) {
        const regEx = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track)(?::|\/)((?:[0-9a-zA-Z]){22})/;
        const match = url.match(regEx);
        return (match && match[1] == "track") ? match[2] : false;
    }
}