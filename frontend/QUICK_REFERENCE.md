# Frontend Quick Reference Guide

## File Locations

| Feature | File Path |
|---------|-----------|
| Landing Page | `app/page.js` |
| User Login/Signup | `app/login/user/page.js` |
| Admin Login | `app/login/admin/page.js` |
| Blog Listing | `app/blogs/page.js` |
| Blog Detail | `app/blogs/[id]/page.js` |
| Create Blog | `app/admin/create/page.js` |
| Edit Blog | `app/admin/edit/[id]/page.js` |

---

## Common Code Snippets

### Redirect to Login
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login/user');
  }
}, [router]);
```

### Admin Check
```javascript
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role !== 'admin') {
    router.push('/blogs');
  }
}, [router]);
```

### API Call with Auth
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
const result = await response.json();
```

### Logout
```javascript
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/');
};
```

### Form State
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

## Tailwind CSS Cheat Sheet

### Layout
- `grid` / `flex` - Display mode
- `gap-*` - Space between items
- `w-*` / `h-*` - Width/Height
- `max-w-*` - Max width
- `px-*` / `py-*` - Padding
- `mx-*` / `my-*` - Margin
- `absolute` / `relative` - Positioning

### Backgrounds & Colors
- `bg-gradient-to-r from-* to-*` - Gradient
- `bg-slate-900` - Dark background
- `text-white` / `text-gray-*` - Text color
- `border border-slate-700` - Border
- `rounded-lg` / `rounded-2xl` - Border radius

### Effects
- `backdrop-blur-md` - Blur
- `shadow-*` - Shadow
- `opacity-*` - Transparency

### Animation
- `transition-all duration-300` - Smooth transition
- `hover:*` - Hover state
- `group-hover:*` - Group hover
- `scale-105` - Transform scale
- `animate-spin` - Spinning animation

### Responsive
- `md:*` - Tablet and above
- `lg:*` - Desktop and above
- `flex-col md:flex-row` - Responsive flex direction

---

## Component Patterns

### Input Field
```jsx
<div>
  <label className="block text-white text-sm font-medium mb-2">
    Label
  </label>
  <input
    type="text"
    name="field"
    value={value}
    onChange={handleChange}
    placeholder="Placeholder..."
    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
  />
</div>
```

### Button
```jsx
<button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
  Button Text
</button>
```

### Card
```jsx
<div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8">
  {/* Content */}
</div>
```

### Error Message
```jsx
{error && (
  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
    <p className="text-red-400">{error}</p>
  </div>
)}
```

### Loading Spinner
```jsx
{isLoading ? (
  <div className="animate-spin">
    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  </div>
) : (
  /* Content */
)}
```

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/blogs?page=1&limit=6
GET    /api/blogs/:id
POST   /api/blogs (admin)
PUT    /api/blogs/:id (admin/author)
DELETE /api/blogs/:id (admin/author)
POST   /api/blogs/:id/like
POST   /api/blogs/:id/unlike
POST   /api/blogs/:id/comments
```

---

## Debugging

### Check Token
```javascript
console.log(localStorage.getItem('token'));
```

### Check User
```javascript
console.log(JSON.parse(localStorage.getItem('user')));
```

### Check API Response
```javascript
const response = await fetch(url);
console.log(await response.json());
```

### View Network Requests
Press F12 → Network tab → Perform action

---

## Keyboard Shortcuts

- `F12` - Open DevTools
- `Ctrl+Shift+I` - DevTools (Windows/Linux)
- `Cmd+Option+I` - DevTools (Mac)
- `Ctrl+Shift+J` - Console
- `Cmd+Option+J` - Console (Mac)

---

## Page State Examples

### Loading with Data
```javascript
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState(null);
const [error, setError] = useState('');

useEffect(() => {
  const fetch = async () => {
    try {
      setIsLoading(true);
      // API call
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  fetch();
}, []);
```

### Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  
  try {
    // Validate
    // API call
    // Success handling
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "Cannot read property 'x' of null" | Check if object exists before accessing |
| "Unexpected token < in JSON" | Backend not returning JSON, check URL |
| "401 Unauthorized" | Check token in localStorage, may be expired |
| "CORS error" | Check backend CORS configuration |
| "Tailwind classes not applying" | Check if tailwind.config.ts is correct |
| "Module not found" | Check import path spelling |
| "Token undefined" | localStorage not properly set, check auth flow |

---

## File Organization

```
app/
├── (auth)                       # Auth-related routes (optional grouping)
│   ├── login/
│   └── signup/
├── (main)                       # Main app routes (optional grouping)
│   ├── blogs/
│   └── admin/
├── components/                  # Reusable components (future)
├── hooks/                       # Custom hooks (future)
└── utils/                       # Utility functions (future)
```

---

## Next Steps for Enhancement

### Phase 2 Improvements
- [ ] Create reusable components (Header, Footer, Card)
- [ ] Add custom hooks (useAuth, useFetch)
- [ ] Implement Context for auth state
- [ ] Add React Query for data fetching
- [ ] Create utility functions for API calls

### Phase 3 Features
- [ ] Add blog search functionality
- [ ] Implement blog categories/tags
- [ ] Add user profiles
- [ ] Create admin dashboard
- [ ] Add nested comment replies
- [ ] Implement image uploads

### Phase 4 Polish
- [ ] Add animations on page transitions
- [ ] Implement dark/light theme toggle
- [ ] Add PWA support
- [ ] Implement service workers for offline
- [ ] Add analytics tracking
- [ ] SEO optimization

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Components](https://ui.shadcn.com)

### Tools
- VS Code with Tailwind IntelliSense
- React DevTools Browser Extension
- Redux DevTools (if using Redux)

### Learning
- Next.js tutorial on official website
- Tailwind CSS tutorial
- React hooks documentation

---

## Performance Tips

1. **Use Next.js Image Component** (future)
   ```jsx
   import Image from 'next/image';
   ```

2. **Lazy Load Components** (future)
   ```jsx
   const Component = dynamic(() => import('./Component'));
   ```

3. **Optimize Re-renders**
   - Use `useCallback` for functions
   - Use `useMemo` for expensive calculations

4. **Cache API Responses**
   - Use React Query or SWR
   - Implement localStorage caching

5. **Code Splitting**
   - Next.js automatic route-based
   - Use dynamic imports for large components

---

## Deployment Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start

# Deploy to Vercel
vercel

# Deploy to other platforms
# Follow platform-specific instructions
```

---

**Quick Links:**
- Frontend Documentation: [FRONTEND_DOCUMENTATION.md](FRONTEND_DOCUMENTATION.md)
- Setup Guide: [FRONTEND_SETUP.md](FRONTEND_SETUP.md)
- Testing Guide: [FRONTEND_TESTING.md](FRONTEND_TESTING.md)
- Backend Documentation: [../backend/API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md)

**Last Updated:** 2024
**Version:** 1.0

