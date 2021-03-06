var firebase = require("firebase");
var moment = require('moment-timezone');
var open = require('open');

moment.tz.setDefault("Asia/Calcutta");

firebase.initializeApp({
  serviceAccount: "AlertingTool-11fe210928fa.json",
  databaseURL: "https://alertingtool.firebaseio.com/",
  databaseAuthVariableOverride: {
    uid: "alerttool-client-service-worker-hy7y9asfe7yaw"
  }
});

var db = firebase.database();
var ref = db.ref("/tasks").orderByChild("active").equalTo(true);

var tasks={};
var popups={};
ref.on("value", function(snapshot) {
    tasks=snapshot.val()||{};
  //console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
function popup(key){
    popups[key]=moment().unix();
    open("https://alertingtool.firebaseapp.com/task/"+key);
}
setInterval(function(){
    tasks=tasks||{};
    Object.keys(tasks).forEach(function(key) {
        var task=tasks[key];
        if(moment.unix(task.time).isBefore(moment())){
            if((typeof popups[key] === "number")){
                if(moment().diff(moment.unix(popups[key]),"minutes")>5){
                    popup(key);
                }
            }else{
                popup(key);
            }
        }
    });
},1000);
