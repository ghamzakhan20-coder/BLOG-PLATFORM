# Backend API Setup Guide

## Overview

Complete backend setup for authentication endpoints and Google OAuth integration.

---

## Prerequisites

- Node.js and npm installed
- MongoDB database
- Google OAuth credentials (optional for Google login)

---

## Required Dependencies

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken passport passport-google-oauth20 passport-jwt cookie-parser session
```

**Key Packages:**
- `express` - Web server
- `mongoose` - MongoDB ORM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables

---

## Environment Variables

Create `.env` in backend folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blog-platform
DB_NAME=blog_platform

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

### 1. Email/Password Authentication

#### POST /api/auth/login

Login with email and password

**Request:**
```javascript
{
  email: "user@example.com",
  password: "password123"
}
```

**Response (Success - 200):**
```javascript
{
  success: true,
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    createdAt: "2024-01-29T10:00:00Z"
  }
}
```

**Response (Error - 401):**
```javascript
{
  success: false,
  message: "Invalid email or password"
}
```

---

#### POST /api/auth/register

Register new user

**Request:**
```javascript
{
  name: "John Doe",
  email: "user@example.com",
  password: "password123"
}
```

**Response (Success - 201):**
```javascript
{
  success: true,
  message: "User registered successfully",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    createdAt: "2024-01-29T10:00:00Z"
  }
}
```

**Response (Error - 400):**
```javascript
{
  success: false,
  message: "Email already exists"
}
```

---

#### POST /api/auth/logout

Logout user (optional, mainly for cleanup)

**Response:**
```javascript
{
  success: true,
  message: "Logged out successfully"
}
```

---

### 2. Google OAuth

#### GET /api/auth/google

Initiates Google OAuth login flow

**Redirects to:** Google OAuth consent screen

**Flow:**
1. User clicks "Sign in with Google"
2. Redirected to Google login
3. User authorizes app
4. Google redirects to `/api/auth/callback`

---

#### GET /api/auth/callback

Google OAuth callback endpoint

**URL:** `http://localhost:5000/api/auth/callback?code=...`

**Response (Success):**
- Creates/finds user in database
- Generates JWT token
- Redirects to frontend: `http://localhost:3000/login?token=...&user=...`
- OR responds with token in response body

**Response (Error):**
- Redirects with error: `http://localhost:3000/login?error=...`

---

## Implementation Examples

### 1. User Model

**File: `src/models/User.js`**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    googleId: String,
    avatar: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### 2. Authentication Controller

**File: `src/controllers/authController.js`**

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

// Google OAuth Callback (simplified)
exports.googleCallback = async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.user;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    // Redirect with token to frontend
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&user=${JSON.stringify(user)}`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
  }
};

// Logout
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
```

---

### 3. Authentication Routes

**File: `src/routes/authRoutes.js`**

```javascript
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Email/Password Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);

module.exports = router;
```

---

### 4. Passport Configuration

**File: `src/config/passport.js`**

```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

// JWT Strategy (for protecting routes)
passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
```

---

### 5. Middleware for Protected Routes

**File: `src/middleware/authMiddleware.js`**

```javascript
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Protect routes - verify JWT token
exports.protect = passport.authenticate('jwt', { session: false });

// Verify JWT token from header
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Admin only
exports.adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
```

---

### 6. App Setup

**File: `src/app.js` or `src/server.js`**

```javascript
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Session Configuration (for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// Passport Configuration
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// ... other routes

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

module.exports = app;
```

---

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

```bash
# Create .env
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_secret_key_change_in_production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### 3. Create Database

```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 4. Test Endpoints

```bash
# Start server
npm run dev

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Test register endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

---

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable "Google+ API"
4. Create "OAuth 2.0 Client ID" credentials
5. Set authorized redirect URI: `http://localhost:5000/api/auth/callback`
6. Copy Client ID and Secret

### 2. Configure Backend

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret_here
```

### 3. Test Google Login

1. Visit frontend login page
2. Click "Sign in with Google"
3. Authorize app
4. Should redirect back with token

---

## CORS Configuration

For frontend at `http://localhost:3000`:

```javascript
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

---

## Security Best Practices

✅ **Token Management:**
- Use secure JWT_SECRET (strong, random)
- Set token expiration (7d recommended)
- Refresh token implementation (optional)

✅ **Password Security:**
- Hash with bcrypt (10+ salt rounds)
- Min 6 characters (enforce stronger in production)
- Never log passwords

✅ **CORS:**
- Whitelist frontend domain
- Allow credentials for cookies
- Specify allowed methods

✅ **HTTPS:**
- Use HTTPS in production
- Set secure flag on cookies
- Don't log sensitive data

✅ **Environment Variables:**
- Never commit `.env` to git
- Use strong secrets
- Rotate secrets periodically

---

## Testing Endpoints with Postman

### Login Request
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Route Request
```
GET http://localhost:5000/api/blogs
Authorization: Bearer <token_from_login>
```

---

**Last Updated:** January 29, 2026
**Status:** ✅ Ready to Implement
