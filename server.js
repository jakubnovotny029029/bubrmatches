const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let currentState = {
    state1: null,
    state2: null,
};

io.on('connection', (socket) => {
    console.log('Uživatel se připojil.');

    socket.on('state-change', (state) => {
        console.log(`Stav změněn na ${state}`);
        currentState.state1 = state;
        io.emit('state-change', state);
    });

    socket.on('state-change-2', (state) => {
        console.log(`Stav změněn na ${state}`);
        currentState.state2 = state;
        io.emit('state-change-2', state);
    });

    socket.on('disconnect', () => {
        console.log('Uživatel se odpojil.');
    });

    socket.on('get-state', () => {
        console.log('Žádost o aktuální stav.');
        io.to(socket.id).emit('current-state', currentState.state1);
    });

    socket.on('get-state-2', () => {
        console.log('Žádost o aktuální stav 2.');
        io.to(socket.id).emit('current-state-2', currentState.state2);
    });
});

// middleware pro servírování statických souborů z adresáře 'public'
app.use(express.static(path.join(__dirname, '/public')));

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server naslouchá na portu ${port}.`);
});
