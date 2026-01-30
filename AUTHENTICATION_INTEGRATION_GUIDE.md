# Complete Authentication Flow & Integration Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        app/login/page.js (Login/Signup UI)          │   │
│  │  - Email/Password Form                              │   │
│  │  - Google OAuth Button                              │   │
│  │  - Toggle Login/Signup Mode                         │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   AuthContext (app/context/AuthContext.jsx)         │   │
│  │  - Manages Auth State (user, token, etc)            │   │
│  │  - login() function                                 │   │
│  │  - register() function                              │   │
│  │  - logout() function                                │   │
│  │  - localStorage integration                         │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│    ┌────────────────┼────────────────┐                       │
│    ▼                ▼                ▼                       │
│  Email/Pass    Google Auth      API Calls                   │
│  to Backend    to Backend       (useAuthApi)                │
│                                                               │
└────────────────────────────────────────────────────────────┬─┘
                                                              │
                    HTTP/REST API                           │
                    (CORS enabled)                          │
                                                              │
┌─────────────────────────────────────────────────────────────▼─┐
│                    Backend (Node.js/Express)                  │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          authRoutes.js (API Endpoints)                 │ │
│  │  - POST /api/auth/login                                │ │
│  │  - POST /api/auth/register                             │ │
│  │  - GET /api/auth/google (OAuth initiation)             │ │
│  │  - GET /api/auth/callback (OAuth callback)             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                     │                                        │
│                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │       authController.js (Business Logic)               │ │
│  │  - Validate credentials                                │ │
│  │  - Hash passwords with bcrypt                          │ │
│  │  - Generate JWT tokens                                 │ │
│  │  - Handle Google OAuth flow                            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                     │                                        │
│                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          User Model (MongoDB)                          │ │
│  │  - name, email, password, googleId, role              │ │
│  │  - Password hashing middleware                         │ │
│  │  - Password comparison method                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flows

### Flow 1: Email/Password Registration

```
User
  │
  ├─► Visit http://localhost:3000/login
  │
  ├─► Click "Sign Up"
  │
  ├─► Enter: Name, Email, Password, Confirm Password
  │
  ├─► Click "Create Account"
  │
  ├─► Browser: handleSubmit() → register(name, email, password)
  │
  ├─► AuthContext: Calls POST /api/auth/register
  │
  ├─► Backend: authController.register()
  │   ├─► Validate input
  │   ├─► Check if email exists
  │   ├─► Hash password with bcrypt
  │   ├─► Create user in MongoDB
  │   ├─► Generate JWT token
  │   └─► Return { token, user, success: true }
  │
  ├─► Frontend: AuthContext stores token & user in localStorage
  │
  ├─► Frontend: Redirects to /blogs
  │
  └─► Authenticated!
```

### Flow 2: Email/Password Login

```
User
  │
  ├─► Visit http://localhost:3000/login
  │
  ├─► Enter: Email, Password
  │
  ├─► Click "Sign In"
  │
  ├─► Browser: handleSubmit() → login(email, password)
  │
  ├─► AuthContext: Calls POST /api/auth/login
  │
  ├─► Backend: authController.login()
  │   ├─► Validate input
  │   ├─► Find user by email
  │   ├─► Compare password with bcrypt
  │   ├─► Generate JWT token
  │   └─► Return { token, user, success: true }
  │
  ├─► Frontend: AuthContext stores token & user in localStorage
  │
  ├─► Frontend: Redirects to /blogs
  │
  └─► Authenticated!
```

### Flow 3: Google OAuth Login

```
User
  │
  ├─► Visit http://localhost:3000/login
  │
  ├─► Click "Sign in with Google"
  │
  ├─► Browser: handleGoogleLogin() → window.location.href = "backend/google"
  │
  ├─► Backend: GET /api/auth/google
  │   └─► Passport redirects to Google OAuth consent screen
  │
  ├─► User: Logs in with Google account & authorizes app
  │
  ├─► Backend: GET /api/auth/callback?code=...
  │   ├─► Passport validates code with Google
  │   ├─► Extracts: googleId, email, name, avatar
  │   ├─► Find/Create user in MongoDB
  │   ├─► Generate JWT token
  │   └─► Redirect to frontend with token in URL
  │
  ├─► Frontend: Extracts token from URL
  │
  ├─► Frontend: AuthContext stores token & user
  │
  ├─► Frontend: Redirects to /blogs
  │
  └─► Authenticated with Google!
```

---

## Token Flow

### On Page Load

```javascript
User Refreshes Page
        │
        ▼
NextJS loads app
        │
        ▼
AuthProvider mounts
        │
        ▼
useEffect checks localStorage
        │
    ┌───┴───┐
    ▼       ▼
Token?   No token
  │         │
  ▼         ▼
Set auth   Stay on
state      login page
  │
  ▼
Restore user data
  │
  ▼
isAuthenticated = true
  │
  ▼
Can access /blogs
```

### During API Calls

```javascript
useAuthApi().get('/api/blogs')
        │
        ▼
useAuth() gets token from context
        │
        ▼
Fetch request with headers:
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
        │
        ▼
Backend: authMiddleware.verifyToken()
        │
    ┌───┴───┐
    ▼       ▼
Valid    Invalid
  │         │
  ▼         ▼
Process  Return 401
request
  │
  ▼
Send response
```

### On Logout

```javascript
user clicks logout
        │
        ▼
logout() from useAuth()
        │
        ▼
localStorage.removeItem('token')
localStorage.removeItem('user')
        │
        ▼
Reset auth context state
        │
        ▼
Redirect to /login
        │
        ▼
isAuthenticated = false
  │
  ▼
Unauthenticated!
```

---

## Integration Checklist

### ✅ Frontend Setup

- [x] AuthContext created (app/context/AuthContext.jsx)
- [x] ProtectedRoute component created
- [x] useAuthApi hook created
- [x] Login/Signup page created (app/login/page.js)
- [x] layout.tsx updated with AuthProvider
- [x] .env.local configured with API_URL

### ✅ Backend Setup (Required)

- [ ] User model created with password hashing
- [ ] Auth controller with login/register logic
- [ ] Auth routes setup
- [ ] Passport configuration
- [ ] JWT token generation
- [ ] Password validation and hashing
- [ ] Error handling middleware
- [ ] CORS configuration

### ✅ Google OAuth Setup (Optional)

- [ ] Google Cloud project created
- [ ] OAuth credentials obtained
- [ ] Google strategy configured in Passport
- [ ] OAuth routes implemented
- [ ] Callback handling setup

### ✅ Protected Pages

- [ ] /blogs page wrapped with ProtectedRoute
- [ ] /blogs/[id] page wrapped with ProtectedRoute
- [ ] /admin/create page wrapped with ProtectedRoute (requireAdmin)
- [ ] /admin/edit/[id] page wrapped with ProtectedRoute (requireAdmin)
- [ ] All pages using useAuthApi for API calls

### ✅ Testing

- [ ] Register new user via email/password
- [ ] Login with registered email/password
- [ ] Token persists after page refresh
- [ ] Logout clears token
- [ ] Cannot access /blogs without token
- [ ] Cannot access /admin without admin role
- [ ] Google login works (if OAuth setup)
- [ ] Error messages display correctly

---

## Request/Response Examples

### Register Request

```javascript
// Frontend sends
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Backend responds
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-29T10:00:00Z"
  }
}
```

### Login Request

```javascript
// Frontend sends
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

// Backend responds
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-29T10:00:00Z"
  }
}
```

### Authenticated API Request

```javascript
// Frontend sends
GET http://localhost:5000/api/blogs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Backend: authMiddleware validates token
// Then blogController.getBlogs executes
// Backend responds
{
  "success": true,
  "blogs": [
    { "_id": "...", "title": "Blog 1", ... },
    { "_id": "...", "title": "Blog 2", ... }
  ]
}
```

---

## Key Files & Locations

### Frontend Files

```
frontend/
├── app/
│   ├── login/
│   │   └── page.js              # Login/Signup UI
│   ├── context/
│   │   ├── AuthContext.jsx      # Auth state management
│   │   ├── ProtectedRoute.jsx   # Route protection
│   │   └── useAuthApi.js        # Authenticated API calls
│   ├── layout.tsx               # Root provider
│   └── blogs/
│       ├── page.js              # Blog listing (protected)
│       └── [id]/
│           └── page.js          # Blog detail (protected)
├── .env.local                   # API configuration
└── LOGIN_SIGNUP_GUIDE.md        # Frontend guide
```

### Backend Files (To Create)

```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js    # Auth logic
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoints
│   ├── models/
│   │   └── User.js              # User schema
│   ├── middleware/
│   │   └── authMiddleware.js    # Token verification
│   ├── config/
│   │   └── passport.js          # Passport setup
│   ├── app.js                   # Express app
│   └── server.js                # Server startup
├── .env                         # Environment vars
├── package.json
└── BACKEND_API_SETUP.md         # Backend guide
```

---

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blog-platform

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## Common Issues & Solutions

### Issue: "Failed to fetch"

**Problem:** API server not running

**Solution:**
```bash
cd backend
npm run dev
# Should see "Server running on port 5000"
```

### Issue: "CORS error"

**Problem:** Backend not configured for frontend origin

**Solution in backend app.js:**
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: "Invalid token" on API calls

**Problem:** Token not being sent or expired

**Solution:**
```javascript
// Use useAuthApi instead of fetch
const { get } = useAuthApi();
const result = await get('/api/blogs');
// Token automatically included!
```

### Issue: User loses auth after refresh

**Problem:** AuthContext not initializing from localStorage

**Solution:** Verify useEffect in AuthContext.jsx runs on mount:
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    setToken(token);
    // ... restore user
  }
}, []);
```

### Issue: Google OAuth not working

**Problem:** Client ID/Secret not set or incorrect callback URL

**Solution:**
1. Get correct Client ID from Google Cloud
2. Add to backend .env
3. Set callback URL in Google console to exactly match backend:
   - `http://localhost:5000/api/auth/callback`
4. Set FRONTEND_URL in backend .env to:
   - `http://localhost:3000`

---

## Production Considerations

### Security

- [ ] Use HTTPS instead of HTTP
- [ ] Set secure JWT_SECRET (strong, random)
- [ ] Use environment variables for all secrets
- [ ] Set secure cookies with httpOnly flag
- [ ] Implement token refresh (optional)
- [ ] Add rate limiting on auth endpoints
- [ ] Add CAPTCHA to prevent brute force

### Performance

- [ ] Cache auth state in context
- [ ] Use memoization (useCallback) in context
- [ ] Implement request caching with SWR
- [ ] Add request debouncing
- [ ] Compress API responses

### Monitoring

- [ ] Log authentication errors
- [ ] Monitor failed login attempts
- [ ] Track token usage
- [ ] Alert on security issues
- [ ] Monitor API response times

### Scaling

- [ ] Use Redis for session management
- [ ] Implement token blacklist on logout
- [ ] Use load balancer for backend
- [ ] Scale MongoDB for production
- [ ] Implement CI/CD pipeline

---

## Testing Commands

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Use Token to Access Protected Route

```bash
curl -X GET http://localhost:5000/api/blogs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Next Steps

1. **Implement Backend Authentication**
   - Create User model
   - Create auth controller
   - Set up routes and middleware
   - Test with Postman

2. **Test Login Flow**
   - Start backend and frontend
   - Test register and login
   - Verify token storage
   - Test page refresh

3. **Protect Blog Pages**
   - Wrap with ProtectedRoute
   - Replace fetch with useAuthApi
   - Test unauthorized access

4. **Setup Google OAuth (Optional)**
   - Create Google Cloud project
   - Get credentials
   - Configure backend
   - Test OAuth flow

5. **Production Deployment**
   - Update API URLs
   - Enable HTTPS
   - Set environment variables
   - Test end-to-end

---

**Last Updated:** January 29, 2026
**Version:** 1.0
**Status:** ✅ Ready for Implementation
