const functions = require('firebase-functions');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let currentState = null;

io.on('connection', (socket) => {
    console.log('Uživatel se připojil.');

    socket.on('state-change', (state) => {
        console.log(`Stav změněn na ${state}`);
        currentState = state;
        io.emit('state-change', state);
    });

    socket.on('disconnect', () => {
        console.log('Uživatel se odpojil.');
    });

    socket.on('get-state', () => {
        console.log('Žádost o aktuální stav.');
        io.to(socket.id).emit('current-state', currentState);
    });
});

app.get('/', (req, res) => {
    res.send('Hello from Firebase Functions!');
});

exports.app = functions.https.onRequest(app);
