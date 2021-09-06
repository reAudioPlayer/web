window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    document.getElementById("receiveCode").innerText = code;
});

function load()
{
    visualiser = new reVisualiserV2(document.getElementById("out"), window.players[0], document.getElementById("receiveCode").innerText);
    document.getElementById("welcome").classList.add("hidden");
    console.log("done")
}
