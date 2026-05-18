const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true, enum: ['pizza', 'burger', 'drinks', 'dessert'] },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
