<template>
    <div ref="box" v-contextmenu:contextmenu>
        <slot />
        <v-contextmenu ref="contextmenu">
            <v-contextmenu-item @click="like">{{(liked ? 'Remove from' : 'Save to') + ' your Liked Songs'}}</v-contextmenu-item>
            <v-contextmenu-item v-if="false || !isAutoPlaylist" @click="remove">Remove from this playlist</v-contextmenu-item>
            <v-contextmenu-submenu v-if="false" title="Add to playlist">
                <v-contextmenu-item @click="() => addto('new')">Add to new playlist</v-contextmenu-item>
                <v-contextmenu-divider />
                <v-contextmenu-item v-for="(element, index) in playlists" :key="index" @click="() => addto(index)">{{element}}</v-contextmenu-item>
            </v-contextmenu-submenu>
            <v-contextmenu-divider />
            <v-contextmenu-item @click="update">Update Metadata</v-contextmenu-item>
        </v-contextmenu>
    </div>
</template>

<script>
    export default {
        name: "SongCtx",
        props: {
            liked: Boolean,
            isAutoPlaylist: Boolean
        },
        data() {
            return {
                playlists: [ ]
            }
        },
        methods: {
            hide() {
                this.$refs.contextmenu.hide()
            },
            show(evt) {
                const targetDimensions = this.$refs.box.getBoundingClientRect();

                const position = {
                    top: targetDimensions.height +
                        targetDimensions.top +
                        window.scrollY,
                    left: targetDimensions.width +
                        targetDimensions.left +
                        window.scrollX,
                };

                this.$refs.contextmenu.show(position)
                evt?.stopPropagation();
            },
            like() {
                this.$emit("like")
            },
            remove() {
                this.$emit("remove")
            },
            addto(index) {
                if (index === 'new')
                {
                    fetch("/api/playlist/create")
                        .then(x => x.text()).then(y => {
                            this.$emit("addto", Number(y.replace('/playlist/', '')))
                        })
                    return
                }

                this.$emit("addto", index)
            },
            download() {
                this.$emit("download")
            },
            update() {
                this.$emit("update")
            }
        }
    }
</script>