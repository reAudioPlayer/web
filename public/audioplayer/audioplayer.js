window.addEventListener("load", () => {
    const elements = document.getElementsByTagName("reaudioplayer")

    window.players = [ ]
    const clss = window.reApExperimentalTags ? "" : "hidden"
    console.log(window.reApExperimentalTags, clss)

    for (let i = 0; i < elements.length; i++) {
        const id = elements[i].id || i;
        elements[i].innerHTML = `<audio id="reap.${id}-audio"></audio><div class="ui">
    <div class="upperUI">
        <span class="material-icons-outlined playPause" id="reap.${id}-playPause" onclick="playPause(false, ${id})">
            play_circle_filled
        </span>
        <input type="range" value="100" oninput="volumeChange(value, ${id})">
        <span class="material-icons-outlined" id="reap.${id}-volume" onclick="muteChange(${id})">
            volume_up
        </span>
    </div>
    <div class="lowerUI">
        <div class="ui-wrapper-left"></div>
        <div class="ui-wrapper-centre">
            <p class="note" id="reap.${id}-lbl-position">0:00</p>
            <input type="range" value="0" id="reap.${id}-position" oninput="jump(value, ${id})">
            <p class="note" id="reap.${id}-lbl-togo">-0:00</p>
        </div>
        <div class="ui-wrapper-right">
            <span class="material-icons-outlined download" onclick="downloadSong(${id})">
                file_download
            </span>
        </div>
    </div>
    </div>
    <img class="cover ${clss}" id="reap.${id}-cover" src="/src/file_placeholder.jpg">
    <h4 class="title ${clss}" id="reap.${id}-title">Title</h4>
    <h5 class="artist ${clss}" id="reap.${id}-artist">Artist</h4>`

        const player = document.getElementById(`reap.${id}-audio`)
        player.ontimeupdate = x => {
            const progressBar = document.getElementById(`reap.${id}-position`)
            progressBar.value = x.target.currentTime / x.target.duration * 100
            document.getElementById(`reap.${id}-lbl-position`).innerText = format(x.target.currentTime)
            document.getElementById(`reap.${id}-lbl-togo`).innerText = format(x.target.duration)
        }

        player.onplay = () => playPause(true, i)
        player.onpause = () => playPause(true, i)

        window.players.push(player);
    }
})

function getReAudioPlayerById(id)
{
    return window.players.find(x => x.id == `reap.${id}-audio`);
}

function volumeChange(value, id) {
    const player = getReAudioPlayerById(id)
    player.muted = false
    player.volume = value / 100;
    document.getElementById(`reap.${id}-volume`).innerHTML = getVolumeIcon(player)
}

function muteChange(id) {
    const player = getReAudioPlayerById(id)
    player.muted = !player.muted
    document.getElementById(`reap.${id}-volume`).innerHTML = getVolumeIcon(player)
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

function playPause(updateOnly = false, id) {
    const player = getReAudioPlayerById(id)
    if (!updateOnly) {
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }
    document.getElementById(`reap.${id}-playPause`).innerHTML = player.paused ? "play_circle_filled" : "pause_circle_filled"
}

function loadToAudioPlayer(src, name, options = { }) {
    options.id = options.id || 0
    const player = getReAudioPlayerById(options.id)
    const cover = document.getElementById(`reap.${options.id}-cover`)
    cover.src = options.cover;
    document.getElementById(`reap.${options.id}-title`).innerText = options.title || ""
    document.getElementById(`reap.${options.id}-artist`).innerText = options.artist || ""
    player.src = src
    player.name = name
    player.play()
}

function downloadSong(id) {
    const player = getReAudioPlayerById(id)
    downloadWithName(player.src, player.name)
}

function downloadWithName(objectUrl, name) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = objectUrl;
    a.download = name;
    a.click();
    a.remove()
};

function jump(value, id) {
    const player = getReAudioPlayerById(id)
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