const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const MenuItem = require('../src/models/MenuItem');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-ordering-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await MenuItem.deleteMany({});
  await MenuItem.insertMany([
    { name: 'Test Pizza', description: 'Tasty', price: 10.99, image: 'http://img.com/pizza.jpg', category: 'pizza' },
    { name: 'Test Burger', description: 'Juicy', price: 8.99, image: 'http://img.com/burger.jpg', category: 'burger' },
  ]);
});

describe('GET /api/menu', () => {
  it('should return all menu items', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it('should filter by category', async () => {
    const res = await request(app).get('/api/menu?category=pizza');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Test Pizza');
  });
});

describe('GET /api/menu/:id', () => {
  it('should return a single menu item', async () => {
    const item = await MenuItem.findOne({ name: 'Test Pizza' });
    const res = await request(app).get(`/api/menu/${item._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Test Pizza');
  });

  it('should return 404 for non-existent item', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/menu/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
