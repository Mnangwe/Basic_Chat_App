const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
var clients = 0
io.on('connection', (socket) => {
  clients++
  let username = 'New User'

  socket.broadcast.emit('chat message', {
    username: username,
    msg: "Hi! 🥳"
  })
  
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data)
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', { username, msg } )
    // socket.broadcast.emit('chat message', msg)
  });


  socket.on('register', newUsername => {
    username = newUsername
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('chat message', {
      username: username,
      msg: 'Goodbye! 👋'})
  })
    
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});