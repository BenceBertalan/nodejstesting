var git = require("nodegit");
var fs = require('file-system');
var http = require("https")
var github = require("octonode");
var process = require("shelljs")
///
var gitaccesstoken = "6385a19e69a635ff463ecb07048db5f0b7efacfc "
var clone_dir = "cloned_repo"
var clone_path = __dirname + "/" + clone_dir
var reponame = 'DockerTestRepo'
var repourl = "https://github.com/BenceBertalan/" + reponame + ".git"
var containertag = 'bencebertalan/nodetest'
var containerport = '8080:8080'
var running_container_id_file = __dirname + "/runningcontainer.id"
var intervall = 5


function sortFunction(a,b){  
    var dateA = new Date(a.commit.committer.date).getTime();
    var dateB = new Date(a.commit.committer.date).getTime();
    return dateA > dateB ? 1 : -1;  
}; 

function CheckAndDeploy(){

var lastcommitfile_path = __dirname + "/lastcommit.json";
var lastcommit
var github_lastcommit
var checkstatus = false

var client = github.client(gitaccesstoken);
    console.log("Querying github for last commit on the repo...")
client.get("/repos/BenceBertalan/" + reponame + "/commits",function(err, status, body, headers){
    if(fs.existsSync(lastcommitfile_path)){  
    var lastcommitfile = JSON.parse(fs.readFileSync(lastcommitfile_path,"utf8"))        
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
    console.log("There is no new commit.")
    }
    
})
return checkstatus
}

function DeployNewContainer(checkstatus){
if(checkstatus == true){
    console.log("Creating New image....")
    console.log("----Cloning Git Repo----")
    if (fs.existsSync(clone_path)){
      fs.rmdirSync(clone_path);
      fs.mkdirSync(clone_path);
    }
    git.Clone(repourl,clone_path).then(function(repo){
    process.exec("chmod 777 -R " + clone_path)
    console.log("--Checking if dockerfile is in place")
    var Dockerfile_path = clone_path + "/Dockerfile";
    var Dockerfile_exists = fs.existsSync(Dockerfile_path);
    if(Dockerfile_exists)
    {
    console.log("--Dockerfile is in place, Running Build...")  
        var running_containerid = null
        if(fs.existsSync(running_container_id_file)){
            console.log("--A Container is running with ID " + running_containerid + ", stopping and removing...")
          running_containerid = fs.readFileSync(running_container_id_file,"utf8")
          process.exec("docker stop " + running_containerid)
          process.exec("docker rm " + running_containerid)
          fs.unlinkSync(running_container_id_file)
        }
      var buildresult = process.exec("docker build -t " + containertag + " " + clone_dir + "/").stdout
      console.log("----Spinning up container based on parameters");
      var containerid = process.exec("docker run -d -p " + containerport + " " + containertag).stdout
      fs.writeFileSync(running_container_id_file,containerid)
      console.log("Container is built and running with id " + containerid)
    }else{
        console.log("----Dockerfile not found, please, check the repo!")

    }
})

    }
}

function ServiceCall(){
    console.log("Starting check process...")
    CheckAndDeploy()
    console.log("Waiting " + intervall + " then restarting process")
}

setInterval(ServiceCall,intervall*1000)