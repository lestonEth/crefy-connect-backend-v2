"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocket = exports.initSocket = void 0;
// socket.service.ts
const socket_io_1 = require("socket.io");
let io;
const activeSockets = {};
const initSocket = (httpServer) => {
    console.log("initSocket");
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        // Get the custom socketId from the handshake query
        console.log('socket.handshake.query', socket.handshake.query);
        const customSocketId = socket.handshake.query.socketId;
        if (customSocketId) {
            activeSockets[customSocketId] = socket;
        }
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            if (customSocketId) {
                delete activeSockets[customSocketId];
            }
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getSocket = (socketId) => {
    console.log('getSocket', socketId);
    console.log('activeSockets', Object.keys(activeSockets));
    return activeSockets[socketId];
};
exports.getSocket = getSocket;
