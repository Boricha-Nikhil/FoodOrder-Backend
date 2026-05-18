require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-ordering';

const menuItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'pizza',
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with spicy pepperoni and melted cheese',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    category: 'pizza',
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken with BBQ sauce, red onions, and cilantro',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    category: 'pizza',
  },
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and secret sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'burger',
  },
  {
    name: 'Cheese Burger',
    description: 'Double cheese with caramelized onions and pickles',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
    category: 'burger',
  },
  {
    name: 'Chicken Burger',
    description: 'Crispy fried chicken with coleslaw and mayo',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
    category: 'burger',
  },
  {
    name: 'Cola',
    description: 'Refreshing chilled cola drink',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
    category: 'drinks',
  },
  {
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with yogurt and ice',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
    category: 'drinks',
  },
  {
    name: 'Chocolate Brownie',
    description: 'Warm fudgy brownie topped with vanilla ice cream',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
    category: 'dessert',
  },
  {
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake with berry compote',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400',
    category: 'dessert',
  },
];

const seedMenu = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    await MenuItem.deleteMany({});
    const created = await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${created.length} menu items`);

    await mongoose.connection.close();
    console.log('Seed complete, connection closed');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedMenu();
