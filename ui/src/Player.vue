<template>
  <div class="player">
    <div class="centre" :style="{ width: '100%' }" v-html="sc"></div>

    <div v-if="false" class="left">
      <img v-if="expandCover" @click="onExpandCover" :src="cover" />
      <div class="titleartist">
        <span class="title">
            <router-link class="linkOnHover" to="/player">
            <Marquee :text="title" /></router-link>
        </span>
        <span class="artist">
          <router-link class="linkOnHover" :to="`/search/${artist}`">
            <Marquee :text="artist" /></router-link>
        </span>
      </div>
      <span
        @click="favourited = !favourited"
        class="favourite material-symbols-rounded">
        {{ favourited ? "favorite" : "favorite_border" }}</span>
    </div>
    <div v-if="false" class="centre">
      <div class="upper">
        <span @click="shuffle = !shuffle" class="material-symbols-rounded defaultbtn">{{ shuffle ? "shuffle_on" : "shuffle" }}</span>
        <span @click="get('last')" class="material-symbols-rounded defaultbtn">skip_previous</span>
        <span @click="get('playPause')" class="material-symbols-rounded circle">{{playing ? "pause_circle" : "play_circle"}}</span>
        <span @click="get('next')" class="material-symbols-rounded defaultbtn">skip_next</span>
        <span @click="songLoop = !songLoop" class="material-symbols-rounded defaultbtn">{{ songLoop ? "repeat_one" : "repeat" }}</span>
      </div>
      <div class="lower">
        <span class="positionLabel">{{ progresslbl }}</span>
        <input
          @change="progresschange"
          v-model="progress"
          max="1000"
          type="range"
          class="progress"
        />
        <span class="positionLabel">{{ durationStr }}</span>
      </div>
    </div>
    <div v-if="false" class="right">
      <span class="material-symbols-rounded defaultbtn">volume_up</span>
      <input @change="volumechange" ref="volume" type="range" class="volume" />
    </div>
  </div>
</template>

<script>
  import Marquee from '@/components/Marquee.vue'

  export default {
    components: { Marquee },
    name: 'Player',
    props: {
      expandCover: Boolean
    },
    setup() {
    },
    data() {

      window.addEventListener('player.play', e => {
        const url = e.detail;

        var myregexp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;
        const matches = url.match(myregexp)
        console.log(url, myregexp)
        console.log(matches)
        if (matches?.[1])
        {
          this.sc = `<iframe height="70" src="https://www.youtube.com/embed/${matches[1]}"frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
          return;
        }

        fetch(`https://soundcloud.com/oembed?url=${url}&format=json`).then(x => x.json()).then(jdata => {
          this.sc = jdata.html.replace("height=\"400\"", "height=\"70\"").replace("&show_artwork=true", "&show_artwork=true&auto_play=true").replace("<iframe", '<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"');
        })
      }, false);

      return {
          sc: null
      }
    },
    watch: {
        favourited() {
            this.setFavourite();
        },
        songLoop() {
          fetch("/api/songLoop", {
            method: "POST",
            body: JSON.stringify({
              value: this.songLoop
            })
          })
        },
        shuffle() {
          fetch("/api/shuffle", {
            method: "POST",
            body: JSON.stringify({
              value: this.shuffle
            })
          })
        }
    },
    methods: {
        setFavourite() {
            this.track.favourite = this.favourited
            fetch("/api/updateSong", {
                method: "POST",
                body: JSON.stringify(this.track)
            });
        },
        onExpandCover() {
            this.$emit('expandCover', true)
        },
        playPause() {
            console.log("playpause")
            this.get('playPause')
        },
        get(endpoint) {
            fetch(`/api/${endpoint}`)
        },
        volumechange() {
            fetch("/api/setVolume", {
                method: "POST",
                body: JSON.stringify({
                    value: this.$refs.volume.value
                })
            })
        },
        zeroPad(num, places) {
            return String(num).padStart(places, '0')
        },
        progresschange() {
            let duration = Number(this.durationStr.split(':')[0]) * 60 + Number(this.durationStr.split(':')[1])
            let value = this.progress * duration / 1000
            this.progresslbl = `${Math.floor(value / 60)}:${this.zeroPad(Math.round(value % 60), 2)}`
            fetch("/api/setPos", {
                method: "POST",
                body: JSON.stringify({
                    value
                })
            })
        },
        updateData(jdata) {
            if (jdata.path == "player.song")
            {
                this.track = jdata?.data
                this.title = jdata?.data?.title || "N/A"
                this.artist = jdata?.data?.artist || "N/A"
                this.durationStr = jdata?.data?.duration || "N/A"
                this.cover = jdata?.data?.cover || "/assets/img/music_placeholder.png"
                this.progresslbl = "0:00"
                this.favourited = jdata?.data?.favourite || false

                return;
            }
            if (jdata.path == "player.playState")
            {
                this.playing = jdata?.data || false
                return
            }
            if (jdata.path == "player.posSync")
            {
                let value = jdata?.data || 0
                this.progresslbl = `${Math.floor(value / 60)}:${this.zeroPad(Math.round(value % 60), 2)}`
            }
        }
    }
  }
</script>

<style scoped>
div.player {
  background: var(--player-background);
  height: calc(var(--player-height) - 21px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid var(--border);
  z-index: 1;
}

.favourite {
  line-height: calc(var(--player-height) - 40px);
  margin-left: 20px;
  font-size: 1.2em;
  color: var(--font-darker);
}

.favourite:hover {
  cursor: pointer;
}

.left {
  max-height: calc(var(--player-height) - 40px);
  display: flex;
  flex-direction: row;
  padding: 10px;
  width: 25vw;
}

.left > img {
  height: calc(var(--player-height) - 40px);
  border-radius: 5px;
  margin-right: 10px;
}

.left > .titleartist {
  display: flex;
  flex-direction: column;
  justify-content: center;

  max-width: 20vw;
}

.left > .titleartist > .title {
  font-size: 0.9em;
  /*overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;*/
}

.left > .titleartist > .artist {
  font-size: 0.7em;
  color: var(--font-darker);
  /*overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;*/
}

.centre {
  max-height: calc(var(--player-height) - 20px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.centre > .upper {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.centre > .lower {
  line-height: 25px;
  height: 25px;
  align-items: center;
  display: flex;
  flex-direction: row;
}

.positionLabel {
  font-size: 0.7em;
  color: var(--font-darker);
}

input[type="range"].progress {
  width: 40vw;
}

input[type="range"]:hover {
  cursor: pointer;
}

.defaultbtn {
  font-size: 1.4em;
  color: var(--font-darker);
  margin-left: 10px;
  margin-right: 10px;
}

.defaultbtn:hover {
  color: var(--font-colour);
  cursor: pointer;
}

.circle {
  font-size: 2.4em;
  width: 40px;
}

.defaultbtn,
.circle {
  line-height: 24px;
  text-align: center;
}

.circle:hover {
  font-size: 2.5em;
  cursor: pointer;
}

.right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 25vw;
}
</style>