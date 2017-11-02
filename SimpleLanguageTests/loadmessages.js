function loadmessages(){
    console.log("dom elements are loaded")
    fetch("/myapp/users").then(function(resp){
        resp.json().then(function(data){
            let div = document.getElementById("user")
            while(div.firstChild){
            div.removeChild(div.firstChild);
              //  console.log("Removed" + div.firstChild.innerHTML)
            }
            for(let j = 0;j<data.length;j++)
            {
                var node = document.createElement("p");  
                node.innerHTML = "<b>Name:</b>" + data[j]["username"] + "<b> Message:</b>" + data[j]["message"]               // Create a <h2> node
                div.appendChild(node)
            }
            var currentdate = new Date();             
            var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/" 
            + currentdate.getFullYear() + " @ "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();

            document.getElementById("lastupdated").innerHTML = datetime
        })
    })
}

window.onload = loadmessages()

window.setInterval(loadmessages,10000)