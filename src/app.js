require('dotenv').config();

const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');
const ensureDb = require('./middleware/ensureDb');

const app = express();

app.use(cors());
app.use(express.json());

app.use(ensureDb);

app.get('/check', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    dbConnected: true,
    port: process.env.PORT || 5000,
  });
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

module.exports = app;
