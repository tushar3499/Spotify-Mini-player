/*
    Note for variable naming
    Global variables to be written with under_scores
    Local variables to be written in camelCase;
    Function names to be written in camelCase
*/

SPOTIFY_URL = "https://open.spotify.com/*";
var spotify_tabs = [];

function setSpotifyTabs(){
    chrome.tabs.query({url: SPOTIFY_URL},(tabs)=>{
        spotify_tabs = tabs;
        document.getElementById("Present").innerHTML = spotify_tabs.length;
    });
}

document.addEventListener("DOMContentLoaded", function(){
    setSpotifyTabs();
  });