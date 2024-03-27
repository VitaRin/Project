import { io } from "socket.io-client";
import {SocksProxyAgent} from "socks-proxy-agent"
import { Server } from 'socket.io'
//import * as express from 'express';
import * as express from 'http';
const app = express.createServer();
const client_socket = new Server(app);



//const serverUrl = "ws://localhost:3000";
const serverUrl = "ws://3ugas2dxa3u6gknx7qoak7b2rroqcmolarx6k3fqivpn4x2uwgl2g3ad.onion";

//create the socks proxy
const proxyAgent = new SocksProxyAgent("socks://localhost:9050");

//use socks to connect to server
const server_socket = io(serverUrl, {
    agent: proxyAgent
});

//test the connection
server_socket.on('connect', () => {
    console.log('Connected to server via SOCKS proxy');
});

client_socket.on('connection', (socket) => {
    socket.on('sent message', (msg) => {
        server_socket.emit('sent message', msg);
        console.log(msg)
        console.log("sent")
    });
    socket.on('kill', (msg) => {
        server_socket.emit('kill', msg);
        console.log("kill");
    });
    socket.on('get messages', (msg) => {
        server_socket.emit('get messages', msg);
    })
});

server_socket.on('rec message', (msg) => {
    client_socket.emit('rec message', msg);
    console.log(msg)
    console.log("rec")
});

server_socket.on('got messages', (msg) =>{
    client_socket.emit('got messages', msg)
})

// client_socket.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         server_socket.emit('chat message', msg);
//         console.log(msg)
//         console.log("sent")
//     });
// });
//
// server_socket.on('chat message', (msg) => {
//     client_socket.emit('chat message', msg);
//     console.log(msg)
// });
//server_socket.emit('chat message', "mes2");

app.listen(4000,() =>{
    console.log("4000")
});

/*io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('sent message', (msg) => {
        messages.push(msg)
        io.emit('rec message', messages);
        console.log(msg)
        console.log(messages)
    });
    socket.on('kill', (msg) => {
        messages = [];
    });
    socket.on('get messages', (msg) => {
        io.emit('got messages', messages);
    })
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});*/