const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ published: 1, createdAt: -1 });

// Method to get like count
blogSchema.methods.getLikeCount = function () {
  return this.likes.length;
};

// Method to get comment count
blogSchema.methods.getCommentCount = function () {
  return this.comments.length;
};

// Method to check if user likes the blog
blogSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((like) => like.toString() === userId.toString());
};

module.exports = mongoose.model('Blog', blogSchema);
