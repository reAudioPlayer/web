<template>
    <div>
        <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
            <div class="wrapper">
                <div class="header">
                    <h3>Edit details</h3>
                    <button class="modal-close" @click="showModal = false">
                        <span class="material-symbols-rounded">
                            close
                        </span>
                    </button>
                </div>
                <h4>Name</h4>
                <div class="content">
                    <input v-model="name" type="text" ref="name">
                </div>
                <h4>Description</h4>
                <div class="content">
                    <input v-model="description" type="text" ref="description">
                </div>
                <div class="confirm">
                    <button @click="remove" class="negative left">Delete</button>
                    <button @click="apply" class="negative">Save</button>
                </div>
            </div>
        </vue-final-modal>
    </div>
</template>
<script>
    import Hashids from 'hashids'
    const hashids = new Hashids("reapOne.playlist", 22)

    export default {
        name: "EditPlaylist",
        props: {
            playlistName: String,
            playlistDescription: String,
            userData: Object
        },
        data() {
            return {
                showModal: false,
                cover: "",
                name: this.playlistName,
                description: this.playlistDescription
            }
        },
        methods: {
            apply() {                
                this.showModal = false
                console.log("fetch")

                this.userData.data.playlists[Number(hashids.decode(this.$route.params.id))].name = this.name
                this.userData.data.playlists[Number(hashids.decode(this.$route.params.id))].description = this.description

                fetch("/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.userData.data)
                }).then(x => {
                    console.log(x)
                    this.$emit("close")
                })
            },
            remove() {
                this.userData.data.playlists.splice(Number(hashids.decode(this.$route.params.id)), 1);
                fetch("/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.userData.data)
                }).then(x => {
                    console.log(x)
                    this.$emit("close")
                })
            }
        },
        watch: {
            playlistName() {
                this.name = this.playlistName
            },
            playlistDescription() {
                this.description = this.playlistDescription
            }
        }
    }
</script>

<style scoped>

    .wrapper {
        display: flex;
        flex-direction: column;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .content {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    input[type="text"] {
        background: var(--hover-2);
        border: 1px solid var(--hover-3);
        border-radius: 5px;
        color: var(--font-colour);
        padding: 10px;
        width: 100%;
        font-family: var(--font-family);
    }

    input[type="text"]:focus {
        outline: none;
    }

    input[type="text"]:hover {
        background: var(--hover-1);
        border: 1px solid var(--font-colour);
    }

    button.negative {
        color: var(--font-contrast);
        background-color: var(--font-colour);
        border: none;
        border-radius: 20px;
        padding: 10px 25px 10px 25px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
        font-family: var(--font-family);
        margin-left: auto;
    }

    .confirm {
        margin-top: 20px;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    button.negative:hover {
        cursor: pointer;
        padding: 11px 26px 11px 26px;
        border-radius: 21px;
    }

    .negative.left {
        margin-left: 0;
    }
</style>