<template>
    <div class="itemBig">
        <div class="item" @click="redirect">
            <div class="wrapper">
                <h4>{{title}}</h4>
            <p>{{description}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ReleaseItemBig',
        methods: {
            redirect() {
                this.$router.push(this.href)
            }
        },
        props: {
            title: String,
            description: String,
            href: String
        }
    }
</script>

<style scoped lang="scss">
    $mobileWidth: 950px;

    p.note {
        font-size: .8em;
    }

    .itemBig {
        grid-column: span 2;
        background: linear-gradient(to bottom right, #450bf5, #8d8ce5);
        border-radius: 20px;
        min-height: 10vh;
        margin: 10px;

        @media screen and (max-width: $mobileWidth) {
            grid-column: span 1;
        }
    }

    .item {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
        height: calc(100% - 40px);
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .itemBig:hover {
        cursor: pointer;
    }

    img {
        width: 50%;
        border-radius: 12px;
    }

    h4 {
        margin: 0;
        font-size: 2em;
        color: white
    }

    p {
        margin: 0;
        color: white;
    }
</style>
