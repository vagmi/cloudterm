var hat = require('hat'),
    exec = require('child_process').exec,
    fs = require('fs'),
    socketio = require('socket.io'),
    rimraf = require('rimraf'),
    docker = require('../lib/docker'),
    collab = require('../collaborate');

exports.wireUpSocketIo = function(server){
  var io=socketio.listen(server);
  io.sockets.on('connection',function(socket){
    socket.on('run',function(data){
      runSession(data,io);  
    });
  });
}

exports.newSession =   function(req,res) {
  var session_id=hat();
  res.redirect('/sessions/'+session_id);
};

exports.showSession = function(req,res) {
  var session_id=req.params.id;
  res.render('sessions/show', {session_id: session_id, title: "Cloudterm - " + session_id});
};
var runSession= function(data,io) {
  var session_id=data.sessionId;
  var language=data.language;
  var extensions = {"ruby":"rb","python":"py"};
  collab.server._events.request.model.getSnapshot(session_id, function(error,obj) {
    var version = obj.v;
    var snapshot = obj.snapshot;
    var dirName = "/tmp/"+session_id.replace("-","")+"/"+version
    exec('mkdir -p ' + dirName,function(error,stdout,stderr) {
      var extension = extensions[language];
      var fileName = "file."+extension;
      var scriptFile = dirName + "/" + fileName;
      if(!fs.existsSync(scriptFile)) {
        fs.writeFileSync(scriptFile,snapshot);
      }
      docker.run(language,dirName,fileName,function(data){
        io.sockets.emit('/results/'+session_id,{output: data});
        rimraf(dirName, function(){});
      });
    })
  });
}

