<template>
    <div>
        <vue-final-modal @click="hideFindSourcesCtx" v-model="showModal" classes="modal-containerr"
            content-class="addAlbumToPlaylistPopup">
            <div class="wrapper">
                <div class="header">
                    <h3>Add album</h3>
                    <button class="modal-close" @click="close">
                        <span class="material-symbols-rounded">
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
                            <span class="material-symbols-rounded more" ref="sourceMore"
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
                            <div class="detailswrapper">
                                <h7 class="hideIfMobile">Album</h7>
                                <span class="material-symbols-rounded share" @click="share">share</span>
                                <span class="material-symbols-rounded share fill" @click="preview">play_arrow</span>
                            </div>
                            <h1>{{title}}</h1>
                            <h5>{{artist}}</h5>
                        </div>
                    </div>
                    <hr class="hideIfMobile">
                    <album-header class="hideIfMobile" />
                    <hr>
                    <album-entry @add="add" v-for="(track, index) in playlist" :key="index" :added="track.added"
                        :index="index" :cover="track.cover" :artist="track.artists.join(', ')" :title="track.title"
                        :source="track.src" :preview="this.href" />
                </div>
                <div class="confirm">
                    <button @click="addAll" class="negative">Add All</button>
                </div>
            </div>
        </vue-final-modal>
    </div>
</template>
<script>
    import AlbumEntry from '@/components/album/AlbumEntry.vue';
    import AlbumHeader from '@/components/album/AlbumHeader.vue';
    import FindSources from '@/components/contextMenus/FindSources.vue'
    export default {
        name: "AddAlbumToPlaylist",
        components: {
            FindSources,
            AlbumEntry,
            AlbumHeader
        },
        props: {
            cover: String,
            artist: String,
            title: String,
            href: String,
            id: String,
            userData: Object
        },
        data() {
            return {
                showModal: false,
                selectedPlaylist: -1,
                playlist: [],
                editSong: false
            }
        },
        computed: {
            playlists() {
                return (this.userData?.data?.playlists || [ ]).map(x => x?.name);
            },
        },
        methods: {
            share() {
                window.open(this.href)
            },
            preview() {
                console.log(this.href)
                const event = new CustomEvent('player.play', { detail: {
                    artist: this.artist,
                    title: this.title,
                    source: this.href
                } });
                window.dispatchEvent(event);
            },
            close() {
                this.showModal = false
                this.$emit("close")
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
                const track = this.playlist[index]
                const id = this.playlists.findIndex(x => x == this.selectedPlaylist)

                console.log(track, id)

                if (id < 0) {
                    alert("no playlist selected")
                    return
                }

                this.userData.data.playlists[id].songs.push({
                    source: track.src,
                    title: track.title,
                    artist: track.artists.join(", "),
                    album: this.title,
                    cover: this.cover,
                    duration: "-1:59"
                })

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

                track.added = true;
            }
        },
        watch: {
            showModal() {
                if (!this.showModal)
                {
                    return
                }

                fetch("/spotify/album", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            accessToken: window.location.hash.split("=")[1],
                            albumId: this.id
                        })
                    }).then(x => x.json())
                    .then(jdata => {
                        this.playlist.length = 0
                        this.playlist.push(...jdata)
                    })
            }
        }
    }
</script>


<style lang="scss">
    $mobileWidth: 950px;

    .modal-containerr {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #0000;
        cursor: default;
    }

    .addAlbumToPlaylistPopup {
        position: relative;
        width: 60%;
        max-height: 70vh;

        @media screen and (max-width: $mobileWidth) {
            width: 100% !important;
            max-height: 100vh;
        }

        padding: 16px;
        overflow: auto;
        background: var(--font-contrast);
        border-radius: 10px;
        color: var(--font-colour);
    }
    
    h3 {
        margin: 0;
    }
</style>

<style scoped lang="scss">

    $mobileWidth: 950px;

    .share {
        &:hover {
            cursor: pointer;
        }

        &.fill {
            font-variation-settings: 'FILL' 1;
        }
    }

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

        img {
            width: 20%;
            margin-right: 20px;
            border-radius: 5px;
        }

        @media screen and (max-width: $mobileWidth) {
            flex-direction: column;

            img {
                align-self: center;
                width: 40%;
                margin-right: 0;
            }
        }
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

        @media screen and (max-width: $mobileWidth) {
            font-size: 1.4em;
        }
    }

    .playlisteditor>.details>.detailswrapper {
        font-size: .8em;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        @media screen and (max-width: $mobileWidth) {
            justify-content: center;
        }
    }  

    .playlisteditor>.details>.detailswrapper>.share {
        line-height: 15px;
        font-size: 15px;
        margin-left: 10px;

        @media screen and (max-width: $mobileWidth) {
            margin-top: 10px;

            &:nth-child(2) {
                margin-left: 0;
            }
        }
    }

    .playlisteditor>.details>h5 {
        font-size: .8em;
        margin: 0;
    }
</style>