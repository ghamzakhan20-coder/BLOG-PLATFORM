# Blog Engagement Backend Implementation

## Overview

This guide shows how to implement the like, comment, and share functionality on the backend.

---

## 1. Blog Model Updates

Update your Blog model to support likes and comments:

```javascript
// src/models/Blog.js

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // New fields for engagement
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
```

---

## 2. Blog Controller - Like Functionality

Add like/unlike endpoints to your blog controller:

```javascript
// src/controllers/blogController.js

// Like a blog post
exports.likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.userId;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check if already liked
    if (blog.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already liked',
      });
    }

    // Add like
    blog.likes.push(userId);
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog liked successfully',
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Unlike a blog post
exports.unlikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.userId;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check if liked
    if (!blog.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Not liked yet',
      });
    }

    // Remove like
    blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString());
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Like removed successfully',
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
```

---

## 3. Blog Controller - Comment Functionality

Add comment endpoints:

```javascript
// Post a comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id || req.userId;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be less than 500 characters',
      });
    }

    const blog = await Blog.findById(id).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Get user details
    const user = await User.findById(userId);

    // Create comment object
    const comment = {
      text: text.trim(),
      author: userId,
      likes: [],
      createdAt: new Date(),
    };

    // Add comment to blog
    blog.comments.push(comment);
    await blog.save();

    // Populate author in response
    const newComment = blog.comments[blog.comments.length - 1];
    newComment.author = user;

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: {
        _id: newComment._id,
        text: newComment.text,
        author: { _id: user._id, name: user.name },
        likes: newComment.likes,
        createdAt: newComment.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user._id || req.userId;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is comment author
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Remove comment
    blog.comments.id(commentId).remove();
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
```

---

## 4. Blog Controller - Comment Likes

Add like/unlike for comments:

```javascript
// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user._id || req.userId;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if already liked
    if (comment.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already liked this comment',
      });
    }

    // Add like
    comment.likes.push(userId);
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Comment liked successfully',
      likes: comment.likes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Unlike a comment
exports.unlikeComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user._id || req.userId;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if liked
    if (!comment.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Not liked yet',
      });
    }

    // Remove like
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Like removed successfully',
      likes: comment.likes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
```

---

## 5. Blog Routes

Add routes for all engagement features:

```javascript
// src/routes/blogRoutes.js

const express = require('express');
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ... existing routes ...

// Like/Unlike endpoints
router.post('/:id/like', protect, blogController.likeBlog);
router.post('/:id/unlike', protect, blogController.unlikeBlog);

// Comment endpoints
router.post('/:id/comments', protect, blogController.addComment);
router.delete('/:id/comments/:commentId', protect, blogController.deleteComment);

// Comment like endpoints
router.post('/:id/comments/:commentId/like', protect, blogController.likeComment);
router.post('/:id/comments/:commentId/unlike', protect, blogController.unlikeComment);

module.exports = router;
```

---

## 6. Update Blog Retrieval

Make sure your blog detail endpoint populates related data:

```javascript
// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate('author', 'name email avatar')
      .populate('likes', 'name email')
      .populate('comments.author', 'name email avatar')
      .populate('comments.likes', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
```

---

## 7. Middleware Setup

Ensure your auth middleware properly extracts user ID:

```javascript
// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    // Optional: Fetch full user object
    const user = await User.findById(decoded.id);
    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
```

---

## 8. Request/Response Examples

### Like a Blog
```javascript
POST /api/blogs/123abc/like
Authorization: Bearer token123

Response 200:
{
  success: true,
  message: "Blog liked successfully",
  blog: {
    _id: "123abc",
    title: "...",
    likes: ["userId1", "userId2", "userId3"],
    ...
  }
}
```

### Post Comment
```javascript
POST /api/blogs/123abc/comments
Authorization: Bearer token123
Content-Type: application/json

{
  "text": "Great blog post!"
}

Response 201:
{
  success: true,
  message: "Comment added successfully",
  comment: {
    _id: "456def",
    text: "Great blog post!",
    author: {
      _id: "userId",
      name: "John Doe"
    },
    likes: [],
    createdAt: "2024-01-29T10:00:00Z"
  }
}
```

### Delete Comment
```javascript
DELETE /api/blogs/123abc/comments/456def
Authorization: Bearer token123

Response 200:
{
  success: true,
  message: "Comment deleted successfully"
}
```

### Like a Comment
```javascript
POST /api/blogs/123abc/comments/456def/like
Authorization: Bearer token123

Response 200:
{
  success: true,
  message: "Comment liked successfully",
  likes: ["userId1", "userId2"]
}
```

---

## 🔐 Security Considerations

### Authorization Checks
```javascript
// Only blog author can edit/delete
if (blog.author.toString() !== userId.toString()) {
  return res.status(403).json({ success: false });
}

// Only comment author can delete
if (comment.author.toString() !== userId.toString()) {
  return res.status(403).json({ success: false });
}
```

### Input Validation
```javascript
// Validate comment text
if (!text || text.trim().length === 0) {
  return res.status(400).json({ success: false });
}

if (text.length > 500) {
  return res.status(400).json({ success: false });
}
```

### Prevent Duplicate Likes
```javascript
// Check if already liked
if (blog.likes.includes(userId)) {
  return res.status(400).json({ success: false });
}
```

---

## 🚀 Testing with Postman

### Test Like Endpoint
```
POST http://localhost:5000/api/blogs/123abc/like
Headers:
  Authorization: Bearer token123
```

### Test Comment Endpoint
```
POST http://localhost:5000/api/blogs/123abc/comments
Headers:
  Authorization: Bearer token123
Body:
  { "text": "Great post!" }
```

### Test Comment Like Endpoint
```
POST http://localhost:5000/api/blogs/123abc/comments/456def/like
Headers:
  Authorization: Bearer token123
```

---

## 📋 Checklist

Backend implementation checklist:

- [ ] Update Blog model with likes and comments
- [ ] Create like/unlike endpoints
- [ ] Create add comment endpoint
- [ ] Create delete comment endpoint
- [ ] Create comment like/unlike endpoints
- [ ] Update blog retrieval to populate data
- [ ] Add authorization checks
- [ ] Add input validation
- [ ] Test all endpoints
- [ ] Verify with frontend

---

**Status:** Ready to Implement ⏳
**Estimated Time:** 2-3 hours
**Difficulty:** Moderate

See [BACKEND_API_SETUP.md](../../backend/BACKEND_API_SETUP.md) for more backend implementation details.
