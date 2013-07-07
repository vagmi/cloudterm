
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , collab = require('./collaborate')
  , socketio = require('socket.io')
  , sessions = require('./routes/sessions')
  , http = require('http')
  , path = require('path');


var app = express();
collab.createServer(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/sessions/new', sessions.newSession);
app.get('/sessions/:id', sessions.showSession);
app.get('/problems/:code', routes.problem);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
sessions.wireUpSocketIo(server);
