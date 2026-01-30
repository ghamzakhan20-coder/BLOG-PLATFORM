const Blog = require('../models/Blog');
const User = require('../models/User');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private (Admin only)
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    }

    // Create blog
    const blog = new Blog({
      title,
      content,
      author: req.user._id,
    });

    await blog.save();

    // Populate author
    await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        author: blog.author,
        likes: blog.getLikeCount(),
        comments: blog.getCommentCount(),
        views: blog.views,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ published: true })
      .populate('author', 'name email profileImage')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ published: true });

    const blogsWithMetadata = blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
      likes: blog.getLikeCount(),
      comments: blog.getCommentCount(),
      views: blog.views,
      isLiked: req.user ? blog.isLikedBy(req.user._id) : false,
      commentsList: blog.comments,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: blogsWithMetadata,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email profileImage')
      .populate('comments.user', 'name profileImage')
      .populate('likes', 'name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment view count
    if (!req.user || !blog.author || blog.author._id.toString() !== req.user._id.toString()) {
      blog.views += 1;
      await blog.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        author: blog.author,
        likes: blog.getLikeCount(),
        comments: blog.getCommentCount(),
        views: blog.views,
        isLiked: req.user ? blog.isLikedBy(req.user._id) : false,
        commentsList: blog.comments,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Author or Admin only)
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check authorization - author or admin can update
    if (!blog.author || (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this blog' });
    }

    const { title, content, published } = req.body;

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (typeof published === 'boolean') blog.published = published;

    await blog.save();

    // Populate author
    await blog.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        author: blog.author,
        likes: blog.getLikeCount(),
        comments: blog.getCommentCount(),
        published: blog.published,
        views: blog.views,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Author or Admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check authorization - author or admin can delete
    if (!blog.author || (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
// @access  Private
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const userId = req.user._id;

    // Check if already liked
    if (blog.isLikedBy(userId)) {
      return res.status(400).json({ success: false, message: 'You already liked this blog' });
    }

    blog.likes.push(userId);
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog liked successfully',
      data: {
        likes: blog.getLikeCount(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unlike a blog
// @route   DELETE /api/blogs/:id/like
// @access  Private
exports.unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const userId = req.user._id;

    // Check if not liked
    if (!blog.isLikedBy(userId)) {
      return res.status(400).json({ success: false, message: 'You have not liked this blog' });
    }

    blog.likes = blog.likes.filter((like) => like.toString() !== userId.toString());
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog unliked successfully',
      data: {
        likes: blog.getLikeCount(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide comment text' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    // Populate the new comment with user info
    await blog.populate('comments.user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        id: blog._id,
        comments: blog.getCommentCount(),
        commentsList: blog.comments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment from blog
// @route   DELETE /api/blogs/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = blog.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check authorization - comment author or blog author or admin can delete
    if (
      comment.user._id.toString() !== req.user._id.toString() &&
      (!blog.author || blog.author._id.toString() !== req.user._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    blog.comments.id(req.params.commentId).deleteOne();
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: {
        comments: blog.getCommentCount(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get blogs by author
// @route   GET /api/blogs/author/:authorId
// @access  Public
exports.getBlogsByAuthor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({
      author: req.params.authorId,
      published: true,
    })
      .populate('author', 'name email profileImage')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({
      author: req.params.authorId,
      published: true,
    });

    const blogsWithMetadata = blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
      likes: blog.getLikeCount(),
      comments: blog.getCommentCount(),
      views: blog.views,
      isLiked: req.user ? blog.isLikedBy(req.user._id) : false,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: blogsWithMetadata,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
exports.getMyBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ author: req.user._id })
      .populate('author', 'name email profileImage')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ author: req.user._id });

    const blogsWithMetadata = blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
      likes: blog.getLikeCount(),
      comments: blog.getCommentCount(),
      views: blog.views,
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: blogsWithMetadata,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
