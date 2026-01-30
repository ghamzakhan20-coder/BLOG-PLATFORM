# Blog API Quick Reference

## Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/blogs` | ✅ Admin | Create blog |
| GET | `/api/blogs` | ❌ | Get all blogs (paginated) |
| GET | `/api/blogs/:id` | ❌ | Get single blog |
| GET | `/api/blogs/author/:authorId` | ❌ | Get author's blogs |
| GET | `/api/blogs/user/my-blogs` | ✅ | Get own blogs |
| PUT | `/api/blogs/:id` | ✅ | Update blog |
| DELETE | `/api/blogs/:id` | ✅ | Delete blog |
| POST | `/api/blogs/:id/like` | ✅ | Like blog |
| DELETE | `/api/blogs/:id/like` | ✅ | Unlike blog |
| POST | `/api/blogs/:id/comments` | ✅ | Add comment |
| DELETE | `/api/blogs/:id/comments/:commentId` | ✅ | Delete comment |

---

## Common Requests

### Create Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Title","content":"Content"}'
```

### Get All Blogs
```bash
curl "http://localhost:5000/api/blogs?page=1&limit=10"
```

### Like Blog
```bash
curl -X POST "http://localhost:5000/api/blogs/ID/like" \
  -H "Authorization: Bearer TOKEN"
```

### Add Comment
```bash
curl -X POST "http://localhost:5000/api/blogs/ID/comments" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Comment text"}'
```

### Update Blog
```bash
curl -X PUT "http://localhost:5000/api/blogs/ID" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Title","content":"New Content"}'
```

### Delete Blog
```bash
curl -X DELETE "http://localhost:5000/api/blogs/ID" \
  -H "Authorization: Bearer TOKEN"
```

---

## Response Fields

### Blog Object
```javascript
{
  id: String,              // Blog ID
  title: String,           // Blog title
  content: String,         // Blog content
  author: User,            // Author details
  likes: Number,           // Like count
  comments: Number,        // Comment count
  views: Number,           // View count
  isLiked: Boolean,        // Is current user's blog liked?
  published: Boolean,      // Published status
  createdAt: Date,         // Creation date
  updatedAt: Date          // Last updated date
}
```

### Author Object
```javascript
{
  id: String,              // User ID
  name: String,            // User name
  email: String,           // User email
  profileImage: String     // Profile image URL
}
```

### Comment Object
```javascript
{
  user: User,              // Comment author
  text: String,            // Comment text
  createdAt: Date          // Comment date
}
```

---

## Authorization Rules

### Blog Creation
- ✅ Admin only
- ❌ Regular users cannot create

### Blog Reading
- ✅ Published blogs: Everyone
- ✅ Own unpublished: Author only
- ❌ Others' unpublished: No access

### Blog Update/Delete
- ✅ Author: Own blogs
- ✅ Admin: Any blog
- ❌ Regular user: Others' blogs

### Like/Comment
- ✅ Authenticated users: Can like any published blog
- ✅ Authenticated users: Can comment on any published blog
- ❌ Unauthenticated: Cannot like or comment

### Delete Comment
- ✅ Comment author: Own comments
- ✅ Blog author: Any comment on their blog
- ✅ Admin: Any comment
- ❌ Others: Cannot delete

---

## Pagination

All list endpoints support:
```
?page=1&limit=10
```

Response includes:
```javascript
{
  total: Number,           // Total items
  pages: Number,           // Total pages
  currentPage: Number,     // Current page
  limit: Number            // Items per page
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 201 | Created successfully |
| 200 | Success |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not authorized) |
| 404 | Not found |
| 500 | Server error |

---

## Error Response Format

```javascript
{
  success: false,
  message: "Error description"
}
```

---

## Tips & Tricks

### Get Views Count for Analytics
```javascript
const blog = await fetch(`/api/blogs/${blogId}`);
const data = await blog.json();
console.log(`This blog has ${data.data.views} views`);
```

### Check if User Liked
```javascript
const blog = await fetch(`/api/blogs/${blogId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await blog.json();
if (data.data.isLiked) {
  // Show unlike button
} else {
  // Show like button
}
```

### Infinite Scroll
```javascript
let page = 1;
const blogs = [];

async function loadMore() {
  const response = await fetch(`/api/blogs?page=${page}&limit=10`);
  const data = await response.json();
  blogs.push(...data.data);
  
  if (page < data.pagination.pages) {
    page++;
  }
}
```

### Display Recent Comments
```javascript
const blog = await fetch(`/api/blogs/${blogId}`);
const data = await blog.json();
const recentComments = data.data.commentsList.slice(-5).reverse();
```

---

## Database Schema

### Blog Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author: ObjectId → User,
  likes: [ObjectId],
  comments: [{
    user: ObjectId → User,
    text: String,
    createdAt: Date
  }],
  published: Boolean,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `author + createdAt` (for author queries)
- `published + createdAt` (for public listings)

---

## Features

✅ **CRUD Operations**
- Create, Read, Update, Delete blogs
- Admin-only creation
- Author/Admin can modify

✅ **Like System**
- Like/unlike blogs
- Automatic deduplication
- Like count aggregation

✅ **Comments**
- Nested comments in blogs
- Author/Admin can delete
- Max 500 characters

✅ **View Tracking**
- Auto-increment on view
- Exclude author views
- Analytics tracking

✅ **Pagination**
- All list endpoints paginated
- Configurable page size
- Total count included

✅ **Authorization**
- Role-based access control
- Author-only operations
- Admin override

✅ **Publishing**
- Draft/published status
- Authors see own drafts
- Public sees only published

---

## Field Validation

| Field | Type | Required | Max Length |
|-------|------|----------|-----------|
| title | String | Yes | 200 |
| content | String | Yes | - |
| text (comment) | String | Yes | 500 |
| published | Boolean | No | - |

---

## Example Workflow

### 1. Admin Creates Blog
```bash
POST /api/blogs
Authorization: Bearer admin_token
Content: {"title":"...", "content":"..."}
```

### 2. User Views Blog
```bash
GET /api/blogs/BLOG_ID
(views increment automatically)
```

### 3. User Likes Blog
```bash
POST /api/blogs/BLOG_ID/like
Authorization: Bearer user_token
```

### 4. User Adds Comment
```bash
POST /api/blogs/BLOG_ID/comments
Authorization: Bearer user_token
Content: {"text":"..."}
```

### 5. Admin Updates Blog
```bash
PUT /api/blogs/BLOG_ID
Authorization: Bearer admin_token
Content: {"title":"...", "content":"..."}
```

### 6. Admin Deletes Blog
```bash
DELETE /api/blogs/BLOG_ID
Authorization: Bearer admin_token
```

---

## Debugging

### View Raw Blog Data
```bash
curl "http://localhost:5000/api/blogs/ID" | jq
```

### Check Authorization
```bash
# With token - should work
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/blogs

# Without token - public endpoint works
curl http://localhost:5000/api/blogs
```

### Monitor View Count
```bash
# Get blog, check views
curl "http://localhost:5000/api/blogs/ID" | jq '.data.views'

# Access again
curl "http://localhost:5000/api/blogs/ID" | jq '.data.views'
# Should increment
```

### Verify Comment Addition
```bash
curl -X POST "http://localhost:5000/api/blogs/ID/comments" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test"}' | jq '.data.commentsList'
```

---

## Production Checklist

- [ ] Set JWT_SECRET in .env
- [ ] Configure MONGO_URI
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Monitor error logs
- [ ] Set up database backups
- [ ] Test all endpoints
- [ ] Document API for clients
- [ ] Set up API monitoring
- [ ] Configure caching strategy

---

## Related Documentation

- [Full API Documentation](./BLOG_API.md)
- [Testing Guide](./BLOG_TESTING.md)
- [Auth System](./AUTH_README.md)
