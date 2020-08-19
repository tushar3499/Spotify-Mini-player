



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
                
                document.getElementById("Present").innerHTML = str;
            }
            else{
                console.log("Error GET");
            }
        }
        req.send();
    });
}


document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("list_playlist").addEventListener("click",get_playlists);
});
