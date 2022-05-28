<template>
    <div class="sidebar">
        <div class="static">
            <div class="collapseSidebar" :class=" { 'minimised': minimised } ">
                <h2 v-if="!minimised" @click="onLogoClick">reAudioPlayer Web</h2>
                <span @click="minimised = !minimised"
                    class="hideIfMobile clickSymbol material-symbols-rounded">{{ minimised ? "chevron_right" : "chevron_left" }}</span>
            </div>
            <nav-entry :minimised="minimised" href="/" icon="home" name="Home" />
            <nav-entry :minimised="minimised" href="/preferences" icon="settings" name="Settings" />
            <nav-entry :minimised="minimised" href="/collection/playlists" icon="library_music" name="Your Library"
                :hasChildSites="true" parentHref="/collection" />
            <br>
            <nav-entry v-if="false" :minimised="minimised" href="/download" icon="download_for_offline" name="Download" />
            <br v-if="showNewsTab || showSportsTab">
            <nav-entry :minimised="minimised" v-if="showNewsTab && false" href="/news" icon="newspaper" name="News"
                :hasChildSites="true" />
            <nav-entry :minimised="minimised" v-if="showSportsTab && false" href="/sports" icon="sports_soccer" name="Sports"
                :hasChildSites="true" />
            <br>
            <nav-entry v-if="false" :minimised="minimised" href="/playlist/create" icon="add_circle" name="Create Playlist" />
            <nav-entry v-if="false" :minimised="minimised" href="/collection/tracks" icon="favorite" name="Liked Songs" />
        </div>
        <div class="user">
            <nav-entry v-if="!authorised" :minimised="minimised" :external="true" href="/login" icon="login" name="Login" />
            <template v-else-if="userData">
                <router-link class="link userData" to="/preferences">
                    <img :src="userData?.user?.userinfo?.picture">
                    <div v-if="!minimised" >{{userData?.user?.userinfo?.name}}</div>
                </router-link>
                <nav-entry :minimised="minimised" :external="true" href="/logout" icon="logout" name="Logout" />
            </template>
        </div>
    </div>
</template>

<script>
    import NavEntry from '@/components/sidebar/NavEntry.vue'

    import Hashids from 'hashids'
    const hashids = new Hashids("reapOne.playlist", 22)

    export default {
        name: 'Sidebar',
        components: {
            NavEntry
        },
        props: {
            expandCover: Boolean,
            authorised: Boolean,
            userData: Object
        },
        watch: {
            minimised() {
                document.documentElement.style.setProperty("--sidebar-width", this.minimised ? "24px" : "200px");
                window.localStorage.setItem("player.collapsedSidebar", this.minimised)
            }
        },
        data() {
            const minimised = window.localStorage.getItem("player.collapsedSidebar") == "true";

            document.documentElement.style.setProperty("--sidebar-width", minimised ? "24px" : "200px");

            return {
                playlists: [],
                cover: "/assets/img/music_placeholder.png",
                showSportsTab: window.localStorage.getItem("sidebar.showSportsTab") == "true",
                showNewsTab: window.localStorage.getItem("sidebar.showNewsTab") == "true",
                minimised
            }
        },
        methods: {
            hideCover() {
                this.$emit("expandCover", false)
            },
            onLogoClick() {
                this.$router.push("/")
            },
            updateData(jdata) {
                if (jdata.path == "player.song") {
                    this.cover = jdata?.data?.cover || "/assets/img/music_placeholder.png"
                    return;
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    a.userData {
        padding: 10px 0 10px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;

        border-radius: 5px;

        text-decoration: none;
        color: var(--font-darker);

        &:hover {
            background-color: var(--hover-1);
            cursor: pointer;
            color: var(--font-colour);
        }

        img {
            width: 20px;
            margin-right: 20px;
            border-radius: 50%;
        }
    }

    .collapseSidebar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 90px;

        &.minimised {
            justify-content: center;
        }

        .clickSymbol {
            border-radius: 5px;

            &:hover {
                cursor: pointer;
                background: var(--hover-2);
            }
        }
    }

    .static {
        flex-shrink: 0;
        flex-grow: 0;
    }

    h2 {
        margin-bottom: 0;
    }

    .cover {
        height: calc(var(--sidebar-width) + 40px);
        width: calc(var(--sidebar-width) + 40px);
        transform: translate(-10px, 10px);
    }

    .playlistList {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;

        &.expanded {
            padding: 0px 10px;
        }
    }

    .playlistList>a {
        font-size: 0.92em;
        text-decoration: none;
        color: var(--font-darker);
        margin-bottom: 4px;
        margin-top: 4px;
    }

    .playlistList>a:hover {
        color: var(--font-colour)
    }

    hr {
        width: 100%;
    }

    div.sidebar {
        background: var(--sidebar-background);
        width: calc(var(--sidebar-width) + 20px);
        min-width: calc(var(--sidebar-width) + 20px);
        display: flex;
        flex-direction: column;
        padding: 10px;
        max-height: calc(100vh - 20px);
        height: 100%;
        z-index: 1;
        justify-content: space-between;
    }

    h2:hover {
        cursor: pointer;
    }

    h2 {
        margin: 0;
        padding: 10px;
    }
</style>