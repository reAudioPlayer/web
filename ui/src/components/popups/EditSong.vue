<template>
    <div>
        <vue-final-modal @click="hideFindSourcesCtx" v-model="showModal" classes="modal-container" content-class="modal-content">
            <div class="wrapper">
                <div class="header">
                    <h3>Edit song</h3>
                    <button class="modal-close" @click="showModal = false">
                        <span class="material-symbols-rounded">
                            close
                        </span>
                    </button>
                </div>
                <h4>Source</h4>
                <FindSources ref="findSourcesEdit" :title="title" :artist="artist">
                    <div class="content">
                        <input v-model="dSource" type="text" ref="source">
                        <span class="material-symbols-rounded more" ref="sourceMore" @click="opencontextmenu">more_vert</span>
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
                        :src="cover ? cover : '/assets/img/music_placeholder.png'">
                </div>
                <div class="confirm">
                    <button @click="add" class="negative">Save</button>
                </div>
            </div>
        </vue-final-modal>
    </div>
</template>
<script>
import FindSources from '../contextMenus/FindSources.vue'
    export default {
        name: "EditSong",
        components: {
            FindSources
        },
        props: {
            cover: String,
            album: String,
            artist: String,
            source: String,
            title: String,
            id: Number,
            userData: Object
        },
        data() {
            return {
                showModal: false,
                dCover: this.cover,
                dAlbum: this.album,
                dArtist: this.artist,
                dTitle: this.title,
                dSource: this.source
            }
        },
        methods: {
            opencontextmenu(evt) {                
                this.$refs.findSourcesEdit.show(evt)
            },
            hideFindSourcesCtx() {
                this.$refs.findSourcesEdit.hide()
            },
            add() {
                this.showModal = false
                console.log(this.userData)

                for (const playlist of this.userData.data.playlists)
                {
                    for (const song of playlist.songs)
                    {
                        if (song.id == this.id)
                        {
                            console.log("found one")
                            song.source = this.dSource
                            song.title = this.dTitle
                            song.album = this.dAlbum
                            song.artist = this.dArtist
                            song.cover = this.dCover
                        }
                    }
                }

                fetch("/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.userData.data)
                }).then(x => {
                    console.log(x)
                    this.$emit("close")
                })
            },
            loadMetadata() {
                /*fetch("/api/metadata", {
                        method: "POST",
                        body: JSON.stringify({
                            url: this.$refs.source.value
                        })
                    })
                    .then(x => x.json())
                    .then(jdata => {
                        console.log(jdata)
                        this.dTitle = jdata.title
                        this.dAlbum = jdata.album
                        this.dArtist = jdata.artists.join(", ")
                        this.dCover = jdata.cover
                        this.dSource = jdata.src
                    })*/
            },
            openInNewTab() {
                window.open(this.cover ? this.cover : '/assets/img/music_placeholder.png')
            }
        },
        watch:{
            id (){
                this.dCover = this.cover
                this.dAlbum = this.album,
                this.dArtist = this.artist,
                this.dTitle = this.title,
                this.dSource = this.source
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
        margin-bottom: 20px;
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
</style>