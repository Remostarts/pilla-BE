const express = require('express');
const path = require('path');
const transactionController = require('./controllers/transactionController');

const app = express();
app.use(express.json());
app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
});

// Routes
app.post('/transaction', transactionController.createTransaction);

module.exports = app;
