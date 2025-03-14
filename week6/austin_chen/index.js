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

    socket.on('offer', (offer, to) => {
        socket.to(to).emit('offer', offer, socket.id);
    });

    socket.on('answer', (answer, to) => {
        socket.to(to).emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate, to) => {
        socket.to(to).emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(socket.id);
        io.emit('update users', Array.from(onlineUsers));
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});