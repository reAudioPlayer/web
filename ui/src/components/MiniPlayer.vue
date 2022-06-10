<template>
    <div class="miniPlayer">
        <audio :src="src" ref="player" />
        <span v-if="display" @click="playPause" class="material-symbols-rounded circle">{{playing ? "pause" : "play_arrow"}}</span>
    </div>
</template>

<script>
export default {
    name: "MiniPlayer",
    props: {
        src: String,
        artist: String,
        title: String,
        display: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            playing: false
        }
    },
    methods: {
        get(endpoint) {
            fetch(`/api/${endpoint}`)
        },
        pause() {
            this.get("pause")
        },
        play() {
            this.get("play")
        },
        playPause() {
            const event = new CustomEvent('player.play', { detail: {
                    title: this.title,
                    artist: this.artist,
                    source: this.src
                } });
            window.dispatchEvent(event);

            return;

            if (!this.$refs.player.onended)
            {
                this.$refs.player.onended = () => {
                    this.playing = false
                }
            }

            window.player = this.$refs.player
            this.playing = this.$refs.player.paused
            if (this.$refs.player.paused)
            {
                this.pause()
                this.$refs.player.play()
            }
            else
            {
                this.$refs.player.pause()
            }
        }
    }
}
</script>

<style scoped>
    .circle {
        font-size: 2em;
        font-variation-settings: 'FILL' 1;
    }

    .circle:hover {
        cursor: pointer;
    }

    .miniPlayer {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
