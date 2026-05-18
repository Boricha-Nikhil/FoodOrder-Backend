const MenuItem = require('../models/MenuItem');

const getAllMenuItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await MenuItem.find(filter);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    next(error);
  }
};

module.exports = { getAllMenuItems, getMenuItemById };
