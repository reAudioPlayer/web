var socket = io();
window.connected = false;

window.onload = function() {
    socket.emit('verify root', prompt("root password?"));
    window.logger = document.getElementById("log");
    window.libKey = document.getElementById("key");
    window.libValue = document.getElementById("lib");

    window.libKey.onchange = loadLibrary();

    window.libKey.addEventListener('change', loadLibrary);
}

function loadLibrary()
{
    socket.emit('get game library of', window.libKey.value);
}

socket.on('game library of', function (lib)
{
    window.libValue.value = JSON.stringify(lib, null, 4);
});

socket.on('msc/authorised', function (username)
{
    log("U-Auth", username);
});

socket.on('msg/disconnect', function (username)
{
    log("U-Disc", username);
});

socket.on('accepted', function (data) {
    window.connected = true;
    log("root", "Authorised, commencing logging..");
});

socket.on('msg/get game library of', function (data) {
    log("g-GLib", data.username + " requests " + data.key)
});

socket.on('msg/synchronise game database', function (data) {
    log("s-Gdb", data)
});

socket.on('game invite', function (data) {
    log("g-invite", JSON.stringify(data))
});

function log(loggerName, msg)
{
    window.logger.value = "[" + loggerName.toUpperCase() + "]: " + msg + "\n" + window.logger.value;
}