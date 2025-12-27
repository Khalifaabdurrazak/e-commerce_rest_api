require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOneAndUpdate(
    { email: 'admin@example.com' },
    { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('Admin user ready:', admin.email, 'Role:', admin.role);
  process.exit();
};

createAdmin();