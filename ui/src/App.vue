<script setup>
import Sidebar from './Sidebar.vue'
import Body from "./Body.vue";
</script>

<template>
<div class="appRoot">
    <Sidebar :authorised="authorised" :userData="userData" />
    <Body :authorised="authorised" :userData="userData" />
</div>
</template>

<script>

import themes from "./assets/themes.json";

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
            userData: { },
            authorised: false
        }
    }
}
</script>

<style lang="scss">
.material-symbols-rounded {
    font-variation-settings:
    'FILL' 0,
    'wght' 100,
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
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
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
        flex-direction: row;
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
