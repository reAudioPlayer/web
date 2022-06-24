<script setup>
import NavEntry from '@/components/sidebar/NavEntry.vue'
</script>

<template>
    <div class="home">
        <span class="material-symbols-rounded">lock</span>
        <br>
        you need to log in to access this page.
        <div class="navwrap">
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
export default {
    name: "Lock",
    props: {
        userData: Object,
        authorised: Boolean
    },
    methods: {
        toggleFullSidebar()
        {
            console.log("hey")
            this.$emit("toggleFullSidebar")
        }
    }
}
</script>

<style lang="scss" scoped>
    $horizontalWidth: 1200px;
    $mobileWidth: 950px;

    .home {
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        overflow-y: auto;

        h1 {
            font-size: 5em;

            @media screen and (max-width: $mobileWidth) {
                font-size: 2em;
            }
        }

        h2 {
            font-size: 1.3em;

            @media screen and (max-width: $mobileWidth) {
                font-size: .8em;
            }
        }

        h4 {
            @media screen and (max-width: $mobileWidth) {
                font-size: .7em;
            }
        }

        a {
            color: var(--font-colour);
        }
    }

    .material-symbols-rounded {
        font-size: 6em;
        font-variation-settings: 'wght' 700;
    }

    .navwrap {
        padding: 10px;
        min-width: 120px;
        max-width: 280px;
    }
</style>