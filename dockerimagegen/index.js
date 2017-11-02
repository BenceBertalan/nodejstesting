//let git = require("nodegit");
let fs = require('file-system');
let http = require("https")
let github = require("octonode");
let clone_path = __dirname + "/cloned_repo"
let repourl = 'https://github.com/BenceBertalan/nodejstesting.git'

function sortFunction(a,b){  
    var dateA = new Date(a.commit.committer.date).getTime();
    var dateB = new Date(a.commit.committer.date).getTime();
    return dateA > dateB ? 1 : -1;  
}; 

  function CheckLastCommit(){

var lastcommitfile_path = __dirname + "/lastcommit.json";
var lastcommit
var github_lastcommit

let client = github.client();
client.get("/repos/BenceBertalan/nodejstesting/commits",function(err, status, body, headers){
    if(fs.existsSync(lastcommitfile_path)){    
    let lastcommitfile = JSON.parse(fs.readFileSync(lastcommitfile_path,"utf8"))        
    lastcommit = body.find(o => o.sha === lastcommitfile.sha)
    if(lastcommit == null){
    github_lastcommit = body.sort(sortFunction)[0]        
    }    
}else{
    github_lastcommit = body.sort(sortFunction)[0]
    }
    if(github_lastcommit != null){
    console.log("There's a new commit by " + lastcommit.commit.author.name + " on " + lastcommit.commit.author.date + ":" + lastcommit.commit.message)
    fs.writeFileSync(lastcommitfile_path,JSON.stringify(lastcommit))
    return true;
    }else{
        return false;
    }
})

}

CheckLastCommit()

function BuildNewContainer(){

if (fs.existsSync(path)) {
    fs.rmdirSync(clone_path);
    fs.mkdirSync(clone_path);
}



//git.Clone('https://github.com/BenceBertalan/nodejstesting.git',)

}