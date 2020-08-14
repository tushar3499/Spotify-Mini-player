/*
    Note for variable naming
    Global variables to be written with under_scores
    Local variables to be written in camelCase;
    Function names to be written in camelCase
*/

SPOTIFY_URL = "https://open.spotify.com/*";

selectors = {
    albumArt: ".cover-art img.cover-art-image",
    play_pause:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.control-button--circled",
    previous:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.spoticon-skip-back-16",
    next:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.spoticon-skip-forward-16",
}
var spotify_tabs = [];

function setSpotifyTabs(callback){
    chrome.tabs.query({url: SPOTIFY_URL},(tabs)=>{
        spotify_tabs = tabs;
        document.getElementById("Present").innerHTML = spotify_tabs.length;
        callback();
    });
}

function getClickCode(param){
    var code = `document.querySelector('${param}').click()`;
    return code;
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
            code: getClickCode(selectors.play_pause),
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
            code: `document.querySelector('${selectors.play_pause}').className`,
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

function playNext(){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getClickCode(selectors.next),
        },
        function(result){
           setTimeout(changeTrack,1000);
        }
    );
}

function playPrevious(){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getClickCode(selectors.previous),
        },
        function(result){
           setTimeout(changeTrack,1000);
        }
    );
}

function changeTrack(){
    getPlayPauseStatus(setPlayPause);
}

document.addEventListener("DOMContentLoaded", function(){
    setSpotifyTabs(function(){
        initialisePlayPause();
        document.getElementById("play-pause").addEventListener("click",playPause);
        document.getElementById("next").addEventListener("click",playNext);
        document.getElementById("previous").addEventListener("click",playPrevious);
    });
  });