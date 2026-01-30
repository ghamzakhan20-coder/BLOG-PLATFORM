# Blog API Testing Guide

## Test Scenario Setup

This guide assumes you have:
1. A running server at `http://localhost:5000`
2. Two user accounts:
   - Admin user for creating blogs
   - Regular user for testing comments/likes

## Step-by-Step Testing

### 1. Create Two Test Accounts

#### Register Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "AdminPass123!",
    "name": "Admin User"
  }'
```

Save the token as `ADMIN_TOKEN`

#### Register Regular User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "UserPass123!",
    "name": "Regular User"
  }'
```

Save the token as `USER_TOKEN`

**Note:** You'll need to manually set the admin user's role to 'admin' in MongoDB:
```bash
mongosh
use blog-platform
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

---

### 2. Create Blogs (Admin Only)

#### Create First Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Node.js",
    "content": "Node.js is a JavaScript runtime built on Chromes V8 JavaScript engine. In this blog, we will explore the basics of Node.js and how to get started with building applications."
  }'
```

Save the blog ID as `BLOG_ID_1`

#### Create Second Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding REST APIs",
    "content": "REST (Representational State Transfer) is an architectural style for designing networked applications. This article explains REST principles and best practices for building REST APIs."
  }'
```

Save the blog ID as `BLOG_ID_2`

#### Try Creating as Regular User (Should Fail)
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "This Should Fail",
    "content": "Regular users cannot create blogs"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

---

### 3. Get All Blogs (Public)

#### Get First Page of Blogs
```bash
curl -X GET "http://localhost:5000/api/blogs?page=1&limit=10"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "BLOG_ID",
      "title": "Blog Title",
      "content": "...",
      "author": {...},
      "likes": 0,
      "comments": 0,
      "views": 0,
      "isLiked": false,
      "commentsList": [],
      "createdAt": "2026-01-29T...",
      "updatedAt": "2026-01-29T..."
    }
  ],
  "pagination": {
    "total": 2,
    "pages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

---

### 4. Get Single Blog (View Count Test)

#### First Read (Should increment views)
```bash
curl -X GET "http://localhost:5000/api/blogs/BLOG_ID_1"
```

Check that `views` is now 1

#### Second Read (Should increment views again)
```bash
curl -X GET "http://localhost:5000/api/blogs/BLOG_ID_1"
```

Check that `views` is now 2

**Note:** Views don't increment for the blog author

---

### 5. Like/Unlike Blog

#### Like a Blog
```bash
curl -X POST "http://localhost:5000/api/blogs/BLOG_ID_1/like" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog liked successfully",
  "data": {
    "likes": 1
  }
}
```

#### Try Liking Again (Should Fail)
```bash
curl -X POST "http://localhost:5000/api/blogs/BLOG_ID_1/like" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "You already liked this blog"
}
```

#### Unlike the Blog
```bash
curl -X DELETE "http://localhost:5000/api/blogs/BLOG_ID_1/like" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog unliked successfully",
  "data": {
    "likes": 0
  }
}
```

#### Try Unliking Again (Should Fail)
```bash
curl -X DELETE "http://localhost:5000/api/blogs/BLOG_ID_1/like" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "You have not liked this blog"
}
```

---

### 6. Add Comments

#### Add Comment
```bash
curl -X POST "http://localhost:5000/api/blogs/BLOG_ID_1/comments" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a great blog post! Very informative."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": "BLOG_ID_1",
    "comments": 1,
    "commentsList": [
      {
        "user": {
          "id": "USER_ID",
          "name": "Regular User",
          "profileImage": null
        },
        "text": "This is a great blog post! Very informative.",
        "createdAt": "2026-01-29T..."
      }
    ]
  }
}
```

Save the comment as `COMMENT_ID`

#### Add Another Comment
```bash
curl -X POST "http://localhost:5000/api/blogs/BLOG_ID_1/comments" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Thanks for sharing! Looking forward to more posts."
  }'
```

---

### 7. Delete Comment

#### Delete Own Comment (as comment author)
```bash
curl -X DELETE "http://localhost:5000/api/blogs/BLOG_ID_1/comments/COMMENT_ID" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": {
    "comments": 1
  }
}
```

---

### 8. Update Blog

#### Update as Author
```bash
curl -X PUT "http://localhost:5000/api/blogs/BLOG_ID_1" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Node.js - Updated",
    "content": "Updated content here..."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "id": "BLOG_ID_1",
    "title": "Getting Started with Node.js - Updated",
    ...
  }
}
```

#### Try Updating as Different User (Should Fail)
```bash
curl -X PUT "http://localhost:5000/api/blogs/BLOG_ID_1" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hacked Title",
    "content": "Hacked content"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Not authorized to update this blog"
}
```

---

### 9. Delete Blog

#### Delete as Author
```bash
curl -X DELETE "http://localhost:5000/api/blogs/BLOG_ID_2" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

#### Try Accessing Deleted Blog
```bash
curl -X GET "http://localhost:5000/api/blogs/BLOG_ID_2"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Blog not found"
}
```

---

### 10. Get Blogs by Author

#### Get Admin's Blogs
```bash
curl -X GET "http://localhost:5000/api/blogs/author/ADMIN_USER_ID"
```

Should return all published blogs by the admin user

#### Get With Pagination
```bash
curl -X GET "http://localhost:5000/api/blogs/author/ADMIN_USER_ID?page=1&limit=5"
```

---

### 11. Get User's Own Blogs

#### Get Own Blogs (includes drafts)
```bash
curl -X GET "http://localhost:5000/api/blogs/user/my-blogs" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Should return all blogs including unpublished ones

---

## Test Case Checklist

### Create Operations
- [x] Admin can create blog
- [x] Regular user cannot create blog
- [x] Required fields are validated

### Read Operations
- [x] Get all blogs returns paginated results
- [x] Get single blog by ID works
- [x] Get blogs by author works
- [x] Get user's own blogs works
- [x] View count increments on read (except for author)

### Update Operations
- [x] Author can update their blog
- [x] Regular user cannot update other's blog
- [x] Admin can update any blog
- [x] Partial updates work (title or content only)

### Delete Operations
- [x] Author can delete their blog
- [x] Regular user cannot delete other's blog
- [x] Admin can delete any blog

### Like Operations
- [x] User can like a blog
- [x] User cannot like same blog twice
- [x] User can unlike a blog
- [x] Cannot unlike if not liked

### Comment Operations
- [x] User can add comment
- [x] Comment text is required
- [x] Comment author can delete comment
- [x] Blog author can delete any comment
- [x] Admin can delete any comment
- [x] Comments are included in blog response

### Authorization
- [x] Public endpoints work without auth
- [x] Protected endpoints reject without token
- [x] Expired token is rejected
- [x] Invalid token is rejected

---

## Load Testing

### Create Multiple Blogs
```bash
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/blogs \
    -H "Authorization: Bearer ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"Blog $i\",
      \"content\": \"Content for blog $i\"
    }"
done
```

### Simulate Multiple Users
Test with different tokens from different user accounts

### Test Pagination
```bash
curl -X GET "http://localhost:5000/api/blogs?page=1&limit=5"
curl -X GET "http://localhost:5000/api/blogs?page=2&limit=5"
curl -X GET "http://localhost:5000/api/blogs?page=3&limit=5"
```

---

## Error Handling Tests

### Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Missing Content"
  }'
```

### Invalid Blog ID
```bash
curl -X GET "http://localhost:5000/api/blogs/invalid_id"
```

### Unauthorized Access
```bash
curl -X POST "http://localhost:5000/api/blogs/BLOG_ID/comments" \
  -H "Content-Type: application/json" \
  -d '{"text": "No token"}'
```

---

## Automation Script

Save as `test-blogs.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"
ADMIN_TOKEN="your_admin_token"
USER_TOKEN="your_user_token"

echo "=== Creating Blog ==="
BLOG_RESPONSE=$(curl -s -X POST $BASE_URL/blogs \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog",
    "content": "This is a test blog"
  }')

BLOG_ID=$(echo $BLOG_RESPONSE | jq -r '.data.id')
echo "Created blog: $BLOG_ID"

echo "=== Getting Blog ==="
curl -s -X GET "$BASE_URL/blogs/$BLOG_ID" | jq

echo "=== Liking Blog ==="
curl -s -X POST "$BASE_URL/blogs/$BLOG_ID/like" \
  -H "Authorization: Bearer $USER_TOKEN" | jq

echo "=== Adding Comment ==="
curl -s -X POST "$BASE_URL/blogs/$BLOG_ID/comments" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Great blog!"}' | jq

echo "=== Getting All Blogs ==="
curl -s -X GET "$BASE_URL/blogs" | jq '.pagination'

echo "=== Test Complete ==="
```

Make it executable and run:
```bash
chmod +x test-blogs.sh
./test-blogs.sh
```

---

## Performance Metrics

Test response times:
```bash
# Get all blogs (large dataset)
time curl -s -X GET "http://localhost:5000/api/blogs?limit=100" > /dev/null

# Get single blog
time curl -s -X GET "http://localhost:5000/api/blogs/BLOG_ID" > /dev/null

# Create blog
time curl -s -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test"}' > /dev/null
```

---

## Common Issues & Solutions

### "Blog not found" when it exists
- Check the blog ID format
- Verify the blog is published (for public endpoints)
- Check if blog was deleted

### Views not incrementing
- Views don't increment for blog author
- Try accessing with different user

### Can't create blog as admin
- Verify user role is set to 'admin' in MongoDB
- Check authorization header is correct

### Comments not showing
- Ensure blog exists
- Check if blog is published
- Try refreshing the blog data

