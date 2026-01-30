# Authentication API Test Examples

## Postman Collection Alternative (cURL Commands)

### 1. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MySecurePassword123!",
    "name": "John Doe"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MySecurePassword123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### 3. Get Current User (Protected)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "profileImage": null
  }
}
```

---

### 4. Logout (Protected)

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

### 5. Google OAuth Login

```bash
# In browser, visit:
http://localhost:5000/api/auth/google

# You'll be redirected to Google login page
# After authentication, you'll receive JWT token
```

---

## Error Response Examples

### Missing Required Fields
```json
{
  "success": false,
  "message": "Please provide email, password, and name"
}
```

### User Already Exists
```json
{
  "success": false,
  "message": "User already exists"
}
```

### Invalid Email or Password
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Unauthorized (No Token)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Invalid Token
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

## JavaScript/Fetch Examples

### Register User
```javascript
async function register(email, password, name) {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Save token to localStorage
    localStorage.setItem('token', data.token);
    console.log('User registered:', data.user);
  } else {
    console.error('Registration failed:', data.message);
  }
  
  return data;
}
```

### Login User
```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    console.log('Login successful:', data.user);
  } else {
    console.error('Login failed:', data.message);
  }
  
  return data;
}
```

### Get Current User
```javascript
async function getCurrentUser() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found');
    return null;
  }
  
  const response = await fetch('http://localhost:5000/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Current user:', data.user);
    return data.user;
  } else {
    console.error('Failed to get user:', data.message);
    localStorage.removeItem('token');
    return null;
  }
}
```

### Logout
```javascript
async function logout() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.removeItem('token');
    console.log('Logged out successfully');
  }
  
  return data;
}
```

### API Call Helper Function
```javascript
async function apiCall(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`http://localhost:5000${endpoint}`, options);
  const data = await response.json();
  
  return data;
}

// Usage:
// const user = await apiCall('/api/auth/me');
// const result = await apiCall('/api/auth/login', 'POST', { email, password });
```

---

## Testing Checklist

- [ ] Register a new user with email/password
- [ ] Login with registered email/password
- [ ] Get current user using JWT token
- [ ] Try accessing protected route without token (should fail)
- [ ] Try with invalid token (should fail)
- [ ] Logout user
- [ ] Register with existing email (should fail)
- [ ] Login with wrong password (should fail)
- [ ] Google OAuth login flow

---

## Database Check Commands

### View all users in MongoDB
```bash
mongosh
use blog-platform
db.users.find().pretty()
```

### Check user schema
```bash
db.users.findOne()
```

### Delete a user (testing)
```bash
db.users.deleteOne({ email: "test@example.com" })
```

---

## Notes

- **Token expires** in 7 days by default (configurable via JWT_EXPIRE in .env)
- **Passwords** are automatically hashed using bcrypt before storing
- **Email** validation is enforced
- **Default role** for new users is "user"
- **Google OAuth** creates users automatically on first login
