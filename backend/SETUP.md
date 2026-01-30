# Authentication System Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings:
# - MONGO_URI: your MongoDB connection string
# - JWT_SECRET: a long random string (min 32 chars)
# - GOOGLE_CLIENT_ID: from Google Cloud Console
# - GOOGLE_CLIENT_SECRET: from Google Cloud Console
```

### 3. Start the Server
```bash
npm run dev    # with nodemon (development)
npm start      # production
```

### 4. Test the API

#### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

#### Get current user (use token from login response):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## System Architecture

### User Model (`models/User.js`)
- Email (unique, validated)
- Password (hashed with bcrypt)
- Google ID (for OAuth)
- Name & Profile Image
- Role (user/admin)
- Timestamps

### Passport Configuration (`config/passport.js`)
- **Local Strategy**: Email/password authentication
- **Google Strategy**: OAuth2 authentication
- User serialization/deserialization

### Authentication Controller (`controllers/authController.js`)
- `register()`: Create new user account
- `login()`: Authenticate with email/password
- `googleCallback()`: Handle Google OAuth response
- `getMe()`: Get current user profile
- `logout()`: Logout user

### Auth Routes (`routes/authRoutes.js`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Auth Middleware (`middleware/authMiddleware.js`)
- `auth()`: Verify JWT token
- `authorize(...roles)`: Check user role

## Using Authentication in Your Routes

### Protect a route (require login):
```javascript
const { auth } = require('./middleware/authMiddleware');

router.get('/my-profile', auth, (req, res) => {
  // req.user is the authenticated user
  res.json(req.user);
});
```

### Admin-only routes:
```javascript
const { auth, authorize } = require('./middleware/authMiddleware');

router.delete('/admin/users/:id', auth, authorize('admin'), (req, res) => {
  // Only admins can access
  res.json({ message: 'User deleted' });
});
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## Environment Variables Reference

```env
# Database
MONGO_URI=mongodb://localhost:27017/blog-platform

# Server
PORT=5000
NODE_ENV=development

# JWT (generate a long random string)
JWT_SECRET=your-very-long-secret-key-min-32-chars
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## Files Created/Modified

✅ **Created:**
- `src/models/User.js` - MongoDB User schema
- `src/config/passport.js` - Passport strategies
- `src/controllers/authController.js` - Authentication logic
- `src/routes/authRoutes.js` - Auth endpoints
- `src/middleware/authMiddleware.js` - Auth verification
- `.env.example` - Environment variable template
- `AUTH_README.md` - Detailed documentation

✅ **Modified:**
- `src/app.js` - Added Passport & auth routes
- `package.json` - Added passport-local dependency

## Troubleshooting

**Error: "Cannot find module 'passport-local'"**
```bash
npm install passport-local
```

**MongoDB connection error**
- Ensure MongoDB is running
- Check MONGO_URI in .env file

**JWT errors**
- Ensure JWT_SECRET is set in .env
- Token must include "Bearer " prefix in header

**Google OAuth not working**
- Verify credentials in Google Cloud Console
- Check callback URL matches in both places
- Ensure HTTPS in production

## Next Steps

1. Add email verification
2. Implement password reset
3. Add refresh tokens
4. Set up database
5. Test all endpoints
6. Deploy to production

For detailed API documentation, see [AUTH_README.md](./AUTH_README.md)
