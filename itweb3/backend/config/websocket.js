'use strict';

// Module dependencies
const API_PORT = process.env.API_PORT || 4000;
const Server = require('ws');


module.exports = app => {
    const httpServer = app.listen(API_PORT, () => console.log('Listening on: ' + API_PORT));
    const wsServer = new Server({Server: httpServer});

    wsServer.on('connection',
        websocket => {
            websocket.send('Hello from the WebSocket server');

            websocket.onmessaage = (message) =>
                console.log(`Server received: ${message['data']}`);

            websocket.onerror = (error) =>
                console.log(`Server received: ${error['code']}`);

            websocket.onclose = (why) =>
                console.log(`Server received: ${why.code} ${why.reason}`);
        }
    )
}