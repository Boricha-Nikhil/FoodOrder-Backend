const express = require('express');
const router = express.Router();
const { getAllMenuItems, getMenuItemById } = require('../controllers/menuController');

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);

module.exports = router;
