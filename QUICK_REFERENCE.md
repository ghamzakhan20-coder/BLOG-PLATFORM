# Quick Reference: Login/Signup Implementation

## 🚀 Quick Start

### Frontend is Ready ✅
```bash
cd frontend
npm run dev
# Visit http://localhost:3000/login
```

### Backend Needs Setup
```bash
cd backend
npm install
# Create .env file with settings (see BACKEND_API_SETUP.md)
npm run dev
# Should run on http://localhost:5000
```

---

## 📋 Frontend Login Page Features

### File: `app/login/page.js`

**Built-in Features:**
- ✅ Email/Password login
- ✅ Email/Password registration
- ✅ Google OAuth button
- ✅ Toggle between login/signup
- ✅ Real-time validation
- ✅ Error messages
- ✅ Loading spinner
- ✅ Auto-redirect if authenticated

**Uses AuthContext:**
```javascript
const { login, register, error, isLoading } = useAuth();

// Login
const result = await login(email, password);

// Register
const result = await register(name, email, password);
```

---

## 🔌 Backend API Endpoints

### POST /api/auth/register
```javascript
Request: { name, email, password }
Response: { success, token, user }
```

### POST /api/auth/login
```javascript
Request: { email, password }
Response: { success, token, user }
```

### GET /api/auth/google
```javascript
// Redirects to Google OAuth
```

### GET /api/auth/callback
```javascript
// Google OAuth callback
```

---

## 🗝️ Token Management

### Automatically Handled by AuthContext

**Storage:**
```javascript
localStorage.token = "eyJhbGciOiJIUzI1NiIs..."
localStorage.user = { _id, name, email, role }
```

**API Calls:**
```javascript
// All requests include: Authorization: Bearer {token}
const { get, post } = useAuthApi();
await get('/api/blogs'); // Token auto-added!
```

---

## 🔒 Protected Routes

### Wrap Pages with ProtectedRoute

```javascript
import { ProtectedRoute } from '@/app/context/ProtectedRoute';

export default function BlogsPage() {
  return (
    <ProtectedRoute>
      {/* Your content */}
    </ProtectedRoute>
  );
}
```

### Or Use useAuth Hook

```javascript
const { isAuthenticated } = useAuth();

useEffect(() => {
  if (!isAuthenticated) router.push('/login');
}, [isAuthenticated]);
```

---

## 🔐 Admin-Only Routes

```javascript
<ProtectedRoute requireAdmin={true}>
  {/* Admin content */}
</ProtectedRoute>
```

---

## 📱 User Information

### Access in Any Component

```javascript
const { user, isAdmin, logout } = useAuth();

return (
  <div>
    <p>Welcome, {user?.name}</p>
    {isAdmin && <p>You are admin</p>}
    <button onClick={logout}>Logout</button>
  </div>
);
```

---

## 🌐 Google OAuth Setup

### Required on Backend:

1. Get OAuth credentials from Google Cloud Console
2. Add to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_secret
   ```
3. Configure redirect URI: `http://localhost:5000/api/auth/callback`
4. Implement OAuth endpoint in backend

---

## ⚡ Essential Files

### Frontend
- `app/login/page.js` - Login/signup UI
- `app/context/AuthContext.jsx` - Auth state
- `app/context/useAuthApi.js` - API calls
- `app/context/ProtectedRoute.jsx` - Route protection
- `.env.local` - API URL

### Backend (to create)
- `src/controllers/authController.js` - Auth logic
- `src/routes/authRoutes.js` - API endpoints
- `src/models/User.js` - User schema
- `src/config/passport.js` - Passport setup
- `.env` - Environment vars

---

## 🧪 Testing Endpoints

### With cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Protected route (use token from login)
curl -X GET http://localhost:5000/api/blogs \
  -H "Authorization: Bearer <token>"
```

---

## ✨ Form Validation

### Client-side (Frontend)
- Name required for signup
- Email format validation
- Password min 6 characters
- Confirm password matching

### Server-side (Backend)
- Email uniqueness
- Password hash with bcrypt
- User data validation

---

## 🎯 Implementation Steps

### 1. Test Frontend Login Page
```bash
cd frontend
npm run dev
# Visit http://localhost:3000/login
```

### 2. Create Backend User Model
See `BACKEND_API_SETUP.md` > User Model section

### 3. Create Auth Controller
See `BACKEND_API_SETUP.md` > Auth Controller section

### 4. Setup Routes
See `BACKEND_API_SETUP.md` > Auth Routes section

### 5. Test with Backend Running
```bash
cd backend
npm run dev
# Then test login in frontend
```

### 6. Protect Blog Pages
```javascript
<ProtectedRoute>
  <BlogContent />
</ProtectedRoute>
```

### 7. Refactor Blog API Calls
```javascript
const { get, post } = useAuthApi();
await get('/api/blogs');
```

---

## 📚 Full Documentation

- **Frontend:** [LOGIN_SIGNUP_GUIDE.md](frontend/LOGIN_SIGNUP_GUIDE.md)
- **Backend:** [BACKEND_API_SETUP.md](backend/BACKEND_API_SETUP.md)
- **Integration:** [AUTHENTICATION_INTEGRATION_GUIDE.md](AUTHENTICATION_INTEGRATION_GUIDE.md)
- **Auth Context:** [AUTHENTICATION_CONTEXT_GUIDE.md](frontend/AUTHENTICATION_CONTEXT_GUIDE.md)

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Start backend: `npm run dev` in /backend |
| "CORS error" | Add CORS middleware in backend |
| "Invalid token" | Use `useAuthApi` instead of fetch |
| "Lost auth after refresh" | Verify localStorage persistence |
| "Google OAuth failing" | Check Client ID and redirect URI |

---

## 💡 Key Concepts

### AuthContext
Global state management for authentication

### useAuth Hook
Access auth state in any component
```javascript
const { user, token, login, logout } = useAuth();
```

### useAuthApi Hook
Make authenticated API calls
```javascript
const { get, post } = useAuthApi();
const result = await get('/api/blogs');
```

### ProtectedRoute
Wrapper component for route protection
```javascript
<ProtectedRoute requireAdmin={false}>
  Content here
</ProtectedRoute>
```

### localStorage
Persists token and user between sessions

---

## 📊 Flow Diagram

```
User visits /login
  ↓
Chooses: Register or Login
  ↓
Enters credentials
  ↓
AuthContext.login() or .register()
  ↓
POST to backend /api/auth/{login|register}
  ↓
Backend validates & returns token
  ↓
AuthContext stores token & user
  ↓
Redirects to /blogs
  ↓
useAuthApi adds token to all requests
  ↓
Authenticated!
```

---

**Version:** 1.0
**Last Updated:** January 29, 2026
**Status:** Ready to Use ✅
