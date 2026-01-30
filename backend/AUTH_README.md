# Blog Platform - Authentication System

## Features

✅ **Email & Password Authentication**
- User registration with email and password
- Password hashing using bcryptjs
- Login with JWT token generation

✅ **Google OAuth 2.0**
- Sign in with Google
- Automatic user account creation
- Profile image integration

✅ **User Roles**
- Two role types: `user` and `admin`
- Role-based access control middleware
- Role assignment at registration (defaults to `user`)

✅ **JWT Token Management**
- Secure token generation
- Token expiration (configurable, default 7 days)
- Bearer token authentication

✅ **MongoDB User Schema**
- Email (unique, validated, lowercase)
- Password (hashed, not returned by default)
- Google ID (for OAuth)
- User profile (name, image)
- Role management
- Timestamps (createdAt, updatedAt)

## Installation

1. **Install required dependencies:**

```bash
cd backend
npm install
```

The following packages are already in package.json:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `passport-local` - Local strategy (install if missing)
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables
- `express` - Web framework
- `cors` - Cross-origin resource sharing

2. **Install passport-local if not already installed:**

```bash
npm install passport-local
```

## Environment Setup

1. **Copy .env.example to .env:**

```bash
cp .env.example .env
```

2. **Configure environment variables:**

```env
MONGO_URI=mongodb://localhost:27017/blog-platform
PORT=5000
NODE_ENV=development

# Generate a secure JWT secret (min 32 characters)
JWT_SECRET=your-very-secure-secret-key-at-least-32-characters
JWT_EXPIRE=7d

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## API Endpoints

### Authentication Routes

#### 1. **Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### 2. **Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### 3. **Google OAuth Sign In**
```
GET /api/auth/google
```

Redirects to Google login page. After authentication, returns JWT token and user data.

#### 4. **Get Current User** (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "profileImage": "url"
  }
}
```

#### 5. **Logout** (Protected)
```
POST /api/auth/logout
Authorization: Bearer <token>
```

## Usage Examples

### Using Authentication in Routes

**1. Protected route (user must be logged in):**

```javascript
const { auth } = require('./middleware/authMiddleware');
const router = express.Router();

router.get('/profile', auth, (req, res) => {
  // req.user contains the authenticated user
  res.json(req.user);
});
```

**2. Admin-only route:**

```javascript
const { auth, authorize } = require('./middleware/authMiddleware');
const router = express.Router();

router.delete('/users/:id', auth, authorize('admin'), (req, res) => {
  // Only admins can access this
  res.json({ message: 'User deleted' });
});
```

**3. Multiple roles:**

```javascript
router.put('/posts/:id', auth, authorize('admin', 'moderator'), (req, res) => {
  // Both admin and moderator can access
  res.json({ message: 'Post updated' });
});
```

## Frontend Integration

### 1. Store JWT Token
```javascript
// After registration/login
localStorage.setItem('token', response.token);
```

### 2. Use Token in API Requests
```javascript
// In fetch headers
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

### 3. Google OAuth Button
```html
<a href="http://localhost:5000/api/auth/google">
  Sign in with Google
</a>
```

## File Structure

```
backend/src/
├── models/
│   └── User.js              # MongoDB User schema with bcrypt
├── controllers/
│   └── authController.js    # Auth logic (register, login, OAuth)
├── routes/
│   └── authRoutes.js        # Auth endpoints
├── middleware/
│   └── authMiddleware.js    # JWT verification & role authorization
├── config/
│   ├── db.js                # MongoDB connection
│   └── passport.js          # Passport strategies (Local + Google OAuth)
├── app.js                   # Express app setup
└── server.js                # Server entry point
```

## Key Features Explained

### 1. Password Hashing
- Passwords are automatically hashed before saving using bcryptjs
- Comparison done safely with `bcrypt.compare()`
- Password field excluded from queries by default (`select: false`)

### 2. JWT Token
- Generated on successful login/registration
- Contains user ID payload
- Expires after 7 days (configurable)
- Verified on protected routes using Bearer token

### 3. Google OAuth
- Uses passport-google-oauth20 strategy
- Creates new user or links to existing email
- Automatically fetches user profile image

### 4. User Roles
- Default role: `user`
- Available roles: `user`, `admin`
- Enforced via `authorize()` middleware

### 5. MongoDB Schema
```javascript
{
  email: String (unique, validated),
  password: String (hashed, not returned),
  googleId: String (unique, optional),
  name: String (required),
  profileImage: String (optional),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  timestamps: true (createdAt, updatedAt)
}
```

## Testing

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Considerations

✅ **Implemented:**
- Password hashing with salt
- JWT for stateless authentication
- Email validation
- Role-based authorization
- Password field excluded from queries

**Recommendations:**
- Use HTTPS in production
- Store JWT_SECRET in secure environment
- Implement rate limiting on auth endpoints
- Add email verification for registration
- Implement password reset functionality
- Use secure cookies for tokens (if using sessions)
- Add CSRF protection

## Troubleshooting

### "User not found" on login
- Check if user exists in MongoDB
- Verify email is correct (case-insensitive)

### "Invalid token" errors
- Ensure token starts with "Bearer "
- Check token hasn't expired
- Verify JWT_SECRET matches in .env

### Google OAuth not working
- Get credentials from Google Cloud Console
- Ensure callback URL matches in both Google Console and .env
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

### bcrypt errors
- Ensure bcryptjs is installed: `npm install bcryptjs`
- Clear node_modules and reinstall if needed

## Next Steps

1. Add email verification
2. Implement password reset
3. Add refresh tokens
4. Implement 2FA (Two-Factor Authentication)
5. Add user profile update endpoint
6. Add logout blacklist (token revocation)
7. Implement rate limiting
8. Add API documentation with Swagger/OpenAPI
