const { getSocketInstance, getOnlineUsers } = require('../config/socket');

const sendNotificationToUser = (email, notificationData) => {
  const io = getSocketInstance();
  const onlineUsers = getOnlineUsers();
  const socketId = onlineUsers[email];

  io.emit('notification', notificationData);
  if (socketId) {
    io.to(socketId).emit('notification', notificationData);
    console.log(`Notification sent to ${email} (Socket ID: ${socketId})`);
  } else {
    console.log(`User with email ${email} is not online.`);
  }
};

module.exports = { sendNotificationToUser };
