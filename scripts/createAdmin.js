require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path if your models folder is different

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123', // Will be hashed automatically
        role: 'admin'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('Admin account ready!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

createAdmin();