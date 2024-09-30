const { Server } = require('socket.io');
let io;
let onlineUsers = {};  // Mapping of email -> socketId

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('identify', (email) => {
      onlineUsers[email] = socket.id;
      console.log(`User identified: ${email} -> Socket ID: ${socket.id}`);
    });

    socket.on("user-message", (message) => {
      io.emit("message", message);
      // const socketId = onlineUsers[email];
      // io.to(socketId).emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const email in onlineUsers) {
        if (onlineUsers[email] === socket.id) {
          delete onlineUsers[email];
          console.log(`User with email ${email} disconnected.`);
        }
      }
    });
  });

  return io;
};

const getSocketInstance = () => io;
const getOnlineUsers = () => onlineUsers;

module.exports = { initSocket, getSocketInstance, getOnlineUsers };
