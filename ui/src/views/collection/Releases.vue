<template>
    <div class="padding-20">
        <CollectionHeader @toggleFullSidebar="() => $emit('toggleFullSidebar')" />
        <div class="releases">
            <full-shelf v-if="outSoon.length" heading="Out Soon">
                <item-big v-for="element in outSoon" :key="element.url" :userData="userData" :releaseDate="element.releaseDate" :cover="element.cover" :href="element.url" :artist="element.artists.join(', ')" :title="element.title" />
            </full-shelf>
            <full-shelf v-if="outNow.length" heading="Out Now">
                <ItemBig v-for="element in outNow" :key="element.url" :userData="userData" :releaseDate="element.releaseDate" :cover="element.cover" :href="element.url" :artist="element.artists.join(', ')" :title="element.title" />
            </full-shelf>
            <full-shelf v-if="outAlready.length" heading="Releases">
                <Item v-for="element in outAlready" :key="element.url" :userData="userData" :releaseDate="element.releaseDate" :cover="element.cover" :href="element.url" :artist="element.artists.join(', ')" :title="element.title" />
            </full-shelf>
        </div>
    </div>
</template>

<script>
import FullShelf from '@/components/catalogue/FullShelf.vue'
import Item from '@/components/catalogue/items/release/ReleaseItem.vue'
import ItemBig from '@/components/catalogue/items/release/ReleaseItemBig.vue'
import CollectionHeader from '@/components/CollectionHeader.vue'
    export default {
        components: { CollectionHeader, FullShelf, Item, ItemBig },
        name: 'Releases',
        props: {
            authorised: Boolean,
            userData: Object
        },
        data() {
            return {
                outSoon: [ ],
                outNow: [ ],
                outAlready: [ ]
            }
        },
        methods: {
            load(jdata) {
                const today = new Date()

                for (const album of jdata)
                {
                    const releaseDate = new Date(album.releaseDate)

                    if (today < releaseDate)
                    {
                        this.outSoon.push(album)
                    }
                    else if (today.getMonth() == releaseDate.getMonth() && today.getDate() == releaseDate.getDate() && today.getFullYear() == releaseDate.getFullYear())
                    {
                        this.outNow.push(album)
                    }
                    else
                    {
                        this.outAlready.push(album)
                    }
                }
            }
        },
        mounted() {
            const cacheName = "apollo.releaseCache"
            const cache = window.localStorage.getItem(cacheName);

            if (!window.location.hash && this.userData.tokens?.spotifyApiId && this.userData.tokens?.spotifyApiSecret)
            {
                const redirectUri = "https://reaudioplayer.tk/collection/releases"
                const scope = "user-follow-read playlist-modify-public"

                window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.userData.tokens.spotifyApiId}&redirect_uri=${redirectUri.replace("#", "%23")}&scope=${scope}&response_type=token&state=123`
                return;
            }

            if (cache && (new Date() - new Date(JSON.parse(cache).requested)) < 30 * 60 * 1000)
            {
                this.load(JSON.parse(cache).data);  
            }
            else if (window.location.hash)
            {
                fetch("/spotify/releaseRadar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        accessToken: window.location.hash.split("=")[1]
                    })
                })  .then(x => x.json())
                    .then(jdata => {
                        window.localStorage.setItem(cacheName, JSON.stringify({
                            requested: new Date(),
                            data: jdata
                        }))
                        this.load(jdata);
                    })
            }
        }
    }
</script>

<style scoped>
    .padding-20 {
        padding: 20px;
    }
</style>
