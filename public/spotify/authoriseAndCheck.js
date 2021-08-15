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
      "<pre>Released on " + release["release_date"] + "</pre><pre>Because you follow " + release.reason + "</pre><audio controls src='/spotify/preview/album/" + release.id + "'></audio></div>"
    library += line;
    jdata[i].keywords = `${release.artists.map(x => x.name).join(", ")} ${release.name} ${release.reason} ${release["release_date"]}`
  }
  document.getElementById("library").innerHTML = library;
})