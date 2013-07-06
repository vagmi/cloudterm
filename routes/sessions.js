var uuid = require('node-uuid'),
    exec = require('child_process').exec,
    fs = require('fs'),
    rimraf = require('rimraf'),
    collab = require('../collaborate');

exports.newSession =   function(req,res) {
  var session_id=uuid.v4();
  res.redirect('/sessions/'+session_id);
};
exports.showSession = function(req,res) {
  var session_id=req.params.id;
  res.render('sessions/show', {session_id: session_id, title: "Cloudterm - " + session_id});
};
exports.exec = function(req,res) {
  var session_id=req.params.id;
  collab.server._events.request.model.getSnapshot(session_id, function(error,obj) {
    var version = obj.v;
    var snapshot = obj.snapshot;
    var dirName = "/tmp/"+session_id+"/"+version
    exec('mkdir -p ' + dirName,function(error,stdout,stderr) {
      var scriptFile = dirName+"/file.rb";
      if(!fs.existsSync(scriptFile)) {
        fs.writeFileSync(scriptFile,snapshot);
      }
      var child = exec('ruby ' + scriptFile, function(error, stdout, stderr) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);

        res.render('sessions/results',{output: stdout, error: stderr});
      });
    })
  });
}
