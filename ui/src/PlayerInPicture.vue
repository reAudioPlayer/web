<template>
    <div ref="player" id="player" class="player" v-if="!disabled">
        <div class="header" :class="{ minimised }">
            <div class="title">
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
        mounted() {
            const scScript = document.createElement('script')
            scScript.setAttribute('src', 'https://w.soundcloud.com/player/api.js')
            document.head.appendChild(scScript)

            const ytScript = document.createElement('script')
            ytScript.setAttribute('src', 'https://www.youtube.com/iframe_api')
            document.head.appendChild(ytScript)
        },
        watch: {
            disabled() {
                if (this.disabled)
                {
                    return;
                }

                this.$nextTick(() => {
                    this.$refs.player.addEventListener("mousedown", this.mouseDown, false);
                    this.$refs.player.addEventListener("touchstart", this.mouseDown, false);
                    window.addEventListener("mouseup", this.mouseUp, false)
                    window.addEventListener("touchend", this.mouseUp, false)
                    window.addEventListener("touchcancel", this.mouseUp, false)
                });
            }
        },
        methods: {
            onSongEnd() {
                const event = new CustomEvent('player.ended', { detail: { id: this.id } })
                window.dispatchEvent(event);
            },
            mouseDown(evt) {
                const divid = this.$refs.player;
                const container = document.getElementById("appRoot");

                evt = evt || window.event;

                var posX = evt.touches ?  evt.touches[0].clientX : evt.clientX,
                    posY = evt.touches ?  evt.touches[0].clientY :  evt.clientY,
                    divTop = divid.offsetTop,
                    divLeft = divid.offsetLeft,
                    eWi = parseInt(divid.offsetWidth),
                    eHe = parseInt(divid.offsetHeight),
                    cWi = parseInt(container.offsetWidth) - 8,
                    cHe = parseInt(container.offsetHeight) - 8;
                
                container.style.cursor='move';
                var diffX = posX - divLeft,
                    diffY = posY - divTop;
                const event = (evt) => {
                    evt = evt || window.event;
                    if (!evt.touches) {
                        evt.preventDefault();
                    }
                    evt.stopPropagation();
                    var posX = evt.touches ?  evt.touches[0].clientX : evt.clientX,
                        posY = evt.touches ?  evt.touches[0].clientY :  evt.clientY,
                        aX = posX - diffX,
                        aY = posY - diffY;
                    if (aX < 8) aX = 8;
                    if (aY < 8) aY = 8;
                    if (aX + eWi > cWi) aX = cWi - eWi;
                    if (aY + eHe > cHe) aY = cHe - eHe;
                    this.divMove(divid,aX,aY);
                }
                document.onmousemove = event;
                document.ontouchmove = event;
            },
            mouseUp() {
                document.getElementById("appRoot").style.cursor='default';
                document.onmousemove = function(){}
                document.ontouchmove = function(){}
            },
            divMove(divid, xpos, ypos) {
                divid.style.bottom = "auto";
                divid.style.right = "auto";
                
                divid.style.left = xpos + 'px';
                divid.style.top = ypos + 'px';
            }
        },
        setup() {},
        data() {
            window.addEventListener('player.play', e => {
                const song = e.detail;
                const url = song.source;
                this.id = song.id
                this.name = `${song.artist} - ${song.title}`

                if (url.includes("youtu"))
                {
                    var myregexp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;
                    const matches = url.match(myregexp)

                    if (matches?.[1]) {
                        this.el =
                            `<iframe id="yt-player" height="70" src="https://www.youtube.com/embed/${matches[1]}?autoplay=1&enablejsapi=1&version=3" sandbox="allow-same-origin allow-scripts" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`


                        window.setTimeout(() => {
                            this.ytPlayer = new YT.Player('yt-player');
                            this.ytPlayer.addEventListener("onStateChange", evt => evt.data == 0 ? this.onSongEnd() : null);
                        }, 1000);

                        //this.ytPlayer.loadVideoById(matches[1]);


                        this.minimised = false;
                        this.disabled = false;
                        return;
                    }
                }
                
                if (url.includes("audius"))
                {
                    var myregexp = /audius.co\/([A-Za-z0-9]+)\/([A-Za-z0-9\-]+)/;
                    const matches = url.match(myregexp)
                    console.log(matches, url)

                    if (matches?.[1] && matches?.[2]) {
                        fetch(`https://blockdaemon-audius-discovery-01.bdnodes.net/v1/full/tracks?handle=${matches[1]}&slug=${matches[2]}`).then(x => x.json()).then(jdata => {
                            const id = jdata.data.id;
                            this.el = `<iframe src=https://audius.co/embed/track/${id}?flavor=card width="100%" height="100%" allow="encrypted-media" style="border: none;"></iframe>`
                        })
                        this.minimised = false;
                        this.disabled = false;
                        return;
                    }
                }
                
                if (url.includes("spotify"))
                {
                    var myregexp = /spotify(?:.*\/album\/)([A-Za-z0-9_\-]{22})/;
                    const matches = url.match(myregexp)
                    
                    if (matches?.[1]) {
                        this.el = `<iframe src="https://open.spotify.com/embed/album/${matches[1]}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`
                        
                        this.minimised = false;
                        this.disabled = false;
                        return;
                    }
                }

                if (url.includes("soundcloud"))
                {
                    fetch(`https://soundcloud.com/oembed?url=${url}&format=json`).then(x => x.json()).then(
                    jdata => {
                        this.el = jdata.html.replace("height=\"400\"", "height=\"70\"").replace(
                            "&show_artwork=true", "&show_artwork=true&auto_play=true").replace(
                            "<iframe",
                            '<iframe id="scPlayer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"'
                            );
                    })

                    window.setTimeout(() => {
                        const iframeElement = document.getElementById('scPlayer');
                        const widget = SC.Widget(iframeElement);
                        widget.bind(SC.Widget.Events.FINISH, this.onSongEnd)
                    }, 1000);

                    this.minimised = false;
                    this.disabled = false;
                    return;
                }
            }, false);

            return {
                el: null,
                minimised: true,
                disabled: true,
                name: "",
                id: null,
                ytPlayer: null
            }
        }
    }
</script>

<style lang="scss">
$mobileWidth: 950px;

.player {
    position: absolute;
    
    top: calc(100% - 300px - 48px);
    left: calc(100% - 30% - 8px);

    z-index: 200;
    width: 30%;

    @media screen and (max-width: $mobileWidth) {
        width: calc(100% - 16px);
        /*top: calc(100% - 300px - 48px) */;
        left: 8px !important;
    }

    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: var(--player-background);
    overflow: hidden;
    box-shadow: 0 0 100px 3px rgba(0, 0, 0, .8);

    .header {
        padding: 0px 8px 8px 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        transform: translateY(8px);

        .title {
            font-size: .8em;
            color: var(--font-darker);
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: calc(100% - 48px - 8px);
            width: 100%;
        }

        .buttons {
            width: 48px;
            height: 24px;

            span:hover {
                cursor: pointer;
            }
        }

        &.minimised {
            margin-bottom: 8px;
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
