var Git = require("nodegit"),
    pathToRepo = require("path").resolve("."),
    spawn = require('child_process').spawn,
    gitlock=false;
function log(){
    var m=arguments[0];
    console.log(m);
}
var repository;
function run_git_fetch(){
    gitlock=true;
    log("git fetch");
    Git.Repository.open(pathToRepo)
    .then(function(repo) {
        repository = repo;
        log("git repository opened");
        return repo.fetch("origin");
    })
    .then(function() {
        log("git fetch complete");
        return repository.mergeBranches("master", "origin/master");
    })
    .then(function(){
        log("git merge complete");
        gitlock=false;
    })
    .catch(function (reasonForFailure) {
        log(reasonForFailure);
        gitlock=false;
    });
}
function run_app(){
    if(!gitlock){
        log("app");
	    app=spawn("node.exe",["app/run.js"]);
    }
}
run_app();
run_git_fetch();
// setInterval(function(){
//     run_app();
// },5*60*1000);
setInterval(function(){
    run_git_fetch();
},30*60*1000);