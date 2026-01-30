# Blog Platform - Complete System Guide

## 📊 System Architecture

```
Blog Platform API
├── Authentication System (Completed ✅)
│   ├── Email/Password (bcryptjs + JWT)
│   ├── Google OAuth 2.0
│   ├── User Roles (Admin/User)
│   └── Protected Routes (Middleware)
│
└── Blog System (Completed ✅)
    ├── Blog CRUD Operations
    ├── Like/Unlike Functionality
    ├── Comment System
    ├── View Counting
    └── Pagination & Filtering
```

---

## 🚀 Quick Start

### 1. Setup
```bash
cd backend
npm install
cp .env.example .env
```

### 2. Configure .env
```env
MONGO_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

### 3. Start Server
```bash
npm run dev
```

### 4. Test API
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123!","name":"Test User"}'

# Get blogs
curl http://localhost:5000/api/blogs
```

---

## 📚 Complete API Reference

### Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Blog Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/blogs` | ✅ Admin | Create blog |
| GET | `/api/blogs` | ❌ | Get all blogs |
| GET | `/api/blogs/:id` | ❌ | Get single blog |
| GET | `/api/blogs/author/:id` | ❌ | Get author's blogs |
| GET | `/api/blogs/user/my-blogs` | ✅ | Get own blogs |
| PUT | `/api/blogs/:id` | ✅ | Update blog |
| DELETE | `/api/blogs/:id` | ✅ | Delete blog |
| POST | `/api/blogs/:id/like` | ✅ | Like blog |
| DELETE | `/api/blogs/:id/like` | ✅ | Unlike blog |
| POST | `/api/blogs/:id/comments` | ✅ | Add comment |
| DELETE | `/api/blogs/:id/comments/:id` | ✅ | Delete comment |

---

## 🔐 User Roles & Permissions

### Admin User
- ✅ Create blogs
- ✅ Edit any blog
- ✅ Delete any blog
- ✅ Delete any comment
- ✅ Like blogs
- ✅ Comment on blogs

### Regular User
- ❌ Create blogs
- ✅ Edit own blogs (N/A)
- ✅ Delete own blogs (N/A)
- ✅ Like blogs
- ✅ Comment on blogs
- ✅ Delete own comments

### Anonymous User
- ✅ View published blogs
- ✅ Get blog by ID
- ❌ Create blogs
- ❌ Like blogs
- ❌ Comment on blogs

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js          # User schema with auth
│   │   └── Blog.js          # Blog schema with comments
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── blogController.js    # Blog operations
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   └── blogRoutes.js    # Blog endpoints
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT & role auth
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── passport.js      # Passport strategies
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── .env.example             # Environment template
├── package.json             # Dependencies
├── AUTH_README.md           # Auth documentation
├── BLOG_API.md              # Blog API docs
└── BLOG_TESTING.md          # Testing guide
```

---

## 💾 Database Models

### User Schema
```javascript
{
  email: String (unique, validated),
  password: String (hashed, not returned),
  googleId: String (OAuth),
  name: String,
  profileImage: String,
  role: String ('user' | 'admin'),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Schema
```javascript
{
  title: String (required, max 200 chars),
  content: String (required),
  author: ObjectId (ref: User),
  likes: [ObjectId] (ref: User),
  comments: [
    {
      user: ObjectId (ref: User),
      text: String (max 500 chars),
      createdAt: Date
    }
  ],
  published: Boolean,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Common Workflows

### Workflow 1: User Registration & Blog Access

```
1. User registers: POST /api/auth/register
2. Receives JWT token
3. Views blogs: GET /api/blogs (no auth needed)
4. Views single blog: GET /api/blogs/:id
5. Likes blog: POST /api/blogs/:id/like (auth required)
6. Adds comment: POST /api/blogs/:id/comments (auth required)
```

### Workflow 2: Admin Creates & Manages Blog

```
1. Admin logs in: POST /api/auth/login
2. Creates blog: POST /api/blogs
3. Edits blog: PUT /api/blogs/:id
4. Views statistics (views, likes, comments)
5. Deletes blog: DELETE /api/blogs/:id
```

### Workflow 3: User Comments & Engages

```
1. User views blog: GET /api/blogs/:id (views++)
2. User likes blog: POST /api/blogs/:id/like
3. User adds comment: POST /api/blogs/:id/comments
4. Other users read comment
5. User deletes comment: DELETE /api/blogs/:id/comments/:id
```

---

## 📖 Documentation Map

| Document | Purpose | Audience |
|----------|---------|----------|
| [AUTH_README.md](./AUTH_README.md) | Auth system details | Developers |
| [BLOG_API.md](./BLOG_API.md) | Full Blog API reference | Developers, Testers |
| [BLOG_QUICK_REF.md](./BLOG_QUICK_REF.md) | Quick endpoint guide | Developers |
| [BLOG_TESTING.md](./BLOG_TESTING.md) | Testing examples | QA, Developers |
| [SETUP.md](./SETUP.md) | Initial setup guide | DevOps, Developers |
| [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md) | Environment setup | DevOps |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Overall quick ref | Everyone |

---

## 🧪 Testing Examples

### Test 1: Create and Like a Blog
```bash
# Create blog
BLOG=$(curl -s -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content"}')

BLOG_ID=$(echo $BLOG | jq -r '.data.id')

# Like blog
curl -X POST "http://localhost:5000/api/blogs/$BLOG_ID/like" \
  -H "Authorization: Bearer USER_TOKEN"

# View blog
curl "http://localhost:5000/api/blogs/$BLOG_ID"
```

### Test 2: Add and Delete Comment
```bash
# Add comment
curl -X POST "http://localhost:5000/api/blogs/$BLOG_ID/comments" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Great blog!"}'

# Get comment ID from response
# Delete comment
curl -X DELETE "http://localhost:5000/api/blogs/$BLOG_ID/comments/COMMENT_ID" \
  -H "Authorization: Bearer USER_TOKEN"
```

---

## 🔒 Security Features

### Authentication
- ✅ bcryptjs password hashing (10 salt rounds)
- ✅ JWT tokens with expiration
- ✅ Bearer token format
- ✅ Google OAuth 2.0

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ User-level permissions
- ✅ Admin override capabilities
- ✅ Resource ownership verification

### Data Protection
- ✅ Password excluded from queries
- ✅ Email validation
- ✅ CORS enabled
- ✅ Input validation on all endpoints

---

## 🚨 Error Handling

### Error Types
| Status | Meaning | Example |
|--------|---------|---------|
| 201 | Created | Blog created successfully |
| 200 | Success | Operation completed |
| 400 | Bad request | Missing required fields |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Not authorized for operation |
| 404 | Not found | Blog/comment doesn't exist |
| 500 | Server error | Database error |

### Error Response Format
```javascript
{
  success: false,
  message: "Descriptive error message"
}
```

---

## 📊 Performance Considerations

### Database Indexes
- `User.email` - Fast user lookup
- `Blog.author + createdAt` - Author queries
- `Blog.published + createdAt` - Public listings

### Pagination
- Default: 10 items per page
- Configurable via query parameters
- Reduces memory usage
- Improves frontend performance

### Caching Opportunities
- Cache frequently accessed blogs
- Cache user profiles
- Cache author blogs
- Cache total counts

---

## 🔄 Integration Checklist

For Frontend Integration:

- [ ] Auth system
  - [ ] Login/Register forms
  - [ ] Store JWT token
  - [ ] Handle token expiration
  - [ ] User profile display
  - [ ] Google OAuth button

- [ ] Blog system
  - [ ] List blogs page
  - [ ] Single blog view
  - [ ] Create blog form (admin)
  - [ ] Edit blog form
  - [ ] Delete confirmation
  - [ ] Like button
  - [ ] Comment section
  - [ ] View count display

- [ ] Navigation
  - [ ] Auth routes
  - [ ] Blog listing
  - [ ] Author pages
  - [ ] User dashboard
  - [ ] Admin panel

---

## 🎯 Future Enhancement Ideas

### Phase 2 Features
- [ ] Email verification
- [ ] Password reset
- [ ] User profiles
- [ ] Blog categories/tags
- [ ] Search functionality
- [ ] Bookmark/Save blogs

### Phase 3 Features
- [ ] Blog series
- [ ] Follow system
- [ ] Notifications
- [ ] Blog analytics
- [ ] Recommended blogs
- [ ] Social sharing

### Phase 4 Features
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Content moderation
- [ ] Blog scheduling
- [ ] Draft collaboration
- [ ] Blog versioning

---

## 🐛 Common Issues & Solutions

### Issue: "Port already in use"
```bash
# Kill process on port 5000
lsof -i :5000  # Find PID
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Issue: "MongoDB connection failed"
```bash
# Ensure MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check MONGO_URI
echo $MONGO_URI
```

### Issue: "Invalid token"
```bash
# Ensure token includes "Bearer "
# Correct: Authorization: Bearer TOKEN
# Wrong: Authorization: TOKEN
```

### Issue: "Cannot create blog as admin"
```bash
# Verify user is admin in MongoDB
db.users.findOne({ email: "admin@test.com" })
# Should have role: "admin"
```

---

## 📞 Support & Resources

### Useful Links
- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Mongoose Docs](https://mongoosejs.com)
- [Passport.js Docs](http://www.passportjs.org)
- [JWT Specification](https://tools.ietf.org/html/rfc8725)

### Getting Help
1. Check relevant documentation file
2. Review BLOG_TESTING.md for examples
3. Check MongoDB for data issues
4. Review console logs for errors

---

## ✅ Verification Checklist

- [x] Auth system implemented
- [x] Blog CRUD operations implemented
- [x] Like/unlike functionality implemented
- [x] Comment system implemented
- [x] Pagination implemented
- [x] Role-based authorization implemented
- [x] View counting implemented
- [x] Error handling implemented
- [x] API documentation created
- [x] Testing guide created
- [x] Quick reference guide created

---

## 📈 Deployment Checklist

Before going to production:

- [ ] Set strong JWT_SECRET
- [ ] Configure production MONGO_URI
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Set up logging
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Backup database regularly
- [ ] Test all endpoints thoroughly
- [ ] Document API changes
- [ ] Set up error tracking

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Pagination is zero-indexed (page starts at 1)
- Likes are unique per user per blog
- Comments are permanent (soft delete recommended)
- View count doesn't increment for author
- Only published blogs appear in public listings

---

## 🎓 Learning Path

1. **Start Here**: SETUP.md
2. **Auth System**: AUTH_README.md
3. **Blog API**: BLOG_API.md
4. **Testing**: BLOG_TESTING.md
5. **Quick Ref**: BLOG_QUICK_REF.md

---

**System Status**: 🟢 Production Ready
**Last Updated**: January 2026
**Version**: 1.0

For specific feature documentation, refer to individual files in the backend folder.
