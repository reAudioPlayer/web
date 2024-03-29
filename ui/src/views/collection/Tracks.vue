<template>
    <div class="playlist">
        <fixed-playlist-header @loadPlaylist="loadPlaylist" ref="fixedHeading" :class="{ 'hidden': fixedHeaderHidden }" title="Liked Songs" />
        <div class="padding-20 playlisteditor" v-observe-visibility="headerVisibilityChanged">
            <h7>Playlist</h7>
            <h1>Liked Songs</h1>
            <p class="muted description">{{autogeneratedDescription}}</p>
        </div>
        <div class="mobileMenu showIfMobile">
            <span @click="() => $emit('toggleFullSidebar')" class="material-symbols-rounded">menu</span>
        </div>
        <hr>
        <div class="padding-20">
            <span id="loadPlaylist" @click="loadPlaylist" class="material-symbols-rounded">play_circle</span>
            <div class="grid">
                <grid-header class="hideIfMobile" />
                <hr>
                <div class="playlistEntries">
                    <playlist-entry v-for="(element, index) in likedTracks" @download="download" :key="index" @requestUpdate="updatePlaylist" :userData="userData" :index="likedTracks.findIndex(x => x.source == element.source)" :source="element.source" :playing="element.playing" :id="element.id" :title="element.title" :album="element.album" :artist="element.artist" :cover="element.cover" :favourite="element.favourite" :duration="element.duration" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import FixedPlaylistHeader from '@/components/playlist/FixedPlaylistHeader.vue'
    import GridHeader from '@/components/playlist/GridHeader.vue'
    import PlaylistEntry from '@/components/playlist/PlaylistEntry.vue'
    import EditPlaylist from '@/components/popups/EditPlaylist.vue'
    import AddSong from "@/components/popups/AddSong.vue"

    import Hashids from 'hashids'
    const hashids = new Hashids("reapOne.playlist", 22)

    export default {
        components: {
            PlaylistEntry,
            FixedPlaylistHeader,
            GridHeader,
            AddSong,
            EditPlaylist
        },
        name: 'LikedSongs',
        props: {
            authorised: Boolean,
            userData: Object
        },
        data() {            
            return {
                fixedHeaderHidden: true
            }
        },        
        computed: {
            rawPlaylists() {
                return this.userData?.data?.playlists || [ ];
            },
            likedTracks() {
                console.log(this.rawPlaylists)
                return this.rawPlaylists.map(x => x.songs).flat().filter(x => x.favourite == 1);
            },
            autogeneratedDescription() {
                return `${this.userData?.user?.userinfo?.name} • ${this.likedTracks.length} ${this.likedTracks.length == 1 ? "song" : "songs"}, ${this.estimatedDuration}`
            },
            estimatedDuration() {
                let duration = 0;
                let isEstimate = false;

                for (const song of this.likedTracks)
                {
                    isEstimate = isEstimate || ("-1:59" == song.duration);
                    const songDurString = song.duration == "-1:59" ? "3:00" : song.duration; // estimate 3:00 if unknown
                    const [ min, sec ] = songDurString.split(":")
                    duration += Number(min * 60) + Number(sec);
                }

                const sec = duration;
                const min = Math.floor(sec / 60);
                const hs = Math.floor(min / 60);

                const prefix = isEstimate ? "about " : ""

                if (hs)
                {
                    return prefix + `${hs} hr ${min - hs * 60} min`
                }

                if (min)
                {
                    return prefix + `${min} min ${sec - min * 60} sec`
                }

                return prefix + duration + " sec";
            }
        },
        methods: {
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
            }
        }
    }
</script>

<style scoped>
    p.muted.description {
        color: var(--font-darker);
        font-weight: normal;
        font-size: .7em;
        margin: 0;
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