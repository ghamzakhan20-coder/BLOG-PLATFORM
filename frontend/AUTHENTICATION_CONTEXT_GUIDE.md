# Authentication Context Implementation Guide

## Overview

A complete authentication context using React Context API for JWT-based authentication with token storage, login/logout, and protected routes.

---

## Files Created

### 1. `app/context/AuthContext.jsx`
Main authentication context and provider

**Exports:**
- `AuthProvider` - Wraps your app
- `useAuth()` - Hook to access auth state and methods

### 2. `app/context/ProtectedRoute.jsx`
Protected route wrapper component

### 3. `app/context/useAuthApi.js`
Custom hook for authenticated API calls

### 4. Updated `app/layout.tsx`
Added AuthProvider wrapper

---

## Usage

### Step 1: Setup Provider in Root Layout

The `AuthProvider` is already added to `app/layout.tsx`:

```jsx
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 2: Use Auth Hook in Components

```jsx
'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Step 3: Handle Login

```jsx
const { login } = useAuth();

const handleLogin = async (email, password) => {
  const result = await login(email, password);
  
  if (result.success) {
    router.push('/blogs');
  } else {
    console.error(result.error);
  }
};
```

### Step 4: Handle Registration

```jsx
const { register } = useAuth();

const handleRegister = async (name, email, password) => {
  const result = await register(name, email, password);
  
  if (result.success) {
    router.push('/blogs');
  } else {
    console.error(result.error);
  }
};
```

### Step 5: Protect Routes

**Option A: Using ProtectedRoute Component**

```jsx
import { ProtectedRoute } from '@/app/context/ProtectedRoute';

export default function BlogsPage() {
  return (
    <ProtectedRoute>
      <BlogContent />
    </ProtectedRoute>
  );
}
```

**Option B: Using useAuth Hook in useEffect**

```jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/user');
    } else if (!isAdmin) {
      router.push('/blogs');
    }
  }, [isAuthenticated, isAdmin, router]);

  return <div>Admin Content</div>;
}
```

---

## API Reference

### useAuth() Hook

Returns an object with:

```javascript
{
  // State
  user: {              // Logged-in user object
    _id: string,
    name: string,
    email: string,
    role: 'user' | 'admin',
    createdAt: string,
  },
  token: string,       // JWT token
  isLoading: boolean,  // Loading state
  error: string,       // Error message (if any)
  isAuthenticated: boolean,  // True if logged in
  isAdmin: boolean,    // True if user role is 'admin'

  // Methods
  login: (email, password, isAdmin?) => Promise,     // Login user
  register: (name, email, password) => Promise,      // Register user
  logout: () => void,  // Logout and clear auth
  clearError: () => void,  // Clear error message
}
```

### login(email, password, isAdmin)

Login with email and password

**Parameters:**
- `email` (string) - User email
- `password` (string) - User password
- `isAdmin` (boolean, optional) - If true, verifies user is admin

**Returns:**
```javascript
{
  success: true | false,
  user: { /* user object */ },  // If successful
  error: string  // If failed
}
```

**Example:**
```jsx
const result = await login('user@example.com', 'password123');
```

### register(name, email, password)

Register new user

**Parameters:**
- `name` (string) - User full name
- `email` (string) - User email
- `password` (string) - User password

**Returns:**
```javascript
{
  success: true | false,
  user: { /* user object */ },  // If successful
  error: string  // If failed
}
```

**Example:**
```jsx
const result = await register('John Doe', 'john@example.com', 'password123');
```

### logout()

Logout current user and clear auth data

**Returns:**
```javascript
{
  success: true | false,
  error?: string
}
```

**Example:**
```jsx
logout();
```

### clearError()

Clear error message from context

**Example:**
```jsx
clearError();
```

---

## useAuthApi() Hook

Custom hook for making authenticated API calls

**Returns:**
```javascript
{
  isLoading: boolean,
  error: string | null,
  apiCall: (endpoint, options) => Promise,  // Generic method
  get: (endpoint) => Promise,                 // GET request
  post: (endpoint, body) => Promise,          // POST request
  put: (endpoint, body) => Promise,           // PUT request
  delete: (endpoint) => Promise,              // DELETE request
}
```

### Example Usage

```jsx
'use client';

import { useAuthApi } from '@/app/context/useAuthApi';

export default function BlogList() {
  const { get, isLoading, error } = useAuthApi();

  const fetchBlogs = async () => {
    const result = await get('/api/blogs?page=1&limit=6');
    
    if (result.success) {
      console.log(result.data.blogs);
    } else {
      console.error(result.error);
    }
  };

  return (
    <div>
      <button onClick={fetchBlogs} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Blogs'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### API Call Examples

```jsx
import { useAuthApi } from '@/app/context/useAuthApi';

export default function Example() {
  const { get, post, put, delete: del, isLoading } = useAuthApi();

  // GET request
  const blogs = await get('/api/blogs');

  // POST request
  const newBlog = await post('/api/blogs', {
    title: 'New Blog',
    content: 'Content here...',
  });

  // PUT request
  const updated = await put(`/api/blogs/${id}`, {
    title: 'Updated Title',
  });

  // DELETE request
  const deleted = await del(`/api/blogs/${id}`);
}
```

---

## Complete Integration Example

### Step 1: Create Page Component

**`app/my-page/page.js`**
```jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthApi } from '@/app/context/useAuthApi';

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { get, isLoading, error } = useAuthApi();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/user');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### Step 2: Create Protected Admin Page

**`app/admin/dashboard/page.js`**
```jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/admin');
    } else if (!isAdmin) {
      router.push('/blogs');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <div>Admin Dashboard</div>;
}
```

---

## localStorage Management

The AuthContext automatically handles localStorage:

**Stored Data:**
```javascript
localStorage.token   // JWT token string
localStorage.user    // User object as JSON string
```

**Automatic Initialization:**
- On app load, AuthContext checks localStorage
- Restores user and token if available
- Sets `isLoading` to `false` when complete

**On Logout:**
- Clears both token and user from localStorage
- Resets all auth state to null

---

## Error Handling

The context provides error messages from:
1. Failed login/register attempts
2. API call errors
3. Validation errors

**Usage:**
```jsx
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    console.error('Auth error:', error);
    // Show error to user
  }
}, [error]);

// Clear error when user fixes it
const handleChange = () => {
  clearError();
};
```

---

## Security Considerations

### Token Storage
- JWT tokens stored in localStorage
- Included automatically in API calls via `Authorization` header
- Cleared on logout

### Protected Routes
- Routes check `isAuthenticated` before rendering
- Unauthenticated users redirected to login
- Admin routes check both `isAuthenticated` and `isAdmin`

### API Calls
- All API calls include `Authorization: Bearer {token}` header
- Backend validates token and rejects if invalid
- App should handle 401 responses

---

## Troubleshooting

### "useAuth must be used within an AuthProvider"
**Problem:** Using `useAuth()` outside AuthProvider

**Solution:** Ensure AuthProvider wraps your component in layout.tsx

### User data lost on refresh
**Problem:** AuthProvider initializes from localStorage

**Solution:** Clear browser cache or localStorage, login again

### Token not sent with requests
**Problem:** Using fetch directly instead of useAuthApi

**Solution:** Use `useAuthApi()` hook or manually add header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Admin check not working
**Problem:** User role not being checked correctly

**Solution:** Verify backend returns `role: 'admin'` for admin users

---

## Migration from Previous Implementation

### Old Way (Direct fetch)
```jsx
const token = localStorage.getItem('token');
const response = await fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### New Way (With Context)
```jsx
const { token } = useAuth();
// OR use useAuthApi hook
const { get, post } = useAuthApi();
```

---

## Best Practices

1. **Always use `useAuth()` for auth state**
   - Don't access localStorage directly
   - Let context manage state

2. **Use `useAuthApi()` for API calls**
   - Automatically includes token
   - Handles errors consistently

3. **Check `isAuthenticated` before rendering**
   - Avoid showing protected content to guests
   - Use `isLoading` for loading states

4. **Clear error when appropriate**
   - Call `clearError()` when user fixes input
   - Don't show stale errors

5. **Handle role-based access**
   - Check `isAdmin` for admin features
   - Don't hide; redirect to appropriate page

---

## API Response Handling

### Success Response
```javascript
const result = await login(email, password);
if (result.success) {
  // User logged in, token stored automatically
  router.push('/blogs');
}
```

### Error Response
```javascript
const result = await login(email, password);
if (!result.success) {
  setError(result.error);
  // Show error to user
}
```

---

## Integration Checklist

- [x] AuthProvider added to layout.tsx
- [x] AuthContext.jsx created
- [x] ProtectedRoute component created
- [x] useAuthApi hook created
- [ ] Update all pages using auth
  - [ ] User login page
  - [ ] Admin login page
  - [ ] Blog listing page
  - [ ] Blog detail page
  - [ ] Create blog page
  - [ ] Edit blog page
- [ ] Test login/logout flows
- [ ] Test protected routes
- [ ] Test token persistence

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** ✅ Ready for Use

