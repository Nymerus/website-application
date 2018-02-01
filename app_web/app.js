#!/usr/bin/env node

/**
 * Module dependencies
 */
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// Server dependencies
let debug = require('debug')('app_web:server');
let http = require('http');

// Customs requires (Middlewares)
let routes = require('./middleware/routes');
let middleware = require('./middleware/middleware');

// Others dependencies
let pjson = require('./package.json');
let jwt = require('jsonwebtoken');
let clientIo = require('socket.io-client');
let OngoingConnectEvent = require('./ongoing-connect-event');

// Definitions
let app = express();
let AppServer = clientIo(pjson.appserver_ip);
let port = normalizePort(process.env.PORT || '8080');
let onSessionCheckClients = new OngoingConnectEvent();

// Injection over requires
// routes.setAppServer(AppServer);

/**
 * App (express) set-up
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Define open 'routes' for this app (and method which can be used)
 */
app.get('/', routes.index);
app.get('/app/:name', routes.content);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktrace leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

/**
 * Set port.
 */

app.set('port', port);

/**
 * Create HTTP server.
 */
let server = http.createServer(app);

/**
 * Socket.IO proxy service
 */
/*
let io = require('socket.io')(server);

io.on('connection', function (client) {
  console.log("\t[INFO] \t\t\tclient <" + client.id + "> connected");

  client.emit('init', client.id);
  client.emit('version', pjson.version);

  middleware.webClientListeners(client, AppServer, jwt, pjson, onSessionCheckClients);
});

middleware.appServerListeners(io.sockets.sockets, AppServer, jwt, pjson, onSessionCheckClients);
*/

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}