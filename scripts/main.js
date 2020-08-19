/*
    Note for variable naming
    Global variables to be written with under_scores
    Local variables to be written in camelCase;
    Function names to be written in camelCase
*/

var new_tab;
SPOTIFY_URL = "https://open.spotify.com/*";

chrome.storage.sync.get('user_id',function(data){
    document.getElementById("Present").innerHTML = data['user_id'];
    // chrome.storage.sync.set({ ['access_tok'] : "Hi4" });
});

selectors = {
    albumArt: ".cover-art img.cover-art-image",
    play:
    "#main .Root__now-playing-bar .now-playing-bar__center .player-controls__buttons button.control-button--circled",
}
var spotify_tabs = [];

// chrome.storage.sync.get('access_tok',function(data){
//     if(data['access_tok']==undefined){
//         chrome.storage.sync.set({ ['access_tok'] : "Hi0" });
//         chrome.tabs.create({'url': get_url}, function(tab) {
//             new_tab = tab.id;
//             console.log(tab.url);
//             chrome.storage.sync.set({ ['access_tok'] : "Hi" });
//             if(tab.url.match(/spotify/g)){
//                 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//                     if (changeInfo.url && tabId == new_tab && !tab.url.match(/spotify/g)){
//                         var token_url = changeInfo.url;
//                         chrome.storage.sync.set({ ['access_tok'] : "Hi1" }); 
//                     }
//                     chrome.storage.sync.set({ ['access_tok'] : "Hi2" }); 
//                 });
//             }
//             else{
//                 chrome.storage.sync.set({ ['access_tok'] : "Hi3" });
//             }
//         });
//         // document.getElementById("Present").innerHTML = "Hi";
//         // chrome.storage.sync.set({ ['access_tok'] : "Hi3" });
//     }
//     else{
//         document.getElementById("Present").innerHTML = data['access_tok'];
//     }
// });

function playPause(){

    

    // chrome.storage.sync.get()

    // chrome.tabs.executeScript(
    //     spotify_tabs[0].id,
    //     {
    //         code: `document.querySelector('${selectors.play}').className`,
    //     },
    //     (result)=>{
    //         /*if(result.length==0) document.getElementById("Present").innerHTML = "Playing";
    //         else document.getElementById("Present").innerHTML = "Paused";*/
    //         if(result[0].includes("pause") ) document.getElementById("Present").innerHTML = "Playing";
    //         else document.getElementById("Present").innerHTML = "Paused";
    //         //document.getElementById("Present").innerHTML = result[0];
    //     }
    // );
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