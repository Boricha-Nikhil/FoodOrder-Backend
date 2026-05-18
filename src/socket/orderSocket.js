const { Server } = require('socket.io');
const Order = require('../models/Order');

let io;
const activeSimulations = new Set();

const SIMULATION_DELAY = 15000;

function simulateStatusProgression(orderId) {
  if (activeSimulations.has(orderId)) return;
  activeSimulations.add(orderId);

  const statuses = ['Preparing', 'Out for Delivery', 'Delivered'];

  statuses.forEach((status, index) => {
    setTimeout(async () => {
      try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (order) {
          io.to(orderId).emit('orderStatusUpdate', {
            orderId: orderId,
            status,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (_) {}

      if (status === 'Delivered') {
        activeSimulations.delete(orderId);
      }
    }, SIMULATION_DELAY * (index + 1));
  });
}

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinOrder', async (orderId) => {
      socket.join(orderId);

      try {
        const order = await Order.findById(orderId);
        if (order && order.status === 'Order Received') {
          simulateStatusProgression(orderId);
        }
      } catch (_) {}
    });

    socket.on('disconnect', () => {});
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
