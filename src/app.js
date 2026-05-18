const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/check', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    mongo_uri: process.env.MONGODB_URI,
    port: process.env.PORT || 5000,
  });
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

module.exports = app;
