'use strict';
// Module dependencies
const API_PORT = process.env.API_PORT || 4000;
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
  });
  server.listen(API_PORT, function() { });
  
  // create the server
  var wsServer = new WebSocketServer({
    httpServer: server
  });
  
  // WebSocket server
  wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
  
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log(message);
        // process WebSocket message
        if(message.utf8Data === 'HS'){
            console.log('sending highscores');
            var scores = [56, 78, 55, 89, 10];
            connection.send(scores);
        } else {
            console.log('Score: ' + message.utf8Data);
        }
      }
    });
  
    connection.on('close', function(connection) {
      // close user connection
    });
  });