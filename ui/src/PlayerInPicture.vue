<template>
    <div class="player" v-if="!disabled">
        <div class="header">
            <div class="marquee">
                <Marquee :text="name" />
            </div>
            <div class="buttons">
                <span @click="minimised = !minimised" class="material-symbols-rounded">{{minimised ? "zoom_out_map" : "zoom_in_map"}}</span>
                <span @click="disabled = !disabled" class="material-symbols-rounded">close</span>
            </div>
        </div>
        <div class="frame" :class="{ minimised }" v-html="el" />
    </div>
</template>

<script>
    import Marquee from '@/components/Marquee.vue'

    export default {
        components: {
            Marquee
        },
        name: 'PlayerInPicture',
        props: {
            expandCover: Boolean
        },
        setup() {},
        data() {

            window.addEventListener('player.play', e => {
                const song = e.detail;
                const url = song.source;
                this.name = `${song.artist} - ${song.title}`

                var myregexp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;
                const matches = url.match(myregexp)
                
                this.minimised = false;
                this.disabled = false;

                if (matches?.[1]) {
                    this.el =
                        `<iframe height="70" src="https://www.youtube.com/embed/${matches[1]}"frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                    return;
                }

                fetch(`https://soundcloud.com/oembed?url=${url}&format=json`).then(x => x.json()).then(
                jdata => {
                    this.el = jdata.html.replace("height=\"400\"", "height=\"70\"").replace(
                        "&show_artwork=true", "&show_artwork=true&auto_play=true").replace(
                        "<iframe",
                        '<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"'
                        );
                })
            }, false);

            return {
                el: null,
                minimised: true,
                disabled: true,
                name: ""
            }
        }
    }
</script>

<style lang="scss">
.player {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 200;
    width: 30%;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: var(--player-background);
    overflow: hidden;
    box-shadow: 0 0 50px 5px black;

    .header {
        padding: 0px 8px 8px 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        transform: translateY(8px);

        .marquee {
            font-size: .8em;
            color: var(--font-darker);
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: calc(100% - 48px - 8px);
        }

        .buttons {
            width: 48px;
            height: 24px;

            span:hover {
                cursor: pointer;
            }
        }
    }

    .frame {
        flex-grow: 1;
        min-height: 300px;

        &.minimised {
            display: none;
        }
    }

    iframe {
        min-height: 300px;
        width: 100%;
        height: 100%;
        transform: translateY(8px)
    }
}
</style>
