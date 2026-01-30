'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlog() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login/admin');
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (parsedUser.role !== 'admin') {
      router.push('/blogs');
      return;
    }

    setUser(parsedUser);
    fetchBlog();
  }, [blogId, router]);

  const fetchBlog = async () => {
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

      setFormData({
        title: data.data.title,
        content: data.data.content,
      });
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to update blog');
        setIsSaving(false);
        return;
      }

      // Redirect back to the blog
      router.push(`/blogs/${blogId}`);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to delete blog');
        setIsSaving(false);
        return;
      }

      // Redirect to blogs
      router.push('/blogs');
    } catch (err) {
      setError(err.message || 'An error occurred');
      setIsSaving(false);
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
              href={`/blogs/${blogId}`}
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Blog Post</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Update your blog content and publish changes
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-12 mb-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Blog Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title for your blog..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-lg"
                required
              />
              <p className="text-gray-400 text-xs mt-2">
                {formData.title.length}/100 characters recommended
              </p>
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Blog Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog content here... You can use line breaks for paragraphs."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-vertical min-h-80"
                required
              ></textarea>
              <p className="text-gray-400 text-xs mt-2">
                {formData.content.length} characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/blogs/${blogId}`}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Delete Section */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-red-200/70 mb-6">
            Once you delete a blog post, there is no going back. Please be certain.
          </p>

          {deleteConfirm ? (
            <div className="space-y-4">
              <p className="text-red-300 font-semibold">Are you sure you want to delete this blog post?</p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {isSaving ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Delete Blog Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
