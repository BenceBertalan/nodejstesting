let git = require("nodegit");
let fs = require('file-system');
let http = require("https")
let github = require("octonode");
let process = require("shelljs")
///
let clone_dir = "cloned_repo"
let clone_path = __dirname + "/" + clone_dir
let repourl = 'https://github.com/BenceBertalan/DockerTestRepo.git'
let reponame = 'DockerTestRepo'
let containertag = 'bencebertalan/nodetest'
let containerport = '9001:9001'


function sortFunction(a,b){  
    var dateA = new Date(a.commit.committer.date).getTime();
    var dateB = new Date(a.commit.committer.date).getTime();
    return dateA > dateB ? 1 : -1;  
}; 

function CheckLastCommit(){

var lastcommitfile_path = __dirname + "/lastcommit.json";
var lastcommit
var github_lastcommit
var checkstatus = false

let client = github.client();
client.get("/repos/BenceBertalan/DockerTestRepo/commits",function(err, status, body, headers){
    if(fs.existsSync(lastcommitfile_path)){    
    let lastcommitfile = JSON.parse(fs.readFileSync(lastcommitfile_path,"utf8"))        
    lastcommit_sorted = body.sort(sortFunction)[0]
    //console.log(lastcommit_sorted)
    if(lastcommit_sorted.sha != lastcommitfile.sha){
    github_lastcommit = lastcommit_sorted        
    }    
}else{
    github_lastcommit = body.sort(sortFunction)[0]
    }
    if(github_lastcommit != null){
    console.log("There's a new commit by " + github_lastcommit.commit.author.name + " on " + github_lastcommit.commit.author.date + " : " + github_lastcommit.commit.message)
    fs.writeFileSync(lastcommitfile_path,JSON.stringify(github_lastcommit))
    checkstatus = true
    DeployNewContainer(checkstatus)
    }else{
    console.log("There is no new version.")
    }
    
})
return checkstatus
}
var check = CheckLastCommit()


function DeployNewContainer(checkstatus){
if(checkstatus == true){
    console.log("Creating New image....")
    console.log("... Cloning Git Repo....")
    if (fs.existsSync(clone_path)){
        fs.rmdirSync(clone_path);
        fs.mkdirSync(clone_path);
    }
    git.Clone(repourl,clone_path)
    console.log("Checking if dockerfile is in place")
    var Dockerfile_path = clone_path + "/Dockerfile";
    var Dockerfile_exists = fs.existsSync(Dockerfile_path)
    if(Dockerfile_exists)
    {
      var buildresult = process.exec("docker","build -t " + containertag + " " + clone_dir + "/").stdout
      console.log(buildresult);
      var runresult = process.exec("docker","run -d -p " + containerport + " " + containertag).stdout
    }


    }
}