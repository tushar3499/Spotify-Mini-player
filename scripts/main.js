/*
    Note for variable naming
    Global variables to be written with under_scores
    Local variables to be written in camelCase;
    Function names to be written in camelCase
*/

SPOTIFY_URL = "https://open.spotify.com/*";

selectors = {
    play_pause:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.control-button--circled",
    previous:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.spoticon-skip-back-16",
    next:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.spoticon-skip-forward-16",
    shuffle:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.spoticon-shuffle-16",
    like:
    "#main .Root__now-playing-bar .now-playing-bar__left .now-playing .control-button-wrapper button.control-button",
    track:
    '#main .Root__now-playing-bar .now-playing-bar__left .now-playing span a[href^="/album/"]',
    artist:
    '#main .Root__now-playing-bar .now-playing-bar__left .now-playing span a[href^="/artist/"]',
    cover: ".cover-art img.cover-art-image",
}
var spotify_tabs = [];

function setSpotifyTabs(callback){
    chrome.tabs.query({url: SPOTIFY_URL},(tabs)=>{
        spotify_tabs = tabs;
        //document.getElementById("Present").innerHTML = spotify_tabs.length;
        callback();
    });
}

function getClickCode(param){
    var code = `document.querySelector('${param}').click()`;
    return code;
}

function getTitleCode(param){
    var code = `document.querySelector('${param}').title`;
    return code;
}

function getClassCode(param){
    var code = `document.querySelector('${param}').className`;
    return code;
}

function getHTMLCode(param){
    var code = `document.querySelector('${param}').innerHTML`;
    return code;
}


//------Play Pause functions------------------------------------------

function initialisePlayPause(){
    getPlayPauseStatus(setPlayPause);
}

function getPlayPauseStatus(callback){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getClassCode(selectors.play_pause),
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

function playPauseHelper(){
    getPlayPauseStatus(function(status){
        if(status=="Play") setPlayPause("Pause");
        else setPlayPause("Play");
    });
}

//--------------------------------------------------------------------------

//---Previous and next functions--------------------------------------------

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

//--------------------------------------------------------------------------

//---Shuffle Functions-------------------------------------------------------

function InitialiseShuffleText(){
    shuffleTextStatus(setShuffleText);
}

function shuffleTextStatus(callback){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getClassCode(selectors.shuffle),
        },
        (result)=>{
            var status="";
            if(result[0].includes("active") ) status="Disable Shuffle";
            else status = "Enable Shuffle";
            callback(status);
        }
    );
}

function setShuffleText(status){
    document.getElementById("shuffle").innerHTML = String(status);
}

function shuffleHandle(){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getClickCode(selectors.shuffle),
        },
        function(result){
            shuffleHelper();
        }
    );
}

function shuffleHelper(){
    shuffleTextStatus(function(status){
        if(status=="Enable Shuffle") setShuffleText("Disable Shuffle");
        else setShuffleText("Enable Shuffle");
    });
}

//------------------------------------------------------------------------------

//---Like Functions-------------------------------------------------------------

function InitialiseLike(){
    getLikeStatus(setLikeStatus);
}

function getLikeStatus(callback){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getTitleCode(selectors.like),
        },
        (result)=>{
            var status = "";
            if(result[0].includes("Save")) status="Save";
            else status = "Remove";
            callback(status);
        }
    );
}

function setLikeStatus(status){
    document.getElementById("like").innerHTML = String(status);
}

function likeHandle(){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getClickCode(selectors.like),
        },
        function(result){
            likeHelper();
        }
    );
}

function likeHelper(){
    getLikeStatus(function(status){
        if(status.includes("Save")) setLikeStatus("Remove");
        else setLikeStatus("Save");
    });
}

//---------------------------------------------------------------------------------

function changeTrackName(callback){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getHTMLCode(selectors.track),
        },
        (result)=>{
            callback(result[0]);
        }
    );
}

function changeArtistName(callback){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: getHTMLCode(selectors.artist),
        },
        (result)=>{
            callback(result[0]);
        }
    );
}

function setTrackName(track){
    document.getElementById("track-name").innerHTML = String(track);
}

function setArtistName(artist){
    document.getElementById("artist-name").innerHTML = String(artist);
}

function DisplayTrackDetails(){
    changeTrackName(setTrackName);
    changeArtistName(setArtistName);
    changeTrackCover(setTrackCover);
}

function InitialiseExtension(){
    initialisePlayPause();
    InitialiseShuffleText();
    InitialiseLike();
    DisplayTrackDetails();
}

function changeTrack(){
    DisplayTrackDetails();
    getPlayPauseStatus(setPlayPause);
}

function changeTrackCover(callback){
    chrome.tabs.executeScript(
        spotify_tabs[0].id,
        {
            code: `document.querySelector('${selectors.cover}').src`,
        },
        (result)=>{
            //console.log(result);
            callback(result[0]);
        }
    );
}

function setTrackCover(cover){
    document.getElementById("track-cover").src = String(cover);
}

document.addEventListener("DOMContentLoaded", function(){
    setSpotifyTabs(function(){
        InitialiseExtension();
        document.getElementById("play-pause").addEventListener("click",playPause);
        document.getElementById("next").addEventListener("click",playNext);
        document.getElementById("previous").addEventListener("click",playPrevious);
        document.getElementById("shuffle").addEventListener("click",shuffleHandle);
        document.getElementById("like").addEventListener("click",likeHandle);
    });
  });