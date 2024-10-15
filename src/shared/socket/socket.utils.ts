import { getOnlineUsers, getSocketInstance } from './socket.config';

type NotificationData = {
    title: string;
    message: string;
    [key: string]: string | number | boolean;
};

const sendNotificationToUser = (email: string, notificationData: NotificationData): void => {
    const io = getSocketInstance();
    const onlineUsers = getOnlineUsers();
    const socketId = onlineUsers[email];

    if (!io) {
        console.error('Socket instance is not initialized.');
        return;
    }

    // io.emit('notification', notificationData); // Emit to all users

    if (socketId) {
        io.to(socketId).emit('notification', notificationData); // Emit to specific user
        console.log(`Notification sent to ${email} (Socket ID: ${socketId})`);
    } else {
        console.log(`User with email ${email} is not online.`);
    }
};

export { sendNotificationToUser };
