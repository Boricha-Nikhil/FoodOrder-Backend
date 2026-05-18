const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');

const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Each item must have a menuItem ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('customer.address')
    .trim()
    .notEmpty()
    .withMessage('Delivery address is required'),
  body('customer.phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone must be a valid 10-digit number'),
];

const statusValidation = [
  body('status')
    .isIn(['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'])
    .withMessage('Invalid order status'),
];

router.post('/', orderValidation, validate, createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', statusValidation, validate, updateOrderStatus);

module.exports = router;
