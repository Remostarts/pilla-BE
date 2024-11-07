import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

// type definitions
type OnlineUsers = {
    [email: string]: string;
};

let io: Server;
const onlineUsers: OnlineUsers = {}; // Mapping of email -> socketId

export const initSocket = (server: HttpServer): Server => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

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

        socket.on('connect_user', (email: string) => {
            onlineUsers[email] = socket.id;
            console.log(`User identified: ${email} -> Socket ID: ${socket.id}`);
        });

        // socket.on('user-message', (email: string, message: string) => {
        //     // io.emit('message', message);
        //     const socketId = onlineUsers[email];
        //     io.to(socketId).emit('message', message);
        // });
    });

    return io;
};

export const getSocketInstance = (): Server | undefined => io;
export const getOnlineUsers = (): { [email: string]: string } => onlineUsers;
