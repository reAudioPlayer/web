<template>
    <div class="padding-20">
        <CollectionHeader @toggleFullSidebar="() => $emit('toggleFullSidebar')" />
        <div class="playlists">
            <full-shelf heading="Playlists">
                <playlist-item-big v-if="likedTracks?.length" title="Liked Songs" :description="`${likedTracks?.length} liked Songs`" href="/collection/tracks" />
                <playlist-item v-for="(element, index) in playlists" :key="index" :href="element.href" :cover="element.cover"
                    :description="element.description" :title="element.name" :spotify="false" />
            </full-shelf>
        </div>
    </div>
</template>

<script>
    import FullShelf from '@/components/catalogue/FullShelf.vue'
    import PlaylistItem from '@/components/catalogue/items/playlists/PlaylistItem.vue'
    import PlaylistItemBig from '@/components/catalogue/items/playlists/PlaylistItemBig.vue'
    import CollectionHeader from '@/components/CollectionHeader.vue'

    import Hashids from 'hashids'
    const hashids = new Hashids("reapOne.playlist", 22)

    export default {
        components: {
            CollectionHeader,
            PlaylistItem,
                FullShelf,
                PlaylistItemBig
        },
        name: 'Playlists',
        props: {
            authorised: Boolean,
            userData: Object
        },
        computed: {
            rawPlaylists() {
                return this.userData?.data?.playlists || [ ];
            },
            playlists() {
                const ret = [ ];

                for (let i = 0; i < this.rawPlaylists.length; i++)
                {
                    const pl = this.rawPlaylists[i]
                    ret.push({
                        name: pl.name,
                        description: pl.description,
                        cover: pl.songs?.[0]?.cover || "/assets/img/music_placeholder.png",
                        href: `/playlist/${hashids.encode(i)}`
                    })
                }

                return ret;
            },
            likedTracks() {
                return this.rawPlaylists.map(x => x.songs).flat().filter(x => x.favourite == 1);
            }
        }
    }
</script>

<style scoped>
    .padding-20 {
        padding: 20px;
    }
</style>