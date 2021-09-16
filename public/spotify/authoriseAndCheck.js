spotifyStart("spotify/", json => {
  console.log(json)
  window.jdata = json
  let library = ""
  for (let i = 0; i < json.length; i++) {
    const release = json[i]
    var line = "<div class='game compact'><img onclick='window.open(\"" + release["external_urls"].spotify + "\")' loading='lazy' src='" +
      release.images[0].url + "'>" +
      "<h4>" + release.name + "</h4>" +
      "<h5>" + release.artists.map(x => x.name).join(", ") + "</h5>" +
      "<pre>Released on " + release["release_date"] + "</pre><pre>Because you follow " + release.reason + "</pre><div class='centreflex'><span class='material-icons-outlined playPause' onclick=loadToAudioPlayer('/spotify/preview/album/" + release.id + "')>play_circle_filled</span></div></div>"
    library += line;
    jdata[i].keywords = `${release.artists.map(x => x.name).join(", ")} ${release.name} ${release.reason} ${release["release_date"]}`
  }
  document.getElementById("library").innerHTML = library;
})

function filterLib() {
  let search = document.getElementById("search").value;
  const library = document.getElementById("library");

  const invertedSearch = search.substr(0, 1) == "-";
  search = search.substr(0, 1) == "-" ? search.substr(1) : search;

  const onmatch = invertedSearch ? hide : show;
  const onnomatch = invertedSearch ? show : hide;

  if (search.length == 0) {
    for (let i = 0; i < library.children.length; i++) {
      show(library.children[i].classList)
    }
    return;
  }

  for (let i = 0; i < library.children.length; i++) {
    const game = library.children[i];

    const results = search.split(' ').filter(x => jdata[i].keywords.toLowerCase().includes(x.toLowerCase()));

    if (results && results.length == search.split(' ').length) {
      onmatch(game.classList);
    } else {
      onnomatch(game.classList);
    }
  }
}

function show(classlist) {
  if (classlist.contains("hidden")) {
    classlist.remove("hidden");
  }
}

function hide(classlist) {
  if (!classlist.contains("hidden")) {
    classlist.add("hidden");
  }
}