<template>
    <div class="wrapper">
        <div class="item" @click="redirect">
            <img :src="cover" />
            <h4>{{title}}</h4>
            <p v-html="description" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PlaylistItem',
        methods: {
            redirect() {
                if (!this.spotify)
                {
                    this.$router.push(this.href)
                }
                else
                {
                    this.$refs.import.showModal = true
                }
            }
        },
        props: {
            cover: String,
            title: String,
            description: String,
            href: String,
            spotify: Boolean,
            id: String
        }
    }
</script>

<style scoped>
    p.note {
        font-size: .7em;
    }

    .wrapper {
        background: var(--background-light);
        border-radius: 20px;
        min-height: 10vh;
        margin: 10px;
    }

    .wrapper:hover {
        cursor: pointer;
        background: var(--hover-1);
    }

    .item {
        padding: 20px;
        height: calc(100% - 40px);
    }

    img {
        width: 100%;
        border-radius: 12px;
    }

    h4 {
        margin: 0;
    }

    p {
        margin: 0;
        color: var(--font-darker);
        font-size: .8em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
