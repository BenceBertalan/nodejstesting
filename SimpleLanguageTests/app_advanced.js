const express = require("express")
const app = express();
const fs = require("file-system")
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(express.static(__dirname + "/"));

app.get("/",function(req,resp){
 fs.readFile(__dirname + "/htmlfrontend.html",function(err,data){
    if(!err){
    resp.write(data)
    resp.end()
    }   
})

})

app.post("/myapp/newuser",function(req,resp){
    var dat = new Date();
    var timestamp = dat.getTime();
    let newuser =  req["body"]["username"]
    if(newuser != null && newuser != ""){
    let jsonuser = JSON.stringify({"username":req["body"]["username"],"message":req["body"]["message"],"timestamp":timestamp})
    fs.writeFile(__dirname + "/" + timestamp + "_" + newuser + ".json",jsonuser,function(err) {
     console.log(err)
    })
    }
    resp.redirect("/")
})

app.get("/myapp/users",function(req,resp){
    var allusers = new Array();
    let filelist = fs.readdirSync(__dirname + "/")
    for(let i = 0;i<filelist.length;i++)
    {
        if(filelist[i].match(".json")){    
        jsonfile = fs.readFileSync(__dirname + "/" + filelist[i])     
            let d = JSON.parse(jsonfile)
            if(d != null && d != "")
            {
                allusers.push(d);
            }
        }
    }
    resp.send(allusers)
    
})

app.listen(9001,function(err){
    if(!err)
    {
        console.log("I...am...LISTENING! on port 9000")
    }else{
        console.log(err)
    }

})
