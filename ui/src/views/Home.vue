<template>
    <div class="home">
        <h1>
            reAudioPlayer One - Web
        </h1>
        <h2>
            reAudioPlayer One, always available for you
        </h2>
        <h4>
            This site is currently in beta. New features are continuously being added.
        </h4>
        <div class="mobileMenu showIfMobile">
            <span @click="toggleFullSidebar" class="material-symbols-rounded">menu</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
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
        align-content: center;
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
</style>