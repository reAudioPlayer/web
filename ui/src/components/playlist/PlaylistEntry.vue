<template>
<SongCtx @download="download" @addto="addToPlaylist" @remove="remove" @update="update" @like="favourited = !favourited" :isAutoPlaylist="isAutoPlaylist" :liked="favourited" ref="ctxMenu">
    <EditSong :userData="userData" @close="updatePlaylist" ref="editSongPopup" :cover="cover" :id="id" :title="title" :album="album" :artist="artist" :source="source" />
    <div @dblclick="() => { playAt(); onselect() }" @click="onselect" @mouseover="displayPlay" @mouseleave="displayId" class="playlistEntry hideIfMobile"
        :class="{ 'selected': highlighted }">
        <span @click="playAt" ref="idOrPlay" :class="{ 'playing': playing }" class="id">{{index + 1}}</span>
        <div class="track">
            <img :src="cover || '/assets/img/music_placeholder.png'">
            <div class="trackwrapper">
                <span class="title" :class="{ 'playing': playing }">
                    <!--router-link class="linkOnHover" :to="`/track/${trackId}`"-->
                        <Marquee :text="title" />
                    <!--/router-link-->
                </span>
                <span class="artist" :class="{ 'playing': playing }">
                    <!--router-link class="linkOnHover" :to="`/search/${artist}`"-->
                        <Marquee :text="artist" />
                    <!--/router-link-->
                </span>
            </div>
        </div>
        <span class="album" :class="{ 'playing': playing }"><Marquee :text="album" /></span>
        <span @click="favourited = !favourited" class="favourite material-symbols-rounded" :class="{ 'showfavourite': favourited || highlighted, 'active': favourited }">favorite</span>
        <span class="duration">{{duration}}</span>
        <span @click="showCtxMenu" class="more material-symbols-rounded" :class="{ 'hidden': !highlighted }">more_horiz</span>
    </div>
    <div class="mobilePlaylist showIfMobile">
        <div class="track">
            <img @click="playAt" :src="cover || '/assets/img/music_placeholder.png'">
            <div class="trackwrapper">
                <span class="title" :class="{ 'playing': playing }">
                    <!--router-link class="linkOnHover" :to="`/track/${trackId}`"-->
                        <Marquee :text="title" />
                    <!--/router-link-->
                </span>
                <span class="artist" :class="{ 'playing': playing }">
                    <!--router-link class="linkOnHover" :to="`/search/${artist}`"-->
                        <Marquee :text="artist" />
                    <!--/router-link-->
                </span>
            </div>
        </div>
        <span @click="showCtxMenu" class="more material-symbols-rounded">more_horiz</span>
    </div>
</SongCtx>
</template>

<script>
    import SongCtx from '../contextMenus/SongCtx.vue'
    import Marquee from '../Marquee.vue'
    import EditSong from '../popups/EditSong.vue'

    import Hashids from 'hashids'
    const hashidsTrack = new Hashids("reapOne.track", 22)
    const hashidsPlaylist = new Hashids("reapOne.playlist", 22)

    export default {
        name: 'PlaylistEntry',
        components: {
            SongCtx,
            Marquee,
            EditSong
        },
        props: {
            index: Number,
            id: Number,
            source: String,
            artist: {
                type: String,
                default: "N/A"
            },
            cover: {
                type: String,
                default: "/assets/img/music_placeholder.png"
            },
            title: {
                type: String,
                default: "N/A"
            },
            album: {
                type: String,
                default: "N/A"
            },
            duration: {
                type: String,
                default: "N/A"
            },
            favourite: {
                type: Boolean,
                default: false
            },
            playing: {
                type: Boolean,
                default: false
            },
            userData: Object
        },
        data() {
            return {
                highlighted: false,
                favourited: this.favourite,
                isAutoPlaylist: this.$route.path == "/collection/tracks"
            }
        },
        computed: {
            trackId() {
                return hashidsTrack.encode(this.id);
            }
        },
        methods: {
            getPlaylistId() {
                return hashidsPlaylist.decode(this.$route.params.id);
            },
            download() {
                this.$emit("download", this.index)
            },
            addToPlaylist(index) {
                fetch("/api/add", {
                    method: "POST",
                    body: JSON.stringify({
                        id: index,
                        source: this.source // song already exists, metadata unecessary
                    })
                }).then(x => {
                    if (x.status == 200)
                    {
                        this.$emit("requestUpdate")
                    }
                })
            },
            remove() {
                fetch("/api/remove", {
                    method: "POST",
                    body: JSON.stringify({
                        playlistId: Number(this.getPlaylistId()),
                        songId: this.id
                    })
                }).then(x => {
                    if (x.status == 200)
                    {
                        this.$emit("requestUpdate")
                    }
                })
            },
            update() {
                this.$refs.editSongPopup.showModal = true
            },
            hideCtxMenu() {
                this.$refs.ctxMenu.hide()
            },
            showCtxMenu(evt) {
                console.log("show")
                this.$refs.ctxMenu.show(evt)
            },
            onselect() {
                this.highlighted = !this.highlighted
                this.hideCtxMenu()
            },
            displayPlay() {
                const element = this.$refs.idOrPlay
                element.innerHTML = "play_arrow"
                element.classList.add("material-symbols-rounded")
            },
            displayId() {
                const element = this.$refs.idOrPlay
                element.innerHTML = this.index + 1
                element.classList.remove("material-symbols-rounded")
            },
            playAt() {
                console.log(this.$route.path)
                const body = {
                    index: this.index,
                }
                if (this.$route.path.includes("/playlist/"))
                {
                    body.playlistIndex = Number(this.getPlaylistId())
                }
                if (this.$route.path.includes("/collection/tracks"))
                {
                    body.type = "collection"
                }
                
                const event = new CustomEvent('player.play', { detail: {
                        id: this.id,
                        favourite: this.favourited,
                        album: this.album,
                        artist: this.artist,
                        title: this.title,
                        duration: this.duration,
                        cover: this.cover,
                        source: this.source
                    } });
                window.dispatchEvent(event);
            },
            setFavourite() {

                for (const playlist of this.userData.data.playlists)
                {
                    for (const song of playlist.songs)
                    {
                        if (song.id == this.id)
                        {
                            if (song.favourite == this.favourited ? 1 : 0) {
                                return;
                            }

                            song.favourite = this.favourited ? 1 : 0
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
                return;
            }
        },
        watch: {
            favourited() {
                this.setFavourite()
            },
            favourite() {
                console.log("mounted", this.title, this.favourite, this.favourited)
                this.favourited = this.favourite
                this.highlighted = false
            }
        }
    }
</script>

<style scoped lang="scss">

    div.mobilePlaylist {
        display: flex;
        flex-direction: row;
        align-items: center;

        .track {
            flex: 1;
        }

        .trackwrapper {
            flex-grow: 1;
            max-width: 68vw;

            .title {
                font-size: .8em;
            }

            .artist {
                color: var(--font-darker);
                font-size: .7em;
            }
        }
    }

    div.playlistEntry {
        padding-top: 7px;
        padding-bottom: 7px;
        height: var(--playlistEntry-height);
        display: flex;
        flex-direction: row;
        color: var(--font-darker);
        font-size: 0.91em;
        border-radius: 5px;
    }

    div.playlistEntry:hover {
        background-color: var(--hover-1);
    }

    div.playlistEntry.selected {
        background-color: var(--hover-2);
    }

    .id {
        width: 50px;
        text-align: right;
        line-height: var(--playlistEntry-height);
        flex-shrink: 0;

        font-variation-settings:
            'FILL' 1,
            'opsz' 60
    }

    .favourite {
        width: 50px;
        text-align: right;
        line-height: var(--playlistEntry-height);
        margin-right: 10px;
        visibility: hidden;
        font-size: 1.4em;
        flex-shrink: 0;

        &.active {
            font-variation-settings: 'FILL' 1;
        }
    }

    .hidden {
        visibility: hidden;

        &.more {
            display: inherit !important;
        }
    }

    div.playlistEntry:hover .favourite, .showfavourite, div.playlistEntry:hover .more {
        visibility: visible;
    }

    .favourite:hover {
        cursor: pointer;
    }

    .id:hover {
        cursor: pointer;
    }

    .track {
        width: 50%;
        margin-left: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-shrink: 0;
    }

    .title, .artist {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--font-colour);
        max-width: 100%;
        
        &.artist {
            color: var(--font-darker);
        }
    }

    .title.playing, .id.playing {
        color: var(--accent);
    }

    .id.playing.material-icons-round {
        color: var(--font-darker);
    }

    .album {
        flex-grow: 1;
        margin-left: 5px;
        line-height: var(--playlistEntry-height);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    div.playlistEntry:hover .album,
    div.playlistEntry:hover .artist,
    div.playlistEntry:hover .id,
    div.playlistEntry.selected .album,
    div.playlistEntry.selected .artist,
    div.playlistEntry.selected .id {
        color: var(--font-colour);
    }

    img {
        height: 40px;
        margin-right: 10px;
        display: inline;
        border-radius: 5px;
    }

    .trackwrapper {
        display: flex;
        flex-direction: column;
        margin-right: 100px;
        align-items: flex-start;
        width: calc(100% - 60px);
    }

    .duration {
        text-align: right;
        margin-right: 20px;
        line-height: var(--playlistEntry-height);
        width: 50px;
        flex-shrink: 0;
    }

    .more {
        line-height: var(--playlistEntry-height);
        width: 20px;
        margin-right: 20px;
    }

    .more:hover {
        cursor: pointer;
    }
</style>