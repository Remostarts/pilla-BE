const http = require('http');
const app = require('./app');
const { initSocket } = require('./config/socket');

const server = http.createServer(app);
const io = initSocket(server);


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
