require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const createAdmin = async () => {
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created!');
  } else {
    console.log('Admin already exists.');
  }
  process.exit();
};

createAdmin();
