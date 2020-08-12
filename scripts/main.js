/*
    Note for variable naming
    Global variables to be written with under_scores
    Local variables to be written in camelCase;
    Function names to be written in camelCase
*/

SPOTIFY_URL = "https://open.spotify.com/*";

selectors = {
    albumArt: ".cover-art img.cover-art-image",
    play:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.control-button--circled",
}
var spotify_tabs = [];

function playPause(){
    
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: `document.querySelector('${selectors.play}').className`,
        },
        (result)=>{
            /*if(result.length==0) document.getElementById("Present").innerHTML = "Playing";
            else document.getElementById("Present").innerHTML = "Paused";*/
            if(result[0].includes("pause") ) document.getElementById("Present").innerHTML = "Playing";
            else document.getElementById("Present").innerHTML = "Paused";
            //document.getElementById("Present").innerHTML = result[0];
        }
    );
}
function setSpotifyTabs(callback){
    chrome.tabs.query({url: SPOTIFY_URL},(tabs)=>{
        spotify_tabs = tabs;
        document.getElementById("Present").innerHTML = spotify_tabs.length;
        callback();
    });
}

document.addEventListener("DOMContentLoaded", function(){
    setSpotifyTabs(function(){
        document.getElementById("Check").addEventListener("click",playPause);
    });
  });