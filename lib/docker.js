var request=require('request');
var docker_url = "http://localhost:4243";
var optionsForLang = function(lang,file) {
  var dockerOptions = {
     Hostname:"",
     User:"",
     Memory:52428800,
     MemorySwap:52428800,
     CpuShare:10,
     AttachStdin:false,
     AttachStdout:true,
     AttachStderr:true,
     PortSpecs:null,
     Tty:true,
     OpenStdin:false,
     StdinOnce:false,
     Env:null,
     Dns:null,
     Cmd: [lang,file],
     Image:"vagmi/cloudterm:v2",
     Volumes:{"/var/cloudterm":{}},
     VolumesFrom:""
  };
  return dockerOptions;
}
exports.run = function(language, baseDir,fileName, next) {
  var opts = optionsForLang(language,"/var/cloudterm/"+fileName);
  request({url:docker_url+"/containers/create",json: opts,method: "POST"},function(error, resp, data) {
    var containerId = data.Id;
    var binds = {Binds:[baseDir+":/var/cloudterm"]};
    request.post({url: docker_url+"/containers/"+containerId+"/attach",qs: {logs: true, stream: true, stdout:true, stderr:true}, method: "POST"},function(error,resp,data) {
      next(data);
    });
    request.post({url: docker_url+"/containers/"+containerId+"/start", 
                  json: binds, 
                  method: "POST"}, function(error, resp, data) {
    });
  });
}
