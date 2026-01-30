# Frontend Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend running on `http://localhost:5000`

### Installation Steps

#### 1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Create Environment File
Create `.env.local` in the frontend root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### 4. Start Development Server
```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

---

## File Structure Quick Reference

```
app/
├── page.js                          # Landing page (home)
├── layout.tsx                       # Root layout
├── globals.css                      # Tailwind imports
│
├── login/
│   ├── user/page.js                # User login/signup
│   └── admin/page.js               # Admin login
│
├── blogs/
│   ├── page.js                     # Blog listing
│   └── [id]/page.js                # Single blog view
│
└── admin/
    ├── create/page.js              # Create blog
    └── edit/[id]/page.js           # Edit blog
```

---

## Pages Overview

| Route | Purpose | Public | Auth Required |
|-------|---------|--------|---------------|
| `/` | Landing page | ✅ | ❌ |
| `/login/user` | User auth | ✅ | ❌ |
| `/login/admin` | Admin auth | ✅ | ❌ |
| `/blogs` | Blog listing | ❌ | ✅ |
| `/blogs/[id]` | Single blog | ❌ | ✅ |
| `/admin/create` | Create blog | ❌ | ✅ (Admin) |
| `/admin/edit/[id]` | Edit blog | ❌ | ✅ (Admin) |

---

## API Endpoints Summary

### Authentication
```
POST   /api/auth/register          # User signup
POST   /api/auth/login             # User/Admin login
GET    /api/auth/google            # Google OAuth
GET    /api/auth/me                # Get current user
POST   /api/auth/logout            # Logout
```

### Blogs
```
GET    /api/blogs                  # Get all blogs (paginated)
GET    /api/blogs/:id              # Get single blog
POST   /api/blogs                  # Create blog (admin only)
PUT    /api/blogs/:id              # Update blog (admin/author)
DELETE /api/blogs/:id              # Delete blog (admin/author)
POST   /api/blogs/:id/like         # Like blog
POST   /api/blogs/:id/unlike       # Unlike blog
POST   /api/blogs/:id/comments     # Add comment
```

---

## User Flows

### New User Registration
1. Visit landing page (`/`)
2. Click "Create Account" on user card
3. Fill in name, email, password
4. Submit form
5. Auto-login and redirect to `/blogs`

### Existing User Login
1. Visit landing page (`/`)
2. Click "Sign In" on user card
3. Enter email and password
4. Submit form
5. Redirect to `/blogs`

### Admin Login
1. Visit landing page (`/`)
2. Click "Sign In" on admin card
3. Enter admin email and password
4. Must be assigned admin role to succeed
5. Redirect to `/blogs` or dashboard

### Reading Blogs
1. User authenticates
2. Browse blog list at `/blogs`
3. Click on blog to view full content at `/blogs/[id]`
4. Like/unlike and add comments

### Creating Blog (Admin Only)
1. Admin login to system
2. Click "Create Blog" button (visible in navbar)
3. Fill title and content
4. Click "Publish Blog"
5. Redirected to blog view page

### Editing Blog (Admin Only)
1. View blog at `/blogs/[id]`
2. Click "Edit" button (only visible to author)
3. Modify title and content
4. Click "Save Changes"
5. Redirected back to blog

### Deleting Blog (Admin Only)
1. Go to edit page `/admin/edit/[id]`
2. Scroll to "Danger Zone"
3. Click "Delete Blog Post"
4. Confirm deletion
5. Redirected to `/blogs`

---

## Component Usage Examples

### Authentication Check
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login/user');
  }
}, [router]);
```

### API Call with Auth
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Form State Management
```javascript
const [formData, setFormData] = useState({
  field: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

---

## Tailwind CSS Classes Used

### Layout
- `min-h-screen` - Full viewport height
- `max-w-*` - Container width constraints
- `mx-auto` - Center container
- `px-*` / `py-*` - Padding
- `grid` / `flex` - Layout systems

### Colors
- `bg-gradient-to-r` - Horizontal gradients
- `text-white` / `text-gray-*` - Text colors
- `border-*` - Border colors

### Effects
- `backdrop-blur-md` - Blur background
- `rounded-*` - Border radius
- `shadow-*` - Box shadows
- `opacity-*` - Transparency

### Animation
- `transition-all` / `duration-300` - Smooth transitions
- `hover:*` - Hover states
- `scale-105` - Size transformation
- `animate-spin` - Spinner animation

---

## Common Tasks

### Adding a New Page
1. Create `app/your-route/page.js`
2. Add 'use client' directive for interactivity
3. Import necessary dependencies (useRouter, Link, etc.)
4. Build component and export as default

### Adding a New API Call
```javascript
const response = await fetch('http://localhost:5000/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
const result = await response.json();
```

### Protecting a Route
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login/user');
  }
}, [router]);
```

### Adding Admin-Only Access
```javascript
useEffect(() => {
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  if (user.role !== 'admin') {
    router.push('/blogs');
  }
}, [router]);
```

---

## Troubleshooting

### Port Already in Use
```bash
# If port 3000 is in use:
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Network Errors
- Check backend is running on port 5000
- Verify CORS is enabled on backend
- Check API endpoint URLs in code

### Styling Not Applying
- Ensure Tailwind CSS is configured
- Check class names are spelled correctly
- Clear browser cache and rebuild

### Authentication Issues
- Check localStorage has token
- Verify token is valid
- Check backend endpoint returns proper response

---

## Development Tips

### Debug Mode
Open browser DevTools (F12) to:
- View Network requests
- Check Console for errors
- Inspect localStorage
- Monitor state changes

### Log Debugging
```javascript
console.log('Variable:', variable);
console.table(arrayOfObjects);
console.error('Error:', error);
```

### React DevTools Browser Extension
- Install React DevTools
- Inspect component hierarchy
- Track state changes
- Profile performance

### Tailwind IntelliSense
- Install Tailwind CSS IntelliSense extension
- Get autocomplete for class names
- View class definitions

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend API URL set correctly
- [ ] All pages tested and working
- [ ] Forms validated properly
- [ ] Authentication flows work
- [ ] Blog CRUD operations working
- [ ] Responsive design verified
- [ ] Performance optimized
- [ ] No console errors
- [ ] Ready for production build

---

## Production Build

```bash
# Build optimized version
npm run build

# Test production build locally
npm start
```

## Environment Variables for Production

Create `.env.production.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## Support

For issues or questions:
1. Check the main FRONTEND_DOCUMENTATION.md
2. Review backend documentation
3. Check error messages in browser console
4. Verify network requests in DevTools

---

**Last Updated:** 2024
**Next.js Version:** 16.1.6
**React Version:** 19.2.3
**Tailwind CSS Version:** 4
