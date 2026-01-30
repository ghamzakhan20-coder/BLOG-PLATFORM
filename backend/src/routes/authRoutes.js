const express = require('express');
const passport = require('passport');
const { register, login, googleCallback, getMe, logout } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

// Local authentication routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

// Protected routes
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;
