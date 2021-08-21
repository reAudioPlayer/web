function subscribe() {
    window.socket.emit("web.fileSubscribe", document.getElementById("receiveCode").innerText)
}

let chunks = []

window.socket.on("web.fileReceived", msg => {
    console.log("received")
    if (msg.chunkIndex == 0) {
        chunks = [];
    }
    chunks.push(msg.chunk)
    if (msg.chunkIndex == msg.chunkCount - 1) {
        var blob = new Blob([...chunks], {
            type: msg.type
        });
        var src = window.URL.createObjectURL(blob);
        //downloadWithName(src, msg.name)
        /*var div = document.createElement("div")
        document.getElementById("receiveZone").appendChild(div)
        div.outerHTML = msg.previewElement*/
        window.msg = msg
        window.blob = blob;
        preview(blob, msg, src)
    }
})

var truncate = function (fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars);
};

function preview(blob, msg, src) {
    const previewMode = msg.type.split("/")[0];
    const wrapper = document.getElementById("receiver");
    let text = wrapper.innerHTML;
    text += `<div class="previewCard">`;

    const onclickevent = `downloadWithName('${src}', '${msg.name}')`

    if (previewMode == "image") {
        text += `<img class="filePreview" onclick="${onclickevent}" src="${src}">`
    } else if (previewMode == "audio") {
        text +=
            `<img class="filePreview" onclick="loadToAudioPlayer('${src}', '${msg.name}')" src="/src/music_placeholder.png">`
    } else {
        text += `<img class="filePreview" onclick="${onclickevent}" src="/src/file_placeholder.jpg">`
    }

    text += `<h4>${truncate(msg.name, 15)}</h4></div>`

    wrapper.innerHTML = text;
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