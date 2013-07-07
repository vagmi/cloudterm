var sharejs = require('share'), 
    http = require('http');

exports.options = {
  db: {type: 'redis'},
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    // This auth handler rejects any ops bound for docs starting with 'readonly'.
    if (action.name === 'submit op' && action.docName.match(/^readonly/)) {
      action.reject();
    } else {
      action.accept();
    }
  }
};
//Lets try and enable redis persistance if redis is installed...
//try {
  //require('redis');
  //options.db = {type: 'redis'};
//} catch (e) {}
exports.createServer = function(app) {
  var server =  sharejs.server.attach(app,exports.options);
  exports.server = server;
  return server;
}
