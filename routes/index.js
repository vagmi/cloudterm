var fs=require('fs'), _=require('underscore');
exports.index = function(req, res){
  res.render('index', { title: 'Cloudterm - Write and Run code from your browser collaboratively'});
};

var commentCode = function(code,language) {
  console.log(code);
  var commentStr = "# ";
  if(language=="node") {
    commentStr="// ";
  }
  var lines = _.map(code.split('\n'),function(line){ return commentStr+line; }).join("\n");
  return lines;
}

exports.problem = function(req,res) {
  var p = req.params.code;
  var language = req.query.language;
  fs.readFile('problems/'+p+'.txt',function(err,data){
    if(err!=null){
      data="sorry but you are on your own";
    }
    var responseText=commentCode(data.toString(),language);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', responseText.length);
    res.end(responseText);
  });
};
