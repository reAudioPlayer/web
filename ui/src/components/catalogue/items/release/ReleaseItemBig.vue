<template>
    <div class="itemBig">
        <add-album-to-playlist :id="this.href?.replace('https://open.spotify.com/album/', '')" :userData="userData" :cover="cover" :title="title" :artist="artist" :href="href" ref="addAlbum" />
        <div class="item" @click="redirect">
            <img :src="cover" />
            <div class="wrapper">
                <h4>{{title}}</h4>
                <p>{{artist}}</p>
                <p class="note" v-if="releaseDate">Released on {{releaseDate}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import AddAlbumToPlaylist from '@/components/popups/AddAlbumToPlaylist.vue'
    export default {
        name: 'ReleaseItemBig',
        components: {
            AddAlbumToPlaylist
        },
        methods: {
            redirect() {
                this.$refs.addAlbum.showModal = true
                //this.$router.push(`/album/spotify/${this.href.replace("https://open.spotify.com/album/", "")}`)
            }
        },
        props: {
            cover: String,
            title: String,
            artist: String,
            href: String,
            releaseDate: String,
            userData: Object
        }
    }
</script>

<style scoped>
    p.note {
        font-size: .8em;
    }

    .itemBig {
        grid-column: span 2;
        background: var(--background-light);
        border-radius: 20px;
        min-height: 10vh;
        margin: 10px;
    }

    .item {
        display: flex;
        flex-direction: row;
        padding: 20px;
        height: calc(100% - 40px);
    }

    .wrapper {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .itemBig:hover {
        cursor: pointer;
        background: var(--hover-1);
    }

    img {
        width: 50%;
        border-radius: 12px;
    }

    h4 {
        margin: 0;
        font-size: 1.2em;
    }

    p {
        margin: 0;
        color: var(--font-darker);
        font-size: .9em;
    }
</style>
