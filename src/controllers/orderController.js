const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { getIO } = require('../socket/orderSocket');

const createOrder = async (req, res, next) => {
  try {
    const { items, customer } = req.body;

    const menuItemIds = items.map((i) => i.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).json({ success: false, message: 'One or more menu items not found' });
    }

    const menuMap = new Map(menuItems.map((m) => [m._id.toString(), m]));

    const orderItems = items.map((item) => {
      const menuItem = menuMap.get(item.menuItem);
      return {
        menuItem: item.menuItem,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      items: orderItems,
      customer,
      totalAmount,
      status: 'Order Received',
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    try {
      const io = getIO();
      io.to(order._id.toString()).emit('orderStatusUpdate', {
        orderId: order._id.toString(),
        status: order.status,
        updatedAt: new Date().toISOString(),
      });
    } catch (_) {}

    res.json({ success: true, data: order });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrderById, updateOrderStatus, getAllOrders };
