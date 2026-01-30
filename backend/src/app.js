require("dotenv").config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog Platform API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

module.exports = app;
