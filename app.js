const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`💬 Server is running on port ${PORT}`);
});


const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

// To make connection & once connection removed
io.on('connection', onConnected);
io.emit('clients-total', socketsConnected.size);

function onConnected(socket) {
    // console.log('🔌 New user connected', socket.id);
    socketsConnected.add(socket.id)
    io.emit('clients-total', socketsConnected.size);

    socket.on("disconnect", () => {
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on("message", (data) => {
        socket.broadcast.emit("chat-message", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
}