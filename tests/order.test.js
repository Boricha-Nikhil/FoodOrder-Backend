const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const MenuItem = require('../src/models/MenuItem');
const Order = require('../src/models/Order');

let testMenuItem;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-ordering-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Order.deleteMany({});
  await MenuItem.deleteMany({});
  testMenuItem = await MenuItem.create({
    name: 'Test Pizza',
    description: 'Tasty',
    price: 12.99,
    image: 'http://img.com/pizza.jpg',
    category: 'pizza',
  });
});

describe('POST /api/orders', () => {
  it('should create an order with valid data', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ menuItem: testMenuItem._id.toString(), quantity: 2 }],
      customer: { name: 'John Doe', address: '123 Main St', phone: '1234567890' },
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Order Received');
    expect(res.body.data.totalAmount).toBeCloseTo(25.98);
    expect(res.body.data.items).toHaveLength(1);
  });

  it('should return 400 if items array is empty', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [],
      customer: { name: 'John', address: '123 St', phone: '1234567890' },
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if customer name is missing', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ menuItem: testMenuItem._id.toString(), quantity: 1 }],
      customer: { name: '', address: '123 St', phone: '1234567890' },
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 if phone is invalid', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ menuItem: testMenuItem._id.toString(), quantity: 1 }],
      customer: { name: 'John', address: '123 St', phone: '123' },
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 if menu item does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).post('/api/orders').send({
      items: [{ menuItem: fakeId.toString(), quantity: 1 }],
      customer: { name: 'John', address: '123 St', phone: '1234567890' },
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('not found');
  });
});

describe('GET /api/orders/:id', () => {
  it('should return order by id', async () => {
    const order = await Order.create({
      items: [{ menuItem: testMenuItem._id, name: 'Test Pizza', quantity: 1, price: 12.99 }],
      customer: { name: 'John', address: '123 St', phone: '1234567890' },
      totalAmount: 12.99,
      status: 'Order Received',
    });

    const res = await request(app).get(`/api/orders/${order._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Order Received');
  });

  it('should return 404 for non-existent order', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/orders/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/orders/:id/status', () => {
  it('should update order status', async () => {
    const order = await Order.create({
      items: [{ menuItem: testMenuItem._id, name: 'Test Pizza', quantity: 1, price: 12.99 }],
      customer: { name: 'John', address: '123 St', phone: '1234567890' },
      totalAmount: 12.99,
      status: 'Order Received',
    });

    const res = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .send({ status: 'Preparing' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Preparing');
  });

  it('should return 400 for invalid status', async () => {
    const order = await Order.create({
      items: [{ menuItem: testMenuItem._id, name: 'Test Pizza', quantity: 1, price: 12.99 }],
      customer: { name: 'John', address: '123 St', phone: '1234567890' },
      totalAmount: 12.99,
      status: 'Order Received',
    });

    const res = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .send({ status: 'Invalid Status' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/orders', () => {
  it('should return all orders', async () => {
    await Order.create({
      items: [{ menuItem: testMenuItem._id, name: 'Test Pizza', quantity: 1, price: 12.99 }],
      customer: { name: 'John', address: '123 St', phone: '1234567890' },
      totalAmount: 12.99,
    });

    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});
