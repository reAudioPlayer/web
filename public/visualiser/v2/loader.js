window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    visualiser = new reVisualiserV2(document.getElementById("out"), window.players[0], code)
});
