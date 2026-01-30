'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function BlogView() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id;

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [shareMenu, setShareMenu] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [commentLikes, setCommentLikes] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login/user');
      return;
    }

    setUser(JSON.parse(userData));
    
    if (blogId) {
      fetchBlog();
    }
  }, [blogId, router]);

  const fetchBlog = async () => {
    if (!blogId) {
      setError('Invalid blog ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to load blog');
        setIsLoading(false);
        return;
      }

      const blogData = data.data;
      setBlog(blogData);
      setComments(blogData.commentsList || []);
      setLikeCount(blogData.likes || 0);

      // Initialize comment likes
      const commentLikesMap = {};
      const likedCommentsMap = {};
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      blogData.commentsList?.forEach((comment) => {
        commentLikesMap[comment._id] = comment.likes?.length || 0;
        likedCommentsMap[comment._id] = comment.likes?.includes(currentUser._id) || false;
      });
      
      setCommentLikes(commentLikesMap);
      setLikedComments(likedCommentsMap);

      // Check if current user has liked blog
      setIsLiked(blogData.isLiked || false);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blogId) {
      console.error('Blog ID is undefined');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = isLiked
        ? `http://localhost:5000/api/blogs/${blogId}/unlike`
        : `http://localhost:5000/api/blogs/${blogId}/like`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!blogId) {
      console.error('Blog ID is undefined');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setIsSubmittingComment(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      const data = await response.json();

      if (data.success) {
        // Get the newly added comment (last one in the list)
        const newCommentObj = data.data.commentsList[data.data.commentsList.length - 1];
        if (newCommentObj) {
          newCommentObj.likes = [];
          setComments([...comments, newCommentObj]);
          setCommentLikes({ ...commentLikes, [newCommentObj._id]: 0 });
          setLikedComments({ ...likedComments, [newCommentObj._id]: false });
        }
        setNewComment('');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!blogId) {
      console.error('Blog ID is undefined');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = likedComments[commentId]
        ? `http://localhost:5000/api/blogs/${blogId}/comments/${commentId}/unlike`
        : `http://localhost:5000/api/blogs/${blogId}/comments/${commentId}/like`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const newLikedState = !likedComments[commentId];
        setLikedComments({ ...likedComments, [commentId]: newLikedState });
        setCommentLikes({
          ...commentLikes,
          [commentId]: newLikedState
            ? (commentLikes[commentId] || 0) + 1
            : Math.max((commentLikes[commentId] || 1) - 1, 0),
        });
      }
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!blogId) {
      console.error('Blog ID is undefined');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        const newCommentLikes = { ...commentLikes };
        const newLikedComments = { ...likedComments };
        delete newCommentLikes[commentId];
        delete newLikedComments[commentId];
        setCommentLikes(newCommentLikes);
        setLikedComments(newLikedComments);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit mode
      setIsEditMode(false);
    } else {
      // Enter edit mode
      setEditFormData({
        title: blog.title,
        content: blog.content,
      });
      setIsEditMode(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      alert('Title and content cannot be empty');
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editFormData.title,
          content: editFormData.content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBlog((prev) => ({
          ...prev,
          title: editFormData.title,
          content: editFormData.content,
        }));
        setIsEditMode(false);
        alert('Blog updated successfully');
      } else {
        alert(data.message || 'Failed to update blog');
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Error saving blog: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (platform) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;
    const title = blog.title;
    const text = `Check out this blog: ${title}`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(blogUrl);
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 2000);
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(blogUrl)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`,
          '_blank'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + blogUrl)}`;
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin">
          <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-6">{error || 'Blog not found'}</p>
          <Link href="/blogs" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/blogs" className="text-white font-bold text-xl md:text-2xl">
              Blog<span className="text-purple-400">Platform</span>
            </Link>
            <Link
              href="/blogs"
              className="text-white hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Blog Header */}
        <article className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-12">
          {/* Title */}
          {isEditMode ? (
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              placeholder="Blog Title"
              className="w-full text-4xl md:text-5xl font-bold text-white mb-6 leading-tight bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
            />
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>
          )}

          {/* Author & Metadata */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 pb-8 border-b border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {blog.author.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{blog.author.name}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {(user?._id === (blog.author?._id || blog.author) || user?.role === 'admin') && (
                <>
                  {isEditMode ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg text-sm transition-colors"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleEditToggle}
                        disabled={isSaving}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none my-8">
            {isEditMode ? (
              <textarea
                name="content"
                value={editFormData.content}
                onChange={handleEditChange}
                placeholder="Blog Content"
                rows={15}
                className="w-full text-gray-300 text-lg leading-relaxed bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 font-mono"
              />
            ) : (
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </p>
            )}
          </div>

          {/* Stats & Like */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6 border-t border-slate-700">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isLiked
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-700/50 text-gray-400 border border-slate-600 hover:border-slate-500'
                }`}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likeCount}</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-3.28l-4 4v-4z" />
                </svg>
                <span>{comments.length}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{blog.views || 0}</span>
              </div>
            </div>

            {/* Share Button */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShareMenu(!shareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-gray-400 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.589 12.938 10 12.502 10 12c0-.502-.411-.938-1.316-1.342m0 2.684a3 3 0 110-2.684m9.108-3.342C19.589 3.938 20 3.502 20 3c0-.502-.411-.938-1.316-1.342m0 2.684a3 3 0 110-2.684M9 19c-4.971 0-7.776-1.694-9-5m19-4c1.224 3.306 4.029 5 9 5" />
                </svg>
                Share
              </button>

              {/* Share Menu */}
              {shareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      handleShare('copy');
                      setShareMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-gray-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      handleShare('twitter');
                      setShareMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-gray-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                    </svg>
                    Twitter
                  </button>
                  <button
                    onClick={() => {
                      handleShare('facebook');
                      setShareMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-gray-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
                    </svg>
                    Facebook
                  </button>
                  <button
                    onClick={() => {
                      handleShare('linkedin');
                      setShareMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-gray-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    LinkedIn
                  </button>
                  <button
                    onClick={() => {
                      handleShare('email');
                      setShareMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-gray-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Share Message */}
          {shareMessage && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
              ✓ {shareMessage}
            </div>
          )}
        </article>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-8">Comments ({comments.length})</h2>

          {/* Comment Form */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 md:p-8 mb-8">
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                rows="4"
              ></textarea>
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {comment.author?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{comment.author?.name}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {user?._id === comment.author?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                            title="Delete comment"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">{comment.text}</p>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded transition-all text-sm ${
                        likedComments[comment._id]
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-700/30 text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill={likedComments[comment._id] ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{commentLikes[comment._id] || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
