# BlogPlatform Frontend - Complete Documentation

## Overview

The BlogPlatform frontend is built with **Next.js 16.1.6** and **React 19.2.3**, styled with **Tailwind CSS 4**. It provides a modern, responsive interface for users to read blogs, write comments, like posts, and for admins to manage content.

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with Geist fonts
│   ├── globals.css              # Global Tailwind styles
│   ├── page.js                  # Landing page (home)
│   │
│   ├── login/
│   │   ├── user/
│   │   │   └── page.js          # User login/signup page
│   │   └── admin/
│   │       └── page.js          # Admin login page
│   │
│   ├── blogs/
│   │   ├── page.js              # Blog listing page
│   │   └── [id]/
│   │       └── page.js          # Single blog view page
│   │
│   └── admin/
│       ├── create/
│       │   └── page.js          # Create blog page
│       └── edit/
│           └── [id]/
│               └── page.js      # Edit blog page
│
├── public/                      # Static assets
├── package.json                 # Dependencies
└── tailwind.config.ts          # Tailwind CSS configuration
```

## Pages & Routes

### 1. Landing Page (`/`)
**File:** `app/page.js`

**Purpose:** Entry point for the application

**Features:**
- Hero section with gradient text
- Dual card system: "Reader & Writer" (User) vs "Admin Portal"
- Interactive hover effects with animated borders
- Responsive grid layout (1 column mobile, 2 columns desktop)
- Navigation bar with sign-in link
- Feature showcases for each user type
- Footer section with platform features

**Key Components:**
```jsx
- Navigation bar with logo and sign-in link
- Hero section with platform branding
- Grid of two card options (User/Admin)
- Feature lists with checkmark icons
- CTA buttons linking to respective login pages
- Floating background blur elements for visual appeal
```

**States Managed:**
- `hoveredCard`: Tracks which card is being hovered (for animation effects)

### 2. User Login/Signup (`/login/user`)
**File:** `app/login/user/page.js`

**Purpose:** Handle user registration and authentication

**Features:**
- Toggle between Sign In and Sign Up modes
- Form validation (passwords match, minimum 6 characters)
- Email and password authentication
- Google OAuth integration
- Token and user data storage in localStorage
- Error handling with user-friendly messages
- Responsive form layout with gradient styling

**API Endpoints Called:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth redirect

**Form Fields:**
- **Sign Up Mode:** Name, Email, Password, Confirm Password
- **Sign In Mode:** Email, Password, Remember Me checkbox

**Post-Authentication:**
- Stores JWT token in localStorage
- Stores user data in localStorage
- Redirects to `/blogs` page

### 3. Admin Login (`/login/admin`)
**File:** `app/login/admin/page.js`

**Purpose:** Admin-only authentication interface

**Features:**
- Email and password authentication only (no Google OAuth for admins)
- Admin role verification (fails if user is not admin)
- Enhanced security messaging
- Admin-specific badges and styling
- Security notice and guidelines
- Forgive password link (placeholder)

**API Endpoint Called:**
- `POST /api/auth/login` - Login with admin credentials

**Post-Authentication:**
- Role verification ensures only admins can access
- Stores JWT token and user data in localStorage
- Redirects to `/admin/dashboard` (or `/blogs` if already created)

### 4. Blog Listing (`/blogs`)
**File:** `app/blogs/page.js`

**Purpose:** Display paginated list of all blog posts

**Features:**
- Fetches blogs with pagination (6 per page)
- Blog cards with title, author, excerpt, stats
- Like count, comment count, creation date display
- Admin-only "Create Blog" button in navigation
- User logout functionality
- Loading and empty states
- Pagination controls (Previous/Next + page numbers)
- Responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)

**API Endpoints Called:**
- `GET /api/blogs?page=X&limit=6` - Fetch paginated blogs

**Authentication:**
- Requires valid JWT token
- Redirects unauthenticated users to `/login/user`

**State Management:**
- `blogs`: Array of blog posts
- `currentPage`: Current pagination page
- `totalPages`: Total number of pages
- `isLoading`: Loading state
- `user`: Current user data
- `error`: Error messages

### 5. Single Blog View (`/blogs/[id]`)
**File:** `app/blogs/[id]/page.js`

**Purpose:** Display full blog post with comments and interactions

**Features:**
- Full blog content display
- Author information with avatar
- Like/Unlike functionality with count
- Comments section with nested comments
- Comment submission form
- Edit button for blog authors
- View count display
- Publication date and time
- Loading and error states

**API Endpoints Called:**
- `GET /api/blogs/:id` - Fetch single blog
- `POST /api/blogs/:id/like` - Like a blog
- `POST /api/blogs/:id/unlike` - Unlike a blog
- `POST /api/blogs/:id/comments` - Post a comment

**Features:**
- Real-time like/unlike toggling
- Comment submission with validation
- Author detection for edit button visibility
- Formatted dates and times

### 6. Create Blog (`/admin/create`)
**File:** `app/admin/create/page.js`

**Purpose:** Admin interface for creating new blog posts

**Features:**
- Title input field with character count
- Rich content textarea for blog body
- Form validation (required fields)
- Success/Error handling
- Guidelines and best practices section
- Publishing tips
- Cancel option to go back

**API Endpoint Called:**
- `POST /api/blogs` - Create new blog

**Authentication:**
- Requires admin role
- Redirects non-admin users to `/blogs`

**Post-Creation:**
- Redirects to newly created blog view page

### 7. Edit Blog (`/admin/edit/[id]`)
**File:** `app/admin/edit/[id]/page.js`

**Purpose:** Admin interface for editing existing blog posts

**Features:**
- Pre-populated form with current blog data
- Edit title and content
- Save changes functionality
- Delete blog functionality with confirmation
- Back navigation to blog view
- Danger zone section for deletion

**API Endpoints Called:**
- `GET /api/blogs/:id` - Fetch blog data for editing
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

**Authentication:**
- Requires admin role
- Redirects non-admin users to `/blogs`

## Authentication Flow

### User Registration Flow
```
1. User fills signup form (/login/user?signup=true or toggle)
2. Frontend validates:
   - Name not empty
   - Email valid format
   - Password >= 6 characters
   - Confirm password matches
3. POST to /api/auth/register
4. Backend creates user, returns token + user data
5. Frontend stores token and user in localStorage
6. Redirect to /blogs
```

### User Login Flow
```
1. User fills login form (/login/user)
2. POST to /api/auth/login
3. Backend validates credentials, returns token
4. Frontend stores token and user in localStorage
5. Redirect to /blogs
```

### Admin Login Flow
```
1. Admin fills login form (/login/admin)
2. POST to /api/auth/login
3. Backend returns user with role info
4. Frontend checks role === 'admin'
5. If admin, store token and user in localStorage
6. Redirect to /admin/dashboard or /blogs
```

### Google OAuth Flow
```
1. User clicks "Sign in with Google"
2. Redirects to http://localhost:5000/api/auth/google
3. Backend handles OAuth, creates/updates user
4. Backend redirects to frontend with token
5. Frontend stores token and redirects to /blogs
```

## Token Management

**Token Storage:**
```javascript
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

**Token Usage:**
```javascript
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Logout:**
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
router.push('/');
```

## API Integration

### Base URL
`http://localhost:5000`

### Headers
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>' // For protected routes
}
```

### Response Format
```javascript
{
  success: true/false,
  message: 'string',
  data: {...}
}
```

## Component Features

### Navigation Bar
- Sticky positioning (top-0, z-50)
- Backdrop blur for modern look
- Logo/branding
- Action buttons (Sign in, Create Blog, Logout)
- Responsive design

### Cards
- Glassmorphism effect with backdrop-blur
- Gradient borders on hover
- Scale animation on interaction
- Drop shadow for depth
- Responsive padding

### Forms
- Tailwind styling with dark theme
- Focus states with purple accent
- Error message display
- Loading states on buttons
- Validation feedback

### Loading States
- Spinner animation
- Disabled buttons
- Placeholder messages

### Error Handling
- Alert boxes with red styling
- Specific error messages
- Automatic clearing on input

## Styling & Design System

### Colors
- **Primary Gradient:** Purple (500) → Pink (600)
- **Secondary Gradient:** Blue (500) → Cyan (500)
- **Accent:** Purple/Pink
- **Background:** Slate-900, Slate-800
- **Text:** White, Gray-300, Gray-400

### Effects
- Backdrop blur: `backdrop-blur-md`
- Gradient borders: `bg-gradient-to-r`
- Hover animations: `scale-105`, `group-hover`
- Smooth transitions: `transition-all duration-300`

### Responsive Breakpoints
- Mobile: Default (< 640px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

### Typography
- **Headings:** Bold, gradient text
- **Body:** Gray-300 or white
- **Captions:** Gray-400, small text
- **Icons:** Heroicons (24x24 or 20x20)

## State Management

Currently using React's built-in `useState` hook. For larger applications, consider:
- Context API
- Redux
- Zustand
- Jotai

## Performance Optimizations

1. **Image Optimization:** Use Next.js `Image` component (future)
2. **Code Splitting:** Next.js automatic route-based splitting
3. **Lazy Loading:** Next.js dynamic imports
4. **Caching:** Browser localStorage for user data
5. **Pagination:** Limit blogs loaded per page (6 per page)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- LocalStorage support required

## Known Issues & Improvements

### Current Limitations
1. No markdown support in blog content
2. No image uploads for blogs
3. Comments don't support nested replies
4. No search functionality
5. No category/tag system
6. No user profiles

### Recommended Improvements
1. Add image upload/preview for blog creation
2. Implement markdown editor for rich text
3. Add nested comment replies
4. Search functionality with filters
5. User profile pages
6. Blog categories/tags
7. Social sharing buttons
8. Reading time estimation
9. Blog drafts before publishing
10. User notifications

## Environment Variables

Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Getting Started

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build
```bash
npm run build
npm start
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}
```

## File Naming Conventions

- **Page Components:** `page.js` (Next.js specific)
- **Layout Components:** `layout.tsx`
- **Dynamic Routes:** `[param]/page.js`
- **Optional Routes:** `[[...slug]]/page.js`

## Debugging Tips

### Check Token
```javascript
console.log(localStorage.getItem('token'));
```

### Check User Data
```javascript
console.log(JSON.parse(localStorage.getItem('user')));
```

### Network Requests
- Use browser DevTools Network tab
- Check CORS headers
- Verify API endpoint URLs

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Alternative Hosting
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker + any hosting service

## Support & Troubleshooting

### Login Not Working
1. Check backend is running on port 5000
2. Verify `.env` configuration
3. Check network tab for API errors

### Blogs Not Loading
1. Ensure user is authenticated
2. Check token in localStorage
3. Verify backend API response

### Styling Issues
1. Verify Tailwind CSS is properly configured
2. Clear `.next` folder and rebuild
3. Check for CSS conflicts

---

**Last Updated:** 2024
**Version:** 1.0
