const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let onlineUsers = new Set();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    onlineUsers.add(socket.id);
    io.emit('update users', Array.from(onlineUsers));

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(socket.id);
        io.emit('update users', Array.from(onlineUsers));
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
