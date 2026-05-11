import {Server} from "socket.io";
import http from 'http';
import express from 'express';
import {ENV} from './env.js';
import {socketAuthMiddleware} from '../middleware/socketAuthMiddleware.js';

const app = express();
const server = http.createServer(app)

// Build allowed origins — normalize CLIENT_URL by stripping trailing slash
const socketAllowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
];
if (ENV.CLIENT_URL) {
    socketAllowedOrigins.push(ENV.CLIENT_URL.replace(/\/+$/, ''));
}

const io = new Server(server,{
    cors : {
        origin : socketAllowedOrigins,
        credentials : true,
    },

});

io.use(socketAuthMiddleware);

const userSocketMap = {};

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

io.on('connection',(socket) => {
    console.log(`A user is connected ${socket.user.fullName}`)

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    // WebRTC signaling pipeline.
    
    // Routes initial SDP offer.
    socket.on("call-user", ({ userToCall, signalData, from, name }) => {
        const targetSocketId = getReceiverSocketId(userToCall);
        
        if (targetSocketId) {
            // Dispatches payload to recipient.
            io.to(targetSocketId).emit("call-user", { signal: signalData, from, name });
        }
    });

    // Routes subsequent SDP answer.
    socket.on("answer-call", (data) => {
        const targetSocketId = getReceiverSocketId(data.to);
        
        if (targetSocketId) {
            // Completes handshake loop.
            io.to(targetSocketId).emit("call-accepted", data.signal);
        }
    });

    // STUN/TURN routing resolution.
    socket.on("send-ice-candidate", ({ to, candidate }) => {
        const targetSocketId = getReceiverSocketId(to);
        
        if (targetSocketId) {
            // Exchanges finalized traversal paths.
            io.to(targetSocketId).emit("receive-ice-candidate", candidate);
        }
    });

    // Manages peer teardown.
    socket.on("end-call", ({ to }) => {
        const targetSocketId = getReceiverSocketId(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit("call-ended");
        }
    });

    // Typing indicators
    socket.on("typing", ({ receiverId }) => {
        const targetSocketId = getReceiverSocketId(receiverId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("typing", { senderId: userId });
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const targetSocketId = getReceiverSocketId(receiverId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("stopTyping", { senderId: userId });
        }
    });

    // ---


    socket.on('disconnect',()=>{
        console.log(`User disconnected ${socket.user.fullName}`);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })

    
});


export {io,server,app}