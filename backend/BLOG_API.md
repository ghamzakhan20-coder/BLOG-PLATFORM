# Blog CRUD API Documentation

## Overview

Complete Blog CRUD (Create, Read, Update, Delete) API with support for:
- Blog creation, reading, updating, and deletion
- Like/unlike functionality
- Comments and comment management
- Pagination and filtering
- Author-specific queries
- View counting

## Schema

### Blog Model
```javascript
{
  _id: ObjectId,
  title: String (max 200 chars, required),
  content: String (required),
  author: ObjectId (ref: User, required),
  likes: [ObjectId] (array of user IDs who liked),
  comments: [
    {
      user: ObjectId (ref: User),
      text: String (max 500 chars),
      createdAt: Date
    }
  ],
  published: Boolean (default: true),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Public Routes (No Authentication Required)

#### 1. Get All Blogs (Paginated)
```
GET /api/blogs
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blog_id",
      "title": "Blog Title",
      "content": "Blog content...",
      "author": {
        "id": "user_id",
        "name": "Author Name",
        "email": "author@example.com",
        "profileImage": "url"
      },
      "likes": 5,
      "comments": 3,
      "views": 42,
      "isLiked": false,
      "commentsList": [...],
      "createdAt": "2026-01-29T...",
      "updatedAt": "2026-01-29T..."
    }
  ],
  "pagination": {
    "total": 50,
    "pages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

---

#### 2. Get Single Blog by ID
```
GET /api/blogs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "blog_id",
    "title": "Blog Title",
    "content": "Blog content...",
    "author": {...},
    "likes": 5,
    "comments": 3,
    "views": 43,
    "isLiked": false,
    "commentsList": [
      {
        "user": {
          "id": "user_id",
          "name": "Commenter Name",
          "profileImage": "url"
        },
        "text": "Great blog!",
        "createdAt": "2026-01-29T..."
      }
    ],
    "createdAt": "2026-01-29T...",
    "updatedAt": "2026-01-29T..."
  }
}
```

---

#### 3. Get Blogs by Author
```
GET /api/blogs/author/:authorId
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blog_id",
      "title": "Blog Title",
      ...
    }
  ],
  "pagination": {...}
}
```

---

### Authenticated Routes (Require Login)

#### 4. Create Blog
```
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Blog Title",
  "content": "This is the blog content..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "new_blog_id",
    "title": "My Blog Title",
    "content": "This is the blog content...",
    "author": {
      "id": "user_id",
      "name": "Your Name",
      "email": "your@email.com"
    },
    "likes": 0,
    "comments": 0,
    "views": 0,
    "createdAt": "2026-01-29T...",
    "updatedAt": "2026-01-29T..."
  }
}
```

**Note:** Only admins can create blogs. Regular users attempting to create will receive a 403 Forbidden error.

---

#### 5. Update Blog
```
PUT /api/blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "published": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "id": "blog_id",
    "title": "Updated Title",
    ...
  }
}
```

**Authorization:**
- Blog author can update their own blogs
- Admins can update any blog

---

#### 6. Delete Blog
```
DELETE /api/blogs/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

**Authorization:**
- Blog author can delete their own blogs
- Admins can delete any blog

---

### Like Routes

#### 7. Like a Blog
```
POST /api/blogs/:id/like
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog liked successfully",
  "data": {
    "likes": 6
  }
}
```

---

#### 8. Unlike a Blog
```
DELETE /api/blogs/:id/like
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog unliked successfully",
  "data": {
    "likes": 5
  }
}
```

---

### Comment Routes

#### 9. Add Comment to Blog
```
POST /api/blogs/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This is a great blog post!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": "blog_id",
    "comments": 4,
    "commentsList": [
      {
        "user": {
          "id": "user_id",
          "name": "Your Name",
          "profileImage": "url"
        },
        "text": "This is a great blog post!",
        "createdAt": "2026-01-29T..."
      }
    ]
  }
}
```

---

#### 10. Delete Comment
```
DELETE /api/blogs/:id/comments/:commentId
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": {
    "comments": 3
  }
}
```

**Authorization:**
- Comment author can delete their own comments
- Blog author can delete any comment on their blog
- Admins can delete any comment

---

#### 11. Get User's Own Blogs
```
GET /api/blogs/user/my-blogs
Authorization: Bearer <token>
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blog_id",
      "title": "My Blog",
      "content": "...",
      "author": {...},
      "likes": 5,
      "comments": 2,
      "views": 30,
      "published": true,
      "createdAt": "2026-01-29T...",
      "updatedAt": "2026-01-29T..."
    }
  ],
  "pagination": {...}
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide title and content"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this blog"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Blog not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Usage Examples

### JavaScript/Fetch

#### Get All Blogs
```javascript
async function getAllBlogs(page = 1, limit = 10) {
  const response = await fetch(`http://localhost:5000/api/blogs?page=${page}&limit=${limit}`);
  const data = await response.json();
  return data;
}
```

#### Create Blog (Admin Only)
```javascript
async function createBlog(title, content) {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  });
  
  const data = await response.json();
  return data;
}
```

#### Like Blog
```javascript
async function likeBlog(blogId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api/blogs/${blogId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
}
```

#### Add Comment
```javascript
async function addComment(blogId, text) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api/blogs/${blogId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  
  const data = await response.json();
  return data;
}
```

#### Update Blog
```javascript
async function updateBlog(blogId, title, content, published) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, content, published })
  });
  
  const data = await response.json();
  return data;
}
```

#### Delete Blog
```javascript
async function deleteBlog(blogId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
}
```

### cURL Examples

#### Get All Blogs
```bash
curl -X GET "http://localhost:5000/api/blogs?page=1&limit=10"
```

#### Create Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Amazing Blog",
    "content": "This is the blog content..."
  }'
```

#### Like Blog
```bash
curl -X POST "http://localhost:5000/api/blogs/BLOG_ID/like" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Add Comment
```bash
curl -X POST "http://localhost:5000/api/blogs/BLOG_ID/comments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Great blog!"}'
```

#### Update Blog
```bash
curl -X PUT "http://localhost:5000/api/blogs/BLOG_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content..."
  }'
```

#### Delete Blog
```bash
curl -X DELETE "http://localhost:5000/api/blogs/BLOG_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Features

### View Counting
- Automatically increments view count when a blog is accessed
- View count doesn't increase for the blog author viewing their own blog
- Used for tracking blog popularity

### Like System
- Users can like/unlike blogs
- Like count is aggregated and returned in responses
- Users can only like a blog once

### Comment System
- Users can add comments to blogs
- Each comment has author info and timestamp
- Only comment author, blog author, or admin can delete comments
- Comments are embedded within the blog document
- Maximum 500 characters per comment

### Pagination
- All list endpoints support pagination
- Default limit: 10 items per page
- Returns total count, pages, current page
- Useful for infinite scroll or page-based navigation

### Author-Specific Queries
- Get all published blogs by a specific author
- Users can view their own unpublished blogs
- Blogs are sorted by creation date (newest first)

### Published/Draft Status
- Blogs can be published or unpublished (draft)
- Only published blogs appear in public listings
- Authors can see their own draft blogs
- Admins can see all blogs regardless of status

---

## Authorization

### Blog Operations
| Operation | Admin | Author | Other User |
|-----------|-------|--------|-----------|
| Create | ✅ | ❌ | ❌ |
| Read Public | ✅ | ✅ | ✅ |
| Read Own | ✅ | ✅ | ❌ |
| Update | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ❌ |

### Like/Comment Operations
| Operation | Admin | Author | Other User |
|-----------|-------|--------|-----------|
| Like | ✅ | ✅ | ✅ |
| Comment | ✅ | ✅ | ✅ |
| Delete Own Comment | ✅ | ✅ | ✅ |
| Delete Others' Comment | ✅ | ✅ (on their blog) | ❌ |

---

## Best Practices

1. **Always include Authorization header** for protected routes:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

2. **Validate input** before sending:
   - Title: required, 1-200 characters
   - Content: required, any length
   - Comment text: 1-500 characters

3. **Handle pagination** for large datasets:
   - Use reasonable page limits
   - Don't fetch all blogs at once

4. **Cache responses** where appropriate:
   - Blog content rarely changes frequently
   - Consider caching list responses

5. **Handle errors gracefully**:
   - Check response.success before using data
   - Display appropriate user messages

---

## Testing Checklist

- [ ] Create blog as admin
- [ ] Try creating blog as regular user (should fail)
- [ ] Get all blogs (public endpoint)
- [ ] Get single blog and verify views increment
- [ ] Update your own blog
- [ ] Try updating someone else's blog (should fail)
- [ ] Like a blog
- [ ] Unlike a blog
- [ ] Add comment to blog
- [ ] Delete your comment
- [ ] Try deleting someone else's comment (should fail)
- [ ] Get your own blogs
- [ ] Get blogs by specific author
- [ ] Test pagination

---

## Performance Tips

1. **Indexes** are set up on:
   - `author` + `createdAt` (for author queries)
   - `published` + `createdAt` (for public listings)

2. **Projections** are used to:
   - Return only needed user fields in responses
   - Reduce response payload size

3. **Pagination** limits:
   - Default 10 items per page
   - Max recommended: 50 items per page

---

## Future Enhancements

- [ ] Blog categories/tags
- [ ] Search functionality
- [ ] Draft/schedule publish
- [ ] Rich text editor support
- [ ] Blog statistics/analytics
- [ ] Recommended blogs
- [ ] Follower system
- [ ] Notifications for comments
- [ ] Blog sharing metrics
