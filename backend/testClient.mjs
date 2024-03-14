import { io } from "socket.io-client";
import { SocksProxyAgent } from 'socks-proxy-agent';

const serverUrl = "ws://localhost:3000";

//create the socks proxy
const proxyAgent = new SocksProxyAgent("socks://localhost:9050");

//use socks to connect to server
const socket = io(serverUrl, {
  agent: proxyAgent
});

//test the connection
socket.on('connect', () => {
  console.log('Connected to server via SOCKS proxy');
});
socket.emit('chat message', "tor test message");


