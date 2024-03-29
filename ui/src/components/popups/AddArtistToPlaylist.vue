<template>
    <div>
        <vue-final-modal @click="hideFindSourcesCtx" v-model="showModal" classes="modal-container"
            content-class="addAlbumToPlaylistPopup">
            <div class="wrapper">
                <div class="header">
                    <h3>Import playlist</h3>
                    <button class="modal-close" @click="close">
                        <span class="material-icons-round">
                            close
                        </span>
                    </button>
                </div>
                <h4>To Playlist</h4>
                <select v-model="selectedPlaylist">
                    <option v-for="element in playlists" :key="element">{{element}}</option>
                </select>
                <br>
                <div v-if="editSong">
                    <h4>Source</h4>
                    <FindSources ref="findSources" :title="title" :artist="artist">
                        <div class="content">
                            <input type="text" v-model="dSource" ref="source">
                            <span class="material-icons-round more" ref="sourceMore"
                                @click="opencontextmenu">more_vert</span>
                        </div>
                    </FindSources>
                    <h4>Title</h4>
                    <div class="content">
                        <input v-model="dTitle" type="text">
                    </div>
                    <h4>Album</h4>
                    <div class="content">
                        <input v-model="dAlbum" type="text" ref="album">
                    </div>
                    <h4>Artist</h4>
                    <div class="content">
                        <input v-model="dArtist" type="text">
                    </div>
                    <h4>Cover</h4>
                    <div class="content">
                        <input type="text" class="addSong cover" v-model="dCover" ref="cover">
                        <img @click="openInNewTab" class="addSong cover"
                            :src="dCover ? dCover : '/assets/img/music_placeholder.png'">
                    </div>
                    <div class="confirm">
                        <button @click="add" class="negative">Add</button>
                    </div>
                </div>
                <div v-else>
                    <div class="padding-20 playlisteditor" @click="editPlaylist"
                        v-observe-visibility="headerVisibilityChanged">
                        <img class="cover" :src="cover" />
                        <div class="details">
                            <div class="detailswrapper"><h7>Artist</h7><span class="material-icons-round share" @click="share">share</span></div>
                            <h1>{{name}}</h1>
                            <h5 v-html="description" />
                        </div>
                    </div>
                    <hr>
                    <spotify-playlist-header />
                    <hr>
                    <spotify-playlist-entry @add="add" v-for="(track, index) in playlist" :key="index" :added="track.added"
                        :index="index" :cover="track.cover" :artist="track.artists.join(', ')" :title="track.title"
                        :source="track.source" :album="track.album" :preview="track.preview" />
                    <h5>{{"Recommendations based on " + name}}</h5>
                    <hr>
                    <spotify-playlist-header />
                    <hr>
                    <spotify-playlist-entry @add="addRec" v-for="(track, index) in recommendations" :key="index" :added="track.added"
                        :index="index" :cover="track.cover" :artist="track.artists.join(', ')" :title="track.title"
                        :source="track.source" :album="track.album" :preview="track.preview" />
                </div>
                <div class="confirm">
                    <button @click="addAll" class="negative">Add All</button>
                </div>
            </div>
        </vue-final-modal>
    </div>
</template>
<script>
    import FindSources from '../ContextMenus/FindSources.vue'
    import SpotifyPlaylistEntry from '../SpotifyPlaylist/SpotifyPlaylistEntry.vue'
    import SpotifyPlaylistHeader from '../SpotifyPlaylist/SpotifyPlaylistHeader.vue'
    export default {
        name: "AddArtistToPlaylist",
        components: {
            FindSources,
            SpotifyPlaylistHeader,
            SpotifyPlaylistEntry
        },
        props: {
            cover: String,
            description: String,
            name: String,
            href: String,
            id: String
        },
        data() {
            return {
                showModal: false,
                playlists: [],
                selectedPlaylist: -1,
                playlist: [],
                recommendations: [ ],
                editSong: false
            }
        },
        methods: {
            share() {
                window.open(this.href)
            },
            close() {
                this.showModal = false
                this.$emit("close")
            },
            loadMetadata() {
                fetch("/api/metadata", {
                        method: "POST",
                        body: JSON.stringify({
                            url: this.$refs.source.value
                        })
                    })
                    .then(x => x.json())
                    .then(jdata => {
                        console.log(jdata)
                        this.dTitle = jdata.title
                        this.$refs.album.value = jdata.album
                        this.dArtist = jdata.artists.join(", ")
                        this.dCover = jdata.cover
                        this.$refs.source.value = jdata.src
                    })
            },
            openInNewTab() {
                window.open(this.cover ? this.cover : '/assets/img/music_placeholder.png')
            },
            addAll() {
                for (let i = 0; i < this.playlist.length; i++)
                {
                    this.add(i)
                }
            },
            add(index) {
                this.addTrack(this.playlist[index])
            },
            addRec(index) {
                this.addTrack(this.recommendations[index])
            },
            addTrack(track) {
                const id = this.playlists.findIndex(x => x == this.selectedPlaylist)

                console.log(track, id)

                if (id < 0) {
                    alert("no playlist selected")
                    return
                }

                fetch("/api/add", {
                    method: "POST",
                    body: JSON.stringify({
                        id: id,
                        source: track.src,
                        title: track.title,
                        artist: track.artists.join(", "),
                        album: track.album,
                        cover: track.cover
                    })
                }).then(x => {
                    if (x.status == 200) {
                        track.added = true
                    }
                })
            }
        },
        watch: {
            dSource() {
                this.loadMetadata()
            },
            showModal() {
                if (!this.showModal)
                {
                    return
                }
                fetch("/api/playlists")
                    .then(x => x.json())
                    .then(jdata => {
                        this.playlists.length = 0;
                        this.playlists.push(...jdata)
                    })

                fetch("/api/spotify/artist", {
                        method: "POST",
                        body: JSON.stringify({
                            "artistId": this.id
                        })
                    }).then(x => x.json())
                    .then(jdata => {
                        this.playlist.length = 0
                        this.playlist.push(...jdata)
                    })
                fetch("/api/spotify/recommend", {
                        method: "POST",
                        body: JSON.stringify({
                            "artists": [ this.id ]
                        })
                    }).then(x => x.json())
                    .then(jdata => {
                        this.recommendations.length = 0
                        this.recommendations.push(...jdata)
                    })
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        display: flex;
        flex-direction: column;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .content {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    input[type="text"] {
        background: var(--hover-2);
        border: 1px solid var(--hover-3);
        border-radius: 5px;
        color: var(--font-colour);
        padding: 10px;
        width: auto;
        flex-grow: 1;
        font-family: var(--font-family);
    }

    input[type="text"]:focus {
        outline: none;
    }

    input[type="text"]:hover {
        background: var(--hover-1);
        border: 1px solid var(--font-colour);
    }

    button.negative {
        color: var(--font-contrast);
        background-color: var(--font-colour);
        border: none;
        border-radius: 20px;
        padding: 10px 25px 10px 25px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
        font-family: var(--font-family);
        margin-left: auto;
    }

    .confirm {
        margin-top: 20px;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    button.negative:hover {
        cursor: pointer;
        padding: 11px 26px 11px 26px;
        border-radius: 21px;
    }

    input[type="text"].addSong.cover {
        width: auto;
        flex-grow: 1;
    }

    img.addSong.cover {
        height: 42px;
        width: 42px;
        margin-left: 10px;
        border-radius: 5px;
    }

    img.addSong.cover:hover {
        cursor: pointer;
        filter: grayscale(0.4) blur(2px);
    }

    span.more {
        width: 20px;
        line-height: 42px;
    }

    span.more:hover {
        cursor: pointer;
    }

    select {
        background: var(--hover-1);
        border: 1px solid var(--hover-3);
        border-radius: 5px;
        color: var(--font-colour);
        padding: 10px;
        width: auto;
        flex-grow: 1;
        font-family: var(--font-family);
    }

    h7 {
        text-transform: uppercase;
        font-weight: bold;
    }

    option {
        background: var(--accent-dark);
        border: 1px solid var(--hover-3);
        border-radius: 5px;
        color: var(--font-colour);
        padding: 10px;
        width: auto;
        flex-grow: 1;
        font-family: var(--font-family);
    }

    .playlisteditor {
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
    }

    .playlisteditor>img {
        width: 20%;
        margin-right: 20px;
        border-radius: 5px;
    }

    .playlisteditor>.details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .playlisteditor>.details>h1 {
        font-size: 2em;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .playlisteditor>.details>.detailswrapper {
        font-size: .8em;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }  

    .playlisteditor>.details>.detailswrapper>.share {
        margin-left: 10px;
        line-height: 15px;
        font-size: 15px;
    }

    .share:hover {
        cursor: pointer;
    }

    .playlisteditor>.details>h5 {
        font-size: .8em;
        font-weight: normal;
        color: var(--font-darker);
        margin: 0;
    }
</style>