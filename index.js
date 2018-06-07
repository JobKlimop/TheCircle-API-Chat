let webSocketServer = require('websocket').server;
let http = require('http');

let webSocketsServerPort = 1337;

let history = [];
let cache = [];
let clients = [];

let server = http.createServer(function (request, response) {
});

server.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

let wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    let connection = request.accept(null, request.origin);
    let index = clients.push(connection) - 1;
    let username;

    if (history.length > 0) {
        connection.sendUTF(JSON.stringify({type: 'history', data: history}));
    }

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            if (!username) {
                username = message.utf8Data;
            } else {
                console.log(username + ": " + message.utf8Data);

                let obj = {
                    content: message.utf8Data,
                    authorId: message.username,
                    timestamp: Date.now()
                };
                cache.push(obj);
                history.push(obj);
                history.slice(-100);

                let json = JSON.stringify({type: 'message', data: obj});
                for (let i = 0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    connection.on('close', function () {
        clients.splice(index, 1);
    });
});
