var resultsContainer = document.querySelector("#results");

window.onload = function() {
  document.querySelector(".gsc-search-button .gsc-search-button-v2").onclick = function() {
    resultsContainer.innerHTML = "Loading...";
    window.setTimeout(function(){
      updateResults();
    },3000)
  }
}

function updateResults() {
  resultsContainer.innerHTML = "";

  var results = document.querySelector(".gsc-expansionArea").children;

  
  var r = results[0];
  
  var text = "";
  var allGood = true;
  try {
    text = r.children[0].children[0].children[0].children[0].innerHTML.replace(/\|.+/,"").replace(/lyrics/ig, "").replace(/<b>/g,"").replace(/<\/b>/g,"");
  } catch (e) {
    console.log(e);
    resultsContainer.innerHTML = "We couldn't find your song :(";
    allGood = false;
  }

  if (allGood) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.spotify.com/v1/search?q=${encodeURIComponent(text)}&type=track`, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer BQBXZzuTrJ3njo9hGd_YXr0meq1aGYB0bBdpztfRAX3V-nvtwtW2Mw8HAc_LdYQmcza9wLt4gosSgZoYnKc2P6skyZ9P5trUbrLqxzKQORFhdNVLht1e8yNym2-hbk5aFMBqBuIyYuK8WxdvOfW4pSpstmwS8-DIkA');
    xhr.send();

    xhr.onload = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        try {
          resultsContainer.innerHTML = getTrackHTML(response.tracks.items[0].uri);
        } catch (e) {
          console.log(e);
          resultsContainer.innerHTML = `Your song seems to be <b>${text}</b>, but we couldn't find it on Spotify :(`;
        }
      }
    }
  }
}

function getTrackHTML(id) {
  return `
    <iframe 
      src="https://open.spotify.com/embed/track/${id.replace("spotify:track:","")}" 
      width="500" 
      height="600"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media">
    </iframe>`
}

document.getElementById("gsc-i-id1").onkeyup = function(e) {
  if (e.key === "Enter") {
    resultsContainer.innerHTML = "Loading...";
    window.setTimeout(function(){
      updateResults();
    },3000)
  }
}
