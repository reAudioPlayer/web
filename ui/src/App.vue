<script setup>
import Sidebar from './Sidebar.vue'
import Body from "./Body.vue";
import PlayerInPicture from "./PlayerInPicture.vue";
</script>

<template>
<div class="appRoot">
    <div class="appRoot">
        <div class="bgImageWrapper" :class="{ hidden: !coverAsBackground }" ><div class="bgImage" :style="{ backgroundImage: `url(${cover})` }" /></div>
        <div class="interface">
            <Sidebar @toggleFullSidebar="fullSidebar = !fullSidebar" :authorised="authorised" :userData="userData" :show="fullSidebar" />
            <Body @toggleFullSidebar="fullSidebar = !fullSidebar" :authorised="authorised" :userData="userData" v-if="!fullSidebar" />
        </div>
        <PlayerInPicture v-if="!maximised" @expandCover="expandCover" :expandCover="!shallExpandCover" />
    </div>
</div>
</template>

<script>

import themes from "./assets/themes.json";
import "v-contextmenu/dist/themes/dark.css";

const LOCAL_STORAGE_KEY = "theme" // change it to whatever you like

window.getThemes = () => { // returns a string array of all available themes
    window.themes = []
    for (const key of Object.keys(themes)) {
        for (const theme of Object.keys(themes[key])) {
            if (!window.themes.includes(theme)) {
                window.themes.push(theme)
            }
        }
    }
    return window.themes;
}

window.getCurrentTheme = () => {
    return window.localStorage.getItem(LOCAL_STORAGE_KEY) || "default"
}

window.setTheme = (theme) => { // accepts a string (theme name)
    if (!window.getThemes().includes(theme) && theme != "dynamic") {
        return;
    }

    window.localStorage.setItem(LOCAL_STORAGE_KEY, theme)

    if (theme == "dynamic") {
        theme = "underground"
    }

    for (const key of Object.keys(themes)) {
        const value = themes[key]
        document.documentElement.style.setProperty(`--${key}`, value[theme] || value.default);
    }
}

window.setTheme(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "default") // optional, loads the default theme

export default {
    watch: {
        '$route' (to) {
            document.title = to.meta.title || 'reAudioPlayer Web'
        }
    },
    mounted() {
        fetch("/user").then(async res => {
            if (res.status == 401)
            {
                this.authorised = false;
                this.userData = { };
                return;
            }

            this.authorised = true;
            this.userData = await res.json()
        })
    },
    data() {
        return {
            fullSidebar: false,
            userData: { },
            authorised: false
        }
    }
}
</script>

<!-- Popups -->
<style lang="scss">
    .modal-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #0000;
    }

    .modal-content {
        position: relative;
        width: 40%;
        max-height: 70vh;
        padding: 16px;
        overflow: auto;
        background: var(--font-contrast);
        border-radius: 10px;
        color: var(--font-colour);
    }

    .modal-close {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        font-size: 1.5em;
        cursor: pointer;
        background: none;
        border: none;
        color: var(--font-darker);
    }

    h3 {
        margin: 0;
    }

    .modal-close:hover {
        color: var(--font-colour);
    }

    .material-symbols-rounded {
        font-variation-settings:
        'FILL' 0,
        'wght' 100,
        'GRAD' -25,
        'opsz' 48
    }
</style>

<style lang="scss">
    .v-contextmenu {
        background: var(--font-contrast) !important;
        font-family: var(--font-family) !important;
        border: 1px solid var(--hover-1);
        /*box-shadow: 2px 2px 8px 0 var(--hover-4) !important;
  --webkit-box-shadow: 2px 2px 8px 0 var(--hover-4) !important;*/
        box-shadow: none;
        --webkit-box-shadow: none;
        color: var(--font-colour) !important;
    }

    .v-contextmenu-divider {
        border-color: var(--border);
    }

    .v-contextmenu-item {
        color: var(--font-colour) !important;
        margin: 5px;
        padding: 10px 22px 10px 15px;
        border-radius: 5px;
    }

    .v-contextmenu-item--hover {
        background: var(--hover-1) !important;
    }
</style>

<style lang="scss">
.material-symbols-rounded {
    font-variation-settings:
    'FILL' 0,
    'wght' 300,
    'GRAD' -25,
    'opsz' 48
}

.linkOnHover {
    text-decoration: none;
    color: unset;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
        color: var(--font-colour);
    }
}

.hidden {
    display: none;
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
</style>

<style lang="scss">
    @import "./assets/css/scrollbars.css";

    #app {
        font-family: var(--font-family) !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        background: var(--background);
        color: var(--font-colour) !important;
    }

    $horizontalWidth: 1200px;
    $mobileWidth: 950px;

    .mobileMenu {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .hideIfMobile {
        @media screen and (max-width: $mobileWidth) {
            display: none !important;
        }
    }

    .showIfMobile {
        @media screen and (min-width: $mobileWidth) {
            display: none !important;
        }
    }

    hr {
        border-color: var(--font-darker)
    }

    div.interface {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        z-index: 2;
    }

    div.appRoot {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
    }

    html,
    body {
        margin: 0;
        padding: 0;
    }

    .bgImageWrapper {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 0 !important;
        background: black;
    }
</style>
