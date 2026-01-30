'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateBlog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
  }, [router]);

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
    setIsLoading(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
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
        setError(data.message || 'Failed to create blog');
        setIsLoading(false);
        return;
      }

      // Redirect to the new blog
      router.push(`/blogs/${data.data.id}`);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  };

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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create New <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Blog Post</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Share your thoughts and insights with our community
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-12">
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

            {/* Info Box */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 9a1 1 0 000-2 1 1 0 000 2zm5-1a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-purple-300 text-sm font-medium">Tip</p>
                  <p className="text-purple-200/70 text-xs mt-1">
                    Write clear, engaging content. Use paragraphs and line breaks to improve readability.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? 'Publishing...' : 'Publish Blog'}
              </button>
              <Link
                href="/blogs"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 12a1 1 0 11-2 0 1 1 0 012 0zm5-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Best Practices
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>✓ Use descriptive, clear titles</li>
              <li>✓ Organize content with paragraphs</li>
              <li>✓ Proofread before publishing</li>
              <li>✓ Make your content engaging</li>
            </ul>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Publishing Guide
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>✓ Blog is published immediately</li>
              <li>✓ Visible to all users</li>
              <li>✓ Can be edited anytime</li>
              <li>✓ Community can comment and like</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
