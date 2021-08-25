window.addEventListener("load", function () {
    vizInit();
});


function loadColours()
{
    const ct = new ColorThief();
    const img = document.getElementById("reap.0-cover");
    window.colours = ct.getPalette(img, 4, 1);
    window.colours[3] = ct.getColor(img, 1)
    let root = document.documentElement
    root.style.setProperty('--accent-1', rgbToHex(window.colours[1]));
    root.style.setProperty('--accent-2', rgbToHex(window.colours[2]));
    root.style.setProperty('--paperColor', rgbToHex(window.colours[3]));
    window.colourOrbit = rgbToHex(window.colours[3]); // 0xff02ee
    window.colourLines = rgbToHex(window.colours[3]) // 0x6904ce

    window.mOrbit.setValues({
        color: window.colourOrbit,
        wireframe: true
    });

    window.mPlane.setValues({
        color: window.colourLines,
        side: THREE.DoubleSide,
        wireframe: true
    });
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}