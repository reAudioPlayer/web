<template>
    <div class="playlist">
        <EditPlaylist @close="updatePlaylist" :playlistName="playlistName" :playlistDescription="playlistDescription" ref="editPlaylistPopup" :userData="userData" />
        <fixed-playlist-header @loadPlaylist="loadPlaylist" ref="fixedHeading" :class="{ 'hidden': fixedHeaderHidden }" :title="playlistName" />
        <div class="padding-20 playlisteditor" @click="editPlaylist" v-observe-visibility="headerVisibilityChanged">
            <h7>Playlist</h7>
            <h1>{{playlistName}}</h1>
            <h5>{{playlistDescription}}</h5>
        </div>
        <hr>
        <div class="padding-20">
            <span id="loadPlaylist" @click="loadPlaylist" class="material-symbols-rounded">play_circle_filled</span>
            <span id="addToPlaylist" @click="addToPlaylist" class="material-symbols-rounded">add_circle</span>
            <div class="grid">
                <grid-header />
                <hr>
                <div class="playlistEntries">
                    <playlist-entry v-for="(element, index) in playlist" @download="download" :key="index" @requestUpdate="updatePlaylist" :userData="userData" :index="playlist.findIndex(x => x.source == element.source)" :source="element.source" :playing="element.playing" :id="element.id" :title="element.title" :album="element.album" :artist="element.artist" :cover="element.cover" :favourite="element.favourite" :duration="element.duration" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import FixedPlaylistHeader from '../components/playlist/FixedPlaylistHeader.vue'
    import GridHeader from '../components/playlist/GridHeader.vue'
    import PlaylistEntry from '../components/playlist/PlaylistEntry.vue'
    import EditPlaylist from '../components/popups/EditPlaylist.vue'

    import Hashids from 'hashids'
    const hashids = new Hashids("reapOne.playlist", 22)

    export default {
        components: {
            PlaylistEntry,
            FixedPlaylistHeader,
            GridHeader,
            EditPlaylist
        },
        name: 'Playlist',
        props: {
            authorised: Boolean,
            userData: Object
        },
        data() {
            this.updatePlaylist()

            if (!this.getId())
            {
                return
            }
            if (!this.$route.path.includes("/playlist/"))
            {
                return;
            }

            /*if (this.$route.params.id == "create")
            {
                fetch("/api/playlist/create")
                    .then(x => x.text()).then(y => {
                        const link = hashids.encode(y);
                        console.log(link)
                        this.$router.push(link)
                    })
                return
            }*/

            const jdata = this.userData?.data?.playlists?.[Number(this.getId())]
            document.title = `${this.playlistName} - reAudioPlayer One`;
            console.log(jdata.songs)
            const playlist = jdata.songs
            const playlistName = jdata.name
            const playlistDescription = jdata.description
            
            return {
                fixedHeaderHidden: true,
                playlist,
                playlistName,
                playlistDescription
            }
        },
        methods: {
            getId() {
                return hashids.decode(this.$route.params.id);
            },
            download(index) {
                const data = this.playlist?.[index]
                window.open("/api/download/" + data.id)
            },
            updatePlaylist() {
                if (!this.getId())
                {
                    return
                }
                if (!this.$route.path.includes("/playlist/"))
                {
                    return;
                }

                /*if (this.$route.params.id == "create")
                {
                    fetch("/api/playlist/create")
                        .then(x => x.text()).then(y => {
                            const link = hashids.encode(y);
                            console.log(link)
                            this.$router.push(link)
                        })
                    return
                }*/

                const jdata = this.userData?.data?.playlists?.[Number(this.getId())]
                document.title = `${this.playlistName} - reAudioPlayer One`;
                console.log(jdata.songs)
                this.playlist = jdata.songs
                this.playlistName = jdata.name
                this.playlistDescription = jdata.description
            },
            onPlaylistRearrange(type) {
                const moved = type.moved
                
                if (!moved)
                {
                    return;
                }

                fetch("/api/rearrange", {
                    method: "POST",
                    body: JSON.stringify({
                        playlistIndex: Number(this.getId()),
                        songOldIndex: moved.oldIndex,
                        songNewIndex: moved.newIndex
                    })
                })
            },
            headerVisibilityChanged(a) {
                this.fixedHeaderHidden = a
            },
            updateData(jdata) {
                if (jdata.path == "player.song")
                {
                    let title = jdata?.data?.title || "N/A"

                    for (const entry of this.playlist)
                    {
                        entry.playing = entry.title == title;
                    }
                }
            },
            loadPlaylist() {
                fetch("/api/loadPlaylist", {
                    method: "POST",
                    body: JSON.stringify({
                        id: Number(this.getId()),
                        type: "playlist"
                    })
                })
            },
            editPlaylist() {
                this.$refs.editPlaylistPopup.showModal = true
            },
        },
        watch:{
            $route (){
                this.updatePlaylist()
            }
        }
    }
</script>

<style scoped>
    .playlisteditor:hover {
        cursor: pointer;
    }

    .playlistEntries {
        display: flex;
        flex-direction: column;
    }

    #loadPlaylist,
    #addToPlaylist {
        cursor: pointer;
        font-size: 60px;
        margin-bottom: 20px;
        width: 70px;
        line-height: 70px;
        text-align: center;
        align-items: center;
        vertical-align: middle;
    }

    #loadPlaylist:hover, #addToPlaylist:hover {
        cursor: pointer;
        font-size: 62px;
    }

    .padding-20 {
        padding: 20px;
    }

    h3 {
        text-transform: uppercase;
    }

    h7 {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.83em;
    }

    h1 {
        margin-block-start: 0.15em;
        margin-block-end: 0.15em;
        font-size: 2.91em;
    }

    .hidden {
        display: none !important;
    }

    h5 {
        color: var(--font-darker);
        font-weight: normal;
    }
</style>