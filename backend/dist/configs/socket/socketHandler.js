"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocket = setUpSocket;
function setUpSocket(io) {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        console.log(`User Connected: ${userId} (Socket ID: ${socket.id})`);
        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${userId} (Socket ID: ${socket.id})`);
        });
    });
}
