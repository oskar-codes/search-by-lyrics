var resultsContainer = document.querySelector("#results");
var accessToken = "";
var spotify = true;

window.onload = function() {
  var inputField = document.getElementById("gsc-i-id1");
  inputField.setAttribute("placeholder", "Enter some lyrics");

  if (/#access_token\=.+/.test(location.href)) {
    document.getElementById("connect-container").style.display = "none";
    accessToken = location.href.toString().match(/(?:\#access_token\=).+?(?=\&)/)[0].replace("#access_token=", "");
  }
  document.querySelector(".gsc-search-button .gsc-search-button-v2").onclick = function() {
    if (inputField.value !== "" && !!inputField.value.trim()) {
      resultsContainer.innerHTML = "Loading...";
      window.setTimeout(function(){
        updateResults();
      },3000)
    }
  }
  
  inputField.onkeyup = function(e) {
    if (e.key === "Enter" && inputField.value !== "" && !!inputField.value.trim()) {
      resultsContainer.innerHTML = "Loading...";
      window.setTimeout(function(){
        updateResults();
      },3000)
    }
  }
}

function connectSpotify() {
  window.open("https://accounts.spotify.com/authorize?client_id=48419cdfb01a4a71a3069d533ea0426d&redirect_uri=https%3A%2F%2Foskar-codes.github.io%2Fsearch-by-lyrics&scope=user-read-private%20user-read-email&response_type=token&show_dialog=true","_blank");
}

function continueWithoutSpotify() {
  document.getElementById("connect-container").style.display = "none";
  spotify = false;
}

function updateResults() {
  if (accessToken !== "" || !spotify) {
    resultsContainer.innerHTML = "";
    var r = document.querySelector(".gsc-expansionArea").children[0];

    var text = "";
    var link = "";
    var allGood = true;
    try {
      text = r.children[0].children[0].children[0].children[0].innerHTML.replace(/genius/ig, "").replace(/\(?lyrics\)?/ig, "").replace(/\.{3}/g, "").replace(/\|/g, "").replace(/<\/?b>/g,"").trim();
      link = r.children[0].children[0].children[0].children[0].href;
    } catch (e) {
      console.log(e);
      resultsContainer.innerHTML = "We couldn't find your song :(";
      allGood = false;
    }
    
    if (text.includes("Songs, and Albums")) {
      allGood = false;
      resultsContainer.innerHTML = "Your query seems to be a musician. Please search for lyrics only.";
    }

    if (allGood && spotify) {
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
            resultsContainer.innerHTML = `Your song seems to be <a target="_blank" href="${link}"><u><b>${text}</b></u></a>, but we couldn't find it on Spotify :(`;
          }
        } else {
          alert("Your Spotify session has timed out. Please log in again.");
          var a = document.createElement("a");
          a.href = "https://oskar-codes.github.io/search-by-lyrics/";
          a.style.visibility = "hidden";
          document.body.appendChild(a);
          a.click();
        }
      }
    } else if (!spotify && allGood) {
      resultsContainer.innerHTML = `<a target="_blank" href="${link}"><u><b>${text}</b></u></a>`;
    }
  }
}

function getTrackHTML(id) {
  return `
    <iframe 
      src="https://open.spotify.com/embed/track/${id.replace('spotify:track:','')}" 
      width="500" 
      height="600"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media">
    </iframe>`
}
