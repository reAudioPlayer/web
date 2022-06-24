<script setup>
import Lock from "./views/Lock.vue";
</script>

<template>
    <div class="body">
        <router-view v-if="authorised" @toggleFullSidebar="() => $emit('toggleFullSidebar')" :authorised="authorised" :userData="userData" />
        <Lock v-else />
    </div>
</template>

<script>
export default {
    name: "Body",
    props: {
        noSidebar: Boolean,
        authorised: Boolean,
        userData: Object
    },
    computed: {
        authorised() {
            return Object.keys(this.userData).length || ["/about/privacy", "/"].includes(this.$route.path)
        }
    }
}
</script>

<style lang="scss" scoped>
    $mobileWidth: 950px;

    div.body {
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        max-width: calc(100vw - var(--sidebar-width));
        max-height: calc(100vh);

        &.noSidebar {
            max-width: 100vw;
        }

        @media screen and (max-width: $mobileWidth) {
            max-width: 100vw;
        }
    }
</style>