function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function share(file, code = document.getElementById("code").innerText) {
    console.log("[share/share.js] sending...")
    var chunks = []
    var chunkSize = 800 * 1000 // chunkSize in bytes, chunkSize is 0.8MB
    let i = chunkSize

    for (; i < file.size; i += chunkSize) {
        chunks.push(file.slice(i - chunkSize, i))
    }

    chunks.push(file.slice(i - chunkSize))

    for (let j = 0; j < chunks.length; j++) {
        msg = {
            chunk: chunks[j],
            name: file.name,
            type: file.type,
            code,
            chunkIndex: j,
            chunkCount: chunks.length,
            previewElement: file.previewElement?.cloneNode(true)?.outerHTML
        }

        window.socket.emit('web.fileShare', msg);
    }

    console.log(`[share/share.js] sent in ${chunks.length} chunks`);
}

function dropzoneInit() {
    Dropzone.options.sendZone = {
        autoProcessQueue: false,
        maxFilesize: 1024 * 10,
        accept: function (file, done) {
            window.file = file
            share(file);
            acceptFile(file);
        }
    }
}

function acceptFile(file) {
    file.previewElement.classList.add("dz-success");
    for (let i = 0; i < file.previewElement.children.length; i++) {
        if (file.previewElement.children[i].className == "dz-progress") {
            file.previewElement.children[i].remove();
            break;
        }
    }
}

function toClipboard(content) {
    navigator.clipboard.writeText(content).then(function () {
        console.log(content + ': Copying to clipboard was successful!');
    }, function (err) {
        console.error(content + ': Could not copy text: ', err);
    });
}