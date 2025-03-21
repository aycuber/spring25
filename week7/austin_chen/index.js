const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String }
});

const messageModel = mongoose.model("Message", messageSchema);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', async function(socket) {
  console.log('A user connected');

  try {
    const messages = await messageModel.find();
    console.log('All messages from DB:', messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
  }

  socket.on('chat message', async function(msg) {
    console.log(`Received message: ${msg}`);
    
    try {
        const messages = await messageModel.find();
        console.log('All messages from DB:', messages);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }

    try {
      const message = new messageModel({ content: msg });
      await message.save();
      io.emit('chat message', msg);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, async function(){
  await mongoose.connect("mongodb+srv://aycuber:Cubing916@cluster0.p3fe4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log('listening on *:3000');
});
