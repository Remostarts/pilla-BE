import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;
const onlineUsers: { [email: string]: string } = {}; // Mapping of email -> socketId

const initSocket = (server: HttpServer): Server => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        socket.on('identify', (email: string) => {
            onlineUsers[email] = socket.id;
            console.log(`User identified: ${email} -> Socket ID: ${socket.id}`);
        });

        socket.on('user-message', (email: string, message: string) => {
            // io.emit('message', message);
            const socketId = onlineUsers[email];
            io.to(socketId).emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Use Object.entries with forEach to safely iterate and avoid explicit loops
            Object.entries(onlineUsers).forEach(([email, id]) => {
                if (id === socket.id) {
                    delete onlineUsers[email];
                    console.log(`User with email ${email} disconnected.`);
                }
            });
        });
    });

    return io;
};

const getSocketInstance = (): Server | undefined => io;
const getOnlineUsers = (): { [email: string]: string } => onlineUsers;

export { getOnlineUsers, getSocketInstance, initSocket };
