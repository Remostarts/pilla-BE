const {sendNotificationToUser } = require('../utils/notificationUtils')

const createTransaction = async (req, res) => {
  const { email, amount } = req.body;

  try {

    const transaction = { email, amount, timestamp: new Date() };

    sendNotificationToUser(email, {
      type: 'transaction',
      message: `You made a transaction of $${amount}`,
      transaction,
    });
  
    res.status(200).json({ message: 'Transaction successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Transaction failed', error });
  }
};

module.exports = { createTransaction };
