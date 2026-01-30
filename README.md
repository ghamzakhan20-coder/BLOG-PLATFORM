# BlogPlatform - Complete Documentation

A full-stack blog platform with role-based authentication, blog management, and interactive features. Built with Node.js/Express backend and Next.js/React frontend.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Features](#features)
6. [API Documentation](#api-documentation)
7. [Frontend Documentation](#frontend-documentation)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**BlogPlatform** is a complete blog management system with:
- **User Authentication:** Email/password registration and login
- **Social Login:** Google OAuth integration
- **Role-Based Access:** Separate user and admin interfaces
- **Blog Management:** Create, read, update, delete blogs
- **Interactions:** Like/unlike blogs and comment on posts
- **Modern UI:** Responsive design with Tailwind CSS

### User Types

1. **Regular User**
   - Sign up and login
   - Browse all blogs
   - Like/unlike posts
   - Comment on blogs
   - View their profile (future)

2. **Admin User**
   - Create new blog posts
   - Edit their blogs
   - Delete their blogs
   - Manage all platform content
   - Access admin dashboard (future)

---

## 🛠 Technology Stack

### Backend
```
Node.js + Express.js
MongoDB + Mongoose
Passport.js (Authentication)
bcryptjs (Password hashing)
jsonwebtoken (JWT tokens)
CORS enabled
```

### Frontend
```
Next.js 16.1.6
React 19.2.3
Tailwind CSS 4
Responsive Design
Client-side Routing
```

### Database
```
MongoDB Atlas (recommended)
Mongoose ODM
Indexed collections
Role-based schemas
```

---

## 📁 Project Structure

```
blog-platform/
│
├── backend/
│   ├── src/
│   │   ├── app.js                      # Express app setup
│   │   ├── server.js                   # Server entry point
│   │   ├── config/
│   │   │   ├── db.js                   # MongoDB connection
│   │   │   └── passport.js             # Passport strategies
│   │   ├── controllers/
│   │   │   ├── authController.js       # Auth operations
│   │   │   └── blogController.js       # Blog CRUD operations
│   │   ├── models/
│   │   │   ├── User.js                 # User schema
│   │   │   └── Blog.js                 # Blog schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # Auth endpoints
│   │   │   └── blogRoutes.js           # Blog endpoints
│   │   └── middleware/
│   │       ├── authMiddleware.js       # JWT verification
│   │       └── adminMiddleware.js      # Admin checks
│   ├── package.json
│   ├── .env                            # Environment variables
│   └── [Documentation files]
│
├── frontend/
│   ├── app/
│   │   ├── page.js                     # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── login/
│   │   │   ├── user/page.js            # User auth
│   │   │   └── admin/page.js           # Admin auth
│   │   ├── blogs/
│   │   │   ├── page.js                 # Blog list
│   │   │   └── [id]/page.js            # Blog detail
│   │   └── admin/
│   │       ├── create/page.js          # Create blog
│   │       └── edit/[id]/page.js       # Edit blog
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   └── [Documentation files]
│
├── FRONTEND_SUMMARY.md                 # Frontend overview
├── PROJECT_STRUCTURE.md                # This file
└── README.md                           # Main readme
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Step 1: Clone Repository
```bash
cd blog-platform
```

### Step 2: Setup Backend

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogplatform
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Start Backend
```bash
npm run dev
# Backend runs on http://localhost:5000
```

### Step 3: Setup Frontend

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create `.env.local` file in frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 4: Access the Application
1. Open browser to `http://localhost:3000`
2. Start with landing page
3. Choose to login as user or admin
4. Explore the platform

---

## ✨ Features

### Authentication & Authorization
- ✅ User registration with email validation
- ✅ Secure password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Google OAuth integration
- ✅ Role-based access control (User/Admin)
- ✅ Automatic session management
- ✅ Token expiration (7 days)

### Blog Management
- ✅ Create blog posts (Admin only)
- ✅ Read all blogs with pagination
- ✅ Update blog content (Admin/Author)
- ✅ Delete blogs (Admin/Author)
- ✅ View blog details with metadata
- ✅ Track views on each blog
- ✅ Display author information

### User Interactions
- ✅ Like/unlike blogs
- ✅ Like counter with deduplication
- ✅ Add comments to blogs
- ✅ View comment history
- ✅ Comment author tracking
- ✅ Timestamp on interactions

### User Interface
- ✅ Modern landing page
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Glassmorphic styling with gradients
- ✅ Smooth animations and transitions
- ✅ Error handling and validation
- ✅ Loading states and spinners
- ✅ Intuitive navigation

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

**Register User**
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Login User**
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: (Same as register)
```

**Get Current User**
```
GET /auth/me
Authorization: Bearer {token}

Response: (User object)
```

### Blog Endpoints

**Get All Blogs (Paginated)**
```
GET /blogs?page=1&limit=6
Authorization: Bearer {token}

Response:
{
  "success": true,
  "blogs": [...],
  "totalBlogs": 25,
  "totalPages": 5,
  "currentPage": 1
}
```

**Get Single Blog**
```
GET /blogs/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "blog": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Blog Title",
    "content": "Blog content...",
    "author": {...},
    "likes": [...],
    "comments": [...],
    "views": 42,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Create Blog (Admin Only)**
```
POST /blogs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Blog Post",
  "content": "Full blog content goes here..."
}

Response: (Blog object with _id)
```

**Update Blog**
```
PUT /blogs/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}

Response: (Updated blog object)
```

**Delete Blog**
```
DELETE /blogs/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

**Like Blog**
```
POST /blogs/:id/like
Authorization: Bearer {token}

Response: (Updated blog with like added)
```

**Unlike Blog**
```
POST /blogs/:id/unlike
Authorization: Bearer {token}

Response: (Updated blog with like removed)
```

**Add Comment**
```
POST /blogs/:id/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Great blog post!"
}

Response: (Comment object)
```

---

## 📚 Frontend Documentation

### Pages

| Route | Component | Purpose | Auth |
|-------|-----------|---------|------|
| `/` | Landing | Entry point | ❌ |
| `/login/user` | User Auth | User login/signup | ❌ |
| `/login/admin` | Admin Auth | Admin login | ❌ |
| `/blogs` | Blog List | All blogs paginated | ✅ |
| `/blogs/[id]` | Blog Detail | Single blog view | ✅ |
| `/admin/create` | Create | Create blog | ✅👮 |
| `/admin/edit/[id]` | Edit | Edit blog | ✅👮 |

### Key Documents

1. **FRONTEND_DOCUMENTATION.md** - Comprehensive frontend guide
   - Detailed page documentation
   - Authentication flows
   - Component features
   - API integration
   - Styling guide

2. **FRONTEND_SETUP.md** - Setup and quick start
   - Installation steps
   - File structure
   - User flows
   - Common tasks
   - Troubleshooting

3. **FRONTEND_TESTING.md** - Testing guide
   - Test cases for each page
   - API testing
   - User flows
   - Deployment checklist

4. **QUICK_REFERENCE.md** - Developer reference
   - Code snippets
   - Tailwind cheat sheet
   - Common errors
   - Performance tips

---

## 🌐 Deployment

### Backend Deployment (Heroku/Railway)

1. **Create account** on hosting platform
2. **Configure environment variables**
3. **Connect GitHub repository**
4. **Deploy** with one click

### Frontend Deployment (Vercel)

**Recommended for Next.js**

```bash
npm install -g vercel
vercel login
vercel
```

### Database (MongoDB Atlas)

1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Environment Configuration

**Production .env (Backend)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogplatform
JWT_SECRET=very_secure_random_string_here
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=https://your-frontend.com
NODE_ENV=production
```

**Production .env.local (Frontend)**
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "Cannot connect to MongoDB"
```
Solution:
- Check MONGODB_URI in .env
- Verify MongoDB is running
- Check network access in MongoDB Atlas
```

**Problem:** "Port 5000 already in use"
```
Solution:
- Kill process: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
- Or change PORT in .env
```

**Problem:** "Passport strategies not working"
```
Solution:
- Verify Google OAuth credentials
- Check GOOGLE_CALLBACK_URL matches OAuth settings
- Ensure passport is properly configured
```

### Frontend Issues

**Problem:** "Cannot load blogs"
```
Solution:
- Check backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL is correct
- Check token in localStorage
- View network requests in DevTools
```

**Problem:** "Tailwind CSS not applying"
```
Solution:
- Run: npm run build
- Clear .next folder
- Ensure tailwind.config.ts is correct
```

**Problem:** "Stuck on login page"
```
Solution:
- Clear localStorage
- Check API endpoint URLs
- Verify backend responds to auth requests
- Check CORS configuration
```

---

## 📊 API Response Format

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ CORS configuration
- ✅ Secure password reset (future)
- ✅ Rate limiting (future)
- ✅ Input validation and sanitization

---

## 📈 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author: {
    _id: ObjectId,
    name: String
  },
  likes: [ObjectId], // Array of user IDs
  comments: [
    {
      _id: ObjectId,
      text: String,
      author: {
        _id: ObjectId,
        name: String
      },
      createdAt: Date
    }
  ],
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Design System

### Colors
- **Primary:** Purple (500) → Pink (600)
- **Secondary:** Blue (500) → Cyan (500)
- **Background:** Slate-900, Slate-800
- **Text:** White, Gray-300, Gray-400

### Effects
- **Backdrop Blur:** For modern glassmorphism
- **Gradients:** For visual interest
- **Shadows:** For depth
- **Smooth Transitions:** 300ms duration

---

## 📝 File Organization

### Backend Structure
```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Business logic
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Express middleware
│   ├── app.js        # Express app
│   └── server.js     # Entry point
├── package.json
└── .env
```

### Frontend Structure
```
frontend/
├── app/
│   ├── login/        # Authentication pages
│   ├── blogs/        # Blog pages
│   ├── admin/        # Admin pages
│   ├── page.js       # Landing page
│   └── layout.tsx    # Root layout
├── public/           # Static files
├── package.json
└── tailwind.config.ts
```

---

## 🚦 Status Indicators

- ✅ Complete and tested
- 🔄 In progress
- 📋 Planned
- ❌ Not implemented

### Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ | Complete |
| Google OAuth | ✅ | Working |
| Blog CRUD | ✅ | Full implementation |
| Comments | ✅ | Nested ready |
| Likes | ✅ | Deduplication included |
| Pagination | ✅ | 6 per page |
| Admin Panel | 📋 | Planned |
| Search | 📋 | Planned |
| Categories | 📋 | Planned |
| Image Upload | 📋 | Planned |

---

## 📞 Support & Documentation

### Documentation Files

**Backend:**
- `backend/API_DOCUMENTATION.md` - API reference
- `backend/SETUP_GUIDE.md` - Setup instructions
- `backend/COMPLETE_GUIDE.md` - Full documentation

**Frontend:**
- `frontend/FRONTEND_DOCUMENTATION.md` - Frontend guide
- `frontend/FRONTEND_SETUP.md` - Setup guide
- `frontend/FRONTEND_TESTING.md` - Testing guide
- `frontend/QUICK_REFERENCE.md` - Quick reference

**Project:**
- `FRONTEND_SUMMARY.md` - Frontend overview
- `PROJECT_STRUCTURE.md` - Project organization
- `README.md` - This file

---

## 🎓 Learning Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)

### Useful Tools
- VS Code with extensions
- MongoDB Compass (GUI)
- Postman (API testing)
- Chrome DevTools
- Tailwind IntelliSense

---

## 🤝 Contributing

When making changes:

1. Create feature branch
2. Make changes with clear commits
3. Update documentation
4. Test thoroughly
5. Submit pull request

### Code Style

- Use meaningful variable names
- Add comments for complex logic
- Follow ESLint configuration
- Format with Prettier

---

## 📄 License

This project is open source and available under MIT License.

---

## 🎯 Next Steps

1. **Clone the repository**
2. **Follow setup instructions** for both backend and frontend
3. **Create .env files** with proper configuration
4. **Start development servers**
5. **Test all features** using provided guides
6. **Customize** for your needs
7. **Deploy** to production

---

## ✨ Summary

**BlogPlatform** is a complete, production-ready solution for:
- Building a blog platform quickly
- Learning full-stack development
- Understanding authentication flows
- Practicing React and Node.js
- Deploying full-stack applications

With comprehensive documentation, testing guides, and example code, you can extend and customize this platform for your specific needs.

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅  
**Total Documentation:** 2000+ lines  
**Code Size:** 3000+ lines  

**Happy Blogging! 🚀**

