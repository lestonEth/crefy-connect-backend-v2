// socket.service.ts
import { Server, Socket } from 'socket.io';

let io: Server;
const activeSockets: Record<string, Socket> = {};

export const initSocket = (httpServer: any) => {
    console.log("initSocket");
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Get the custom socketId from the handshake query
        console.log('socket.handshake.query', socket.handshake.query);
        const customSocketId = socket.handshake.query.socketId as string;
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

export const getSocket = (socketId: string) => {
    console.log('getSocket', socketId);
    console.log('activeSockets', Object.keys(activeSockets));
    return activeSockets[socketId];
};