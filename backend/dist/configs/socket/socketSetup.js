"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.setupSocket = setupSocket;
const socket_io_1 = require("socket.io");
let io;
function setupSocket(server) {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
        // Add other socket event handlers here
    });
}
