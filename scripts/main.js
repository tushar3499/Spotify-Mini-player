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

function setSpotifyTabs(callback){
    chrome.tabs.query({url: SPOTIFY_URL},(tabs)=>{
        spotify_tabs = tabs;
        document.getElementById("Present").innerHTML = spotify_tabs.length;
        callback();
    });
}

function playPauseHelper(){
    getPlayPauseStatus(function(status){
        if(status=="Play") setPlayPause("Pause");
        else setPlayPause("Play");
    });
}

function playPause(){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: `document.querySelector('${selectors.play}').click()`,
        },
        function(result){
            playPauseHelper();
        }
    );
    
}
function getPlayPauseStatus(callback){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: `document.querySelector('${selectors.play}').className`,
        },
        (result)=>{
            var status="";
            if(result[0].includes("pause") ) status="Pause"
            else status = "Play";
            callback(status);
        }
    );
}

function setPlayPause(status){
    document.getElementById("play-pause").innerHTML = String(status);
}

function initialisePlayPause(){
    getPlayPauseStatus(setPlayPause);
}

document.addEventListener("DOMContentLoaded", function(){
    setSpotifyTabs(function(){
        initialisePlayPause();
        document.getElementById("play-pause").addEventListener("click",playPause);
    });
  });