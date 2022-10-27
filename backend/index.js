const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000'
}));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});



// Add messages when sockets open and close connections
io.on('connection', socket => {
    // console.log(`[${socket.id}] socket connected`);
    socket.on('disconnect', reason => {
        console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
    socket.on('press', reason => {
        console.log('press', reason)
    });
    socket.on('webapp', reason => {
        // io.sockets.emit("webappmobile", { value: "you have appointment" })
        socket.broadcast.emit("webappmobile", { value: "you have appointment" })
        console.log('web-app is click trigger sms in mobile app', reason)
    });
});

// Broadcast the current server time as global message, every 1s
setInterval(() => {
    io.sockets.emit('time-msg', { time: new Date().toISOString() });
    console.log('from server')
}, 10000);



const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));