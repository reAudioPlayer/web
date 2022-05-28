<template>
    <div ref="shelf" class="shelf">
        <div class="header">
            <h2>{{heading}}<span v-if="icon" class="icon material-icons-outlined">{{icon}}</span></h2>
            <div class="atEnd">
                <span class="icon material-icons-round" @click="min >= itemsPerRow ? min -= itemsPerRow : min = 0">arrow_back_ios_new</span>
                <span class="icon material-icons-round" @click="min < (length - itemsPerRow) ? min += itemsPerRow : min = (length - itemsPerRow)">arrow_forward_ios</span>
            </div>
        </div>
        <div class="items">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NavigableShelf',
        props: {
            heading: String,
            icon: String
        },
        data() {
            return {
                itemsPerRow: 4,
                min: 0,
                length: this.$slots.default()[0].children.length
            }
        },
        methods: {
            update() {
                this.$emit("updateMin", this.min)
            }
        },
        mounted() {
            const width = this.$refs.shelf.offsetWidth;
            console.log(width)
            this.itemsPerRow = width >= 1600 ? 4 : width >= 1200 ? 3 : width >= 800 ? 2 : 1;
        },
        watch: {
            min() {
                this.update();      
            }
        }
    }
</script>

<style scoped>

    .atEnd span:hover {
        cursor: pointer;
    }

    .atEnd span {
        margin-left: 20px;
    }

    span.icon {
        transform: translateY(3px);
        margin-left: 20px;
    }

    .header {
        margin: 10px 10px 0px 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .header>h2 {
        align-self: flex-start;
        margin-top: 0;
        margin-bottom: 10px;
    }

    .header>h5 {
        text-transform: uppercase;
        align-self: center;
        margin: 0;
    }

    .header>h5:hover {
        cursor: pointer;
    }

    .items {
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(201px,1fr));
        grid-auto-rows: 0;
        grid-template-rows: 1fr;
        overflow-y: hidden;
    }
</style>
