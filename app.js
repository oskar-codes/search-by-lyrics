var resultsContainer = document.querySelector("#results");
var accessToken = "";

document.getElementById("spotify-connect").onclick = function() {
  window.location.assign(`https://accounts.spotify.com/authorize?client_id=48419cdfb01a4a71a3069d533ea0426d&redirect_uri=${encodeURIComponent("https://oskar-codes.github.io/search-by-lyrics")}&scope=user-read-private%20user-read-email&response_type=token`);
}

window.onload = function() {
  
  if (/#access_token=.+/.test(window.location.href)) {
    document.getElementById("connect-container").style.display = "none";
    accessToken = window.location.href.match(/(?<=access_token\=).+?(?=&)/)[0];
  }
  
  document.querySelector(".gsc-search-button .gsc-search-button-v2").onclick = function() {
    resultsContainer.innerHTML = "Loading...";
    window.setTimeout(function(){
      updateResults();
    },3000)
  }
  
  document.getElementById("gsc-i-id1").onkeyup = function(e) {
    if (e.key === "Enter") {
      resultsContainer.innerHTML = "Loading...";
      window.setTimeout(function(){
        updateResults();
      },3000)
    }
  }
}

function updateResults() {
  if (accessToken !== "") {
    resultsContainer.innerHTML = "";

    var results = document.querySelector(".gsc-expansionArea").children;


    var r = results[0];

    var text = "";
    var allGood = true;
    try {
      text = r.children[0].children[0].children[0].children[0].innerHTML.replace(/\|.+/,"").replace(/lyrics/ig, "").replace(/<b>/g,"").replace(/<\/b>/g,"").trim();
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
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
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
