const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Add messages when sockets open and close connections
io.on('connection', socket => {
    // console.log(`[${socket.id}] socket connected`);
    socket.on('disconnect', reason => {
      console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
    socket.on('press', reason => {
        console.log('press', reason)
    });
  });
  
  // Broadcast the current server time as global message, every 1s
  setInterval(() => {
    io.sockets.emit('time-msg', { time: new Date().toISOString() });
    console.log('from server')
  }, 10000);



const PORT = 3000 || process.env.PORT;

server.listen(PORT, '192.168.43.144', () => console.log(`Server running on port ${PORT}`));