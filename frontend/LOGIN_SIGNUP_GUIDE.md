# Login/Signup Implementation Guide

## Overview

A complete login and signup page with email/password authentication and Google OAuth integration.

---

## Features

✅ **Email & Password Authentication**
- Login for existing users
- Registration for new users
- Password validation (min 6 characters)
- Confirm password matching
- Name required for signup

✅ **Google OAuth Integration**
- One-click Google sign-in button
- Backend OAuth flow handling
- Automatic token storage

✅ **AuthContext Integration**
- Uses centralized AuthContext for auth state
- Automatic token management
- Error handling through context
- Loading state management

✅ **User Experience**
- Toggle between login and signup modes
- Real-time error messages
- Loading spinner during processing
- Auto-redirect when authenticated
- Responsive design with Tailwind CSS

---

## File Structure

```
app/
├── login/
│   └── page.js                 # Main login/signup page
├── context/
│   ├── AuthContext.jsx         # Auth provider & hook
│   ├── ProtectedRoute.jsx       # Route protection
│   └── useAuthApi.js           # Authenticated API calls
└── layout.tsx                  # Root layout with provider
```

---

## Configuration

### 1. Backend API URL

Set in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Google OAuth Setup (Backend Required)

The Google OAuth button redirects to:
```
http://localhost:5000/api/auth/google
```

**Backend Setup Required:**
1. Get Google Client ID and Secret from Google Cloud Console
2. Set OAuth redirect URI: `http://localhost:5000/api/auth/callback`
3. Implement Google OAuth endpoint in backend
4. Return JWT token on successful authentication

---

## How It Works

### 1. Email/Password Flow

**Login:**
```javascript
const { login } = useAuth();
const result = await login(email, password);
// Backend validates credentials and returns JWT token
```

**Signup:**
```javascript
const { register } = useAuth();
const result = await register(name, email, password);
// Backend creates user and returns JWT token
```

### 2. Google OAuth Flow

**User clicks "Sign in with Google":**
1. Redirected to `http://localhost:5000/api/auth/google`
2. Backend initiates Google OAuth flow
3. User logs in with Google account
4. Backend creates/finds user and generates JWT token
5. Backend redirects to frontend with token in URL or session
6. Frontend stores token and redirects to `/blogs`

### 3. Token Management

**Automatic Storage:**
```javascript
// AuthContext automatically stores in localStorage
localStorage.token   // JWT token
localStorage.user    // User object
```

**Auto-Restoration on Page Load:**
```javascript
// AuthContext initializes from localStorage on mount
useEffect(() => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    setToken(storedToken);
    setIsAuthenticated(true);
  }
}, []);
```

---

## Backend API Endpoints

### Email/Password Authentication

**POST /api/auth/login**
```javascript
Request:
{
  email: "user@example.com",
  password: "password123"
}

Response (Success):
{
  success: true,
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    _id: "user_id",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    createdAt: "2024-01-29T10:00:00Z"
  }
}

Response (Error):
{
  success: false,
  message: "Invalid email or password"
}
```

**POST /api/auth/register**
```javascript
Request:
{
  name: "John Doe",
  email: "user@example.com",
  password: "password123"
}

Response (Success):
{
  success: true,
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    _id: "user_id",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    createdAt: "2024-01-29T10:00:00Z"
  }
}

Response (Error):
{
  success: false,
  message: "Email already exists"
}
```

### Google OAuth

**GET /api/auth/google**
- Redirects to Google OAuth login page
- Backend parameter: `redirect_uri` (optional)

**GET /api/auth/callback**
- Called by Google after user authorization
- Backend validates code and creates session
- Redirects to frontend with token

---

## API Integration Examples

### Making Authenticated API Calls

All API calls made through `useAuthApi` automatically include the Bearer token:

```jsx
'use client';

import { useAuthApi } from '@/app/context/useAuthApi';

export default function MyComponent() {
  const { get, post, isLoading, error } = useAuthApi();

  const fetchData = async () => {
    const result = await get('/api/blogs?page=1');
    if (result.success) {
      console.log(result.data);
    }
  };

  const createBlog = async () => {
    const result = await post('/api/blogs', {
      title: 'My Blog',
      content: 'Content here'
    });
    if (result.success) {
      console.log('Blog created:', result.data);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>Load</button>
      <button onClick={createBlog} disabled={isLoading}>Create</button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

---

## Error Handling

### Error Sources

1. **Validation Errors** (Client-side):
   - Empty name/email/password
   - Password too short
   - Passwords don't match

2. **Authentication Errors** (Backend):
   - Invalid credentials
   - Email already exists
   - Server errors

### Error Display

```jsx
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    console.error('Auth error:', error);
  }
}, [error]);

// Clear on input change
const handleChange = (e) => {
  clearError();
  // ... update form
};
```

---

## Implementation Details

### Authentication State Management

The AuthContext provides:

```javascript
{
  // State
  user: { name, email, _id, role, ... },
  token: string,
  isAuthenticated: boolean,
  isAdmin: boolean,
  isLoading: boolean,
  error: string,

  // Methods
  login(email, password) => Promise<{ success, token, user, error }>
  register(name, email, password) => Promise<{ success, token, user, error }>
  logout() => void
  clearError() => void
}
```

### Form Validation

**Client-side validation:**
- Name required for signup
- Email format validation (HTML5)
- Password min 6 characters
- Confirm password matching

**Server-side validation:**
- Email uniqueness check
- Password strength requirements
- User data validation

### Loading States

```jsx
// While authenticating
{isLoading && <span>Processing...</span>}

// Show spinner in button
<button disabled={isLoading}>
  {isLoading ? '...' : 'Sign In'}
</button>
```

---

## Security Considerations

### Token Security

✅ **JWT Storage:**
- Stored in localStorage (accessible to JavaScript)
- Automatically included in API calls
- Cleared on logout

✅ **Token Validation:**
- Backend validates token on each request
- Token expiration (implement in backend)
- Secure token signing (use HS256 or RS256)

✅ **HTTPS in Production:**
- Always use HTTPS for OAuth redirects
- Secure cookies for sensitive data
- CORS properly configured

### Password Security

✅ **Frontend:**
- Min 6 character requirement
- Password input type (masked)
- No password display in console

✅ **Backend:**
- Hash passwords with bcrypt
- Salt rounds: 10+
- Never return plain passwords

### OAuth Security

✅ **Backend Implementation:**
- Validate Google ID token
- Verify OAuth state parameter
- Secure redirect URI validation
- Auto-create user on first login

---

## Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid email
- [ ] Login with wrong password
- [ ] Signup with new email
- [ ] Signup with existing email
- [ ] Password validation (too short)
- [ ] Confirm password mismatch
- [ ] Google OAuth redirect works
- [ ] Token persists after refresh
- [ ] Logout clears token
- [ ] Error messages display
- [ ] Redirect to /blogs on success
- [ ] Redirect to /blogs if already authenticated
- [ ] Toggle between login/signup modes

---

## Troubleshooting

### "Failed to fetch"
**Problem:** API server not running or wrong URL

**Solution:**
```bash
# Start backend
cd backend
npm run dev

# Check .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### "Email already exists"
**Problem:** Account already registered with this email

**Solution:** Use different email or login instead

### "Invalid token"
**Problem:** Token expired or corrupted

**Solution:** Clear localStorage and login again
```javascript
localStorage.clear();
// Redirect to login
```

### Google OAuth not working
**Problem:** Google credentials not set up

**Solution:**
1. Create OAuth app in Google Cloud Console
2. Set Client ID in backend
3. Configure redirect URI
4. Add CORS headers in backend

---

## Next Steps

1. **Test Locally:**
   - Run backend: `npm run dev` in backend folder
   - Run frontend: `npm run dev` in frontend folder
   - Visit http://localhost:3000/login

2. **Implement Google OAuth:**
   - Get Google Client ID
   - Create OAuth endpoint in backend
   - Test Google login flow

3. **Connect Blog Pages:**
   - Wrap pages with ProtectedRoute
   - Use useAuthApi for blog fetches
   - Display logged-in user info

4. **Production:**
   - Update API URL to production backend
   - Use HTTPS for OAuth
   - Add proper error logging
   - Test security measures

---

**Last Updated:** January 29, 2026
**Status:** ✅ Ready to Test
