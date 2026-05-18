const mongoose = require('mongoose');

const ORDER_STATUSES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    customer: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'Order Received' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
