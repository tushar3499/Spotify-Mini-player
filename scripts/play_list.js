

var playlist_id;

function get_playlists(){
    chrome.storage.sync.get(['user_id','acc_tok'],function(data){
        var userid = data['user_id'];
        var token = data['acc_tok'];
        document.getElementById("Present").innerHTML = userid;
        var str = "";
        const req = new XMLHttpRequest();
        req.open("GET","https://api.spotify.com/v1/users/"+userid+"/playlists");
        req.setRequestHeader('Authorization','Bearer '+ token);
        req.onreadystatechange = function() { // Call a function when the state changes.
            console.log("Hi_get");
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("Got response 200!");
                console.log(this.response);
                var myobj = JSON.parse(this.responseText);
                
                for(i=0;i<myobj.items.length;i++){
                    str += myobj.items[i]['name'];
                }
                playlist_id = myobj.items[2]['id'];
                document.getElementById("Present").innerHTML = str;
            }
            else{
                console.log("Error GET");
            }
        }
        req.send();
    });
}

function add_to_playlists(){

    var drop = document.getElementById("mySelect");
    var i = drop.selectedIndex;
    document.getElementById("Present").innerHTML = i;
    chrome.storage.sync.get('acc_tok',function(data){
        var token = data['acc_tok'];
        track_uri = encodeURI("spotify:track:4hDR2QHU3MBpLXoB2QsMbK");
        var str = "https://api.spotify.com/v1/playlists/"+drop.options[i].value+"/tracks?position=0&uris="+track_uri;
        document.getElementById("Present").innerHTML = track_uri;
        const req = new XMLHttpRequest();
        req.open("POST",str);
        req.setRequestHeader('Authorization','Bearer '+ token);
        req.onreadystatechange = function() { // Call a function when the state changes.
            console.log("Hi_get");
            if (this.readyState === XMLHttpRequest.DONE) {
                document.getElementById("Present").innerHTML = this.responseText;
            }
        }
        req.send();
        for(i=1;i<drop.options.length;i++){
            drop.remove(i);
        }
        document.getElementById("playlist_form_add").style.display = "none";
    });
}

function remove_from_playlists(){
    chrome.storage.sync.get('acc_tok',function(data){
        var token = data['acc_tok'];
        track_uri = "spotify:track:4hDR2QHU3MBpLXoB2QsMbK";
        var str = "https://api.spotify.com/v1/playlists/"+playlist_id+"/tracks";
        document.getElementById("Present").innerHTML = track_uri;
        const req = new XMLHttpRequest();
        req.open("DELETE",str);
        req.setRequestHeader('Authorization','Bearer '+ token);
        req.setRequestHeader('Content-Type','application/JSON');
        req.onreadystatechange = function() { // Call a function when the state changes.
            console.log("Hi_get");
            if (this.readyState === XMLHttpRequest.DONE) {
                document.getElementById("Present").innerHTML = this.responseText;
            }
        }
        req.send( JSON.stringify( {"tracks":[{"uri":track_uri}]} ) );
    });
}


document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("mySelect").addEventListener("change",add_to_playlists);
    document.getElementById("list_playlist").addEventListener("click",get_playlists);
    document.getElementById("add_playlist").addEventListener("click",function(){

        chrome.storage.sync.get(['user_id','acc_tok'],function(data){
            var userid = data['user_id'];
            var token = data['acc_tok'];
            document.getElementById("Present").innerHTML = userid;
            var str = "";
            const req = new XMLHttpRequest();
            req.open("GET","https://api.spotify.com/v1/users/"+userid+"/playlists");
            req.setRequestHeader('Authorization','Bearer '+ token);
            req.onreadystatechange = function() { // Call a function when the state changes.
                console.log("Hi_get");
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    console.log("Got response 200!");
                    console.log(this.response);
                    var myobj = JSON.parse(this.responseText);
                    
                    for(i=0;i<myobj.items.length;i++){
                        var drop = document.getElementById("mySelect");
                        if(myobj.items[i]['owner']['id'] == userid){
                            var option = document.createElement("option");
                            option.text = myobj.items[i]['name'];
                            option.value = myobj.items[i]['id'];
                            drop.appendChild(option);
                            str += myobj.items[i]['name'];
                        }
                            
                    }
                    document.getElementById("Present").innerHTML = str;
                    document.getElementById("playlist_form_add").style.display = "block";
                }
                else{
                    console.log("Error GET");
                }
            }
            req.send();
        });
    });
    document.getElementById("remove_playlist").addEventListener("click",remove_from_playlists);
});
