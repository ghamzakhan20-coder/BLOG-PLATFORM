const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  addComment,
  deleteComment,
  getBlogsByAuthor,
  getMyBlogs,
} = require('../controllers/blogController');
const { auth, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/author/:authorId', getBlogsByAuthor);
router.get('/:id', getBlogById);

// Private routes (require authentication)
router.post('/', auth, authorize('admin'), createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

// Like/Unlike routes
router.post('/:id/like', auth, likeBlog);
router.delete('/:id/like', auth, unlikeBlog);

// Comment routes
router.post('/:id/comments', auth, addComment);
router.delete('/:id/comments/:commentId', auth, deleteComment);

// User's own blogs
router.get('/user/my-blogs', auth, getMyBlogs);

module.exports = router;
