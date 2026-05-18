const connectDB = require('../config/db');

const ensureDb = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = ensureDb;
