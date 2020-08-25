
var client_id = "b69b038fdd164181b886e470d07cf52e"; // Your client id
var client_secret = "71b70a84221843c4b25f4c9bb0ff8133"; // Your secret
var redirect_uri = "https%3A%2F%2Fwww.google.com%2F"; // Your redirect uri
var scopes = "user-read-private user-read-email playlist-read-private";
var code = null;

var new_tab;
var get_url = "https://accounts.spotify.com/authorize?client_id=b69b038fdd164181b886e470d07cf52e&response_type=code&redirect_uri="+redirect_uri+"&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-modify-public%20playlist-modify-private&state=34fFs29kd09"

chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({'url': get_url}, function(tab) {
        new_tab = tab.id;
        console.log(tab.url,"Hi",new_tab);
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
            if (changeInfo.url && tabId == new_tab && !tab.url.match(/spotify/g)){
                var token_url = changeInfo.url;
                console.log(token_url);
                var res = token_url.split("&");
                if(res[0].match(/error/)){
                    alert("Invalid_Response");
                }
                else{
                    code = res[0].split("=")[1];  
                    chrome.storage.sync.set({ ['code'] : code })
                    const req = new XMLHttpRequest();
                    const baseUrl = 'https://accounts.spotify.com/api/token';
                    const urlParams = `grant_type=authorization_code&code=`+code+`&redirect_uri=`+redirect_uri;

                    req.open("POST", baseUrl, true);
                    console.log(urlParams, btoa(client_id+':'+client_secret));
                    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    req.setRequestHeader('Authorization','Basic ' +btoa(client_id+':'+client_secret));
                    req.send(urlParams);

                    req.onreadystatechange = function() { // Call a function when the state changes.
                        console.log("Hi2");
                        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                            console.log("Got response 200!");
                            console.log(this.response);
                            var res_obj = JSON.parse(this.responseText);
                            console.log(res_obj.access_token, res_obj.refresh_token);
                            chrome.storage.sync.set({ ['acc_tok'] : res_obj.access_token });
                            chrome.storage.sync.set({ ['ref_tok'] : res_obj.refresh_token});

                            const req_info = new XMLHttpRequest();
                            req_info.open("GET","https://api.spotify.com/v1/me");
                            req_info.setRequestHeader('Authorization','Bearer '+ res_obj.access_token);
                            req_info.onreadystatechange = function() { // Call a function when the state changes.
                                console.log("Hi_get");
                                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                                    console.log("Got response 200!");
                                    console.log(this.response);
                                    var myobj = JSON.parse(this.responseText);
                                    console.log(myobj.id, myobj.display_name);
                                    chrome.storage.sync.set({ ['user_id'] : myobj.id });
                                    chrome.storage.sync.set({ ['disp_name'] : myobj.display_name });
                                }
                                else{
                                    console.log("Error GET");
                                }
                            }
                            req_info.send();
                        }
                        else{
                            console.log("Error POST");
                        }
                    }
                }
                // chrome.storage.sync.set({ ['access_tok'] : "Hi1" });
            }
        });
    });
});