window.addEventListener("load", () => {
    const elements = document.getElementsByTagName("reaudioplayer")

    window.players = [ ]

    for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = `<audio id="audioplayer${i}"></audio>
    <div class="upperUI">
        <span class="material-icons-outlined playPause" id="playPause${i}" onclick="playPause(false, ${i})">
            play_circle_filled
        </span>
        <input type="range" value="100" oninput="volumeChange(value, ${i})">
        <span class="material-icons-outlined" id="volume${i}" onclick="muteChange(${i})">
            volume_up
        </span>
    </div>
    <div class="lowerUI">
        <div class="ui-wrapper-left"></div>
        <div class="ui-wrapper-centre">
            <p class="note" id="lbl-position${i}">0:00</p>
            <input type="range" value="0" id="position${i}" oninput="jump(value, ${i})">
            <p class="note" id="lbl-togo${i}">-0:00</p>
        </div>
        <div class="ui-wrapper-right">
            <span class="material-icons-outlined download" onclick="downloadSong(${i})">
                file_download
            </span>
        </div>
    </div>`

        const player = document.getElementById(`audioplayer${i}`)
        player.ontimeupdate = x => {
            const progressBar = document.getElementById(`position${i}`)
            progressBar.value = x.target.currentTime / x.target.duration * 100
            document.getElementById(`lbl-position${i}`).innerText = format(x.target.currentTime)
            document.getElementById(`lbl-togo${i}`).innerText = format(x.target.duration)
        }

        player.onplay = () => playPause(true, i)
        player.onpause = () => playPause(true, i)

        window.players.push(player);
    }
})

function volumeChange(value, i) {
    const player = window.players[i]
    player.muted = false
    player.volume = value / 100;
    document.getElementById(`volume${i}`).innerHTML = getVolumeIcon(player)
}

function muteChange(i) {
    const player = window.players[i]
    player.muted = !player.muted
    document.getElementById(`volume${i}`).innerHTML = getVolumeIcon(player)
}

function getVolumeIcon(player) {
    if (player.muted || player.volume == 0) {
        return "volume_off"
    }
    if (player.volume < 0.5) {
        return "volume_down"
    }

    return "volume_up"
}

function playPause(updateOnly = false, i) {
    const player = window.players[i]
    if (!updateOnly) {
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }
    document.getElementById(`playPause${i}`).innerHTML = player.paused ? "play_circle_filled" : "pause_circle_filled"
}

function loadToAudioPlayer(src, name, i = 0) {
    const player = window.players[i]
    player.src = src
    player.name = name
    player.play()
}

function downloadSong(i) {
    const player = window.players[i]
    downloadWithName(player.src, player.name)
}

function jump(value, i) {
    const player = window.players[i]
    player.currentTime = player.duration / 100 * value
}

function format(time) {
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    var ret = "";
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}