// frontend/app/admin/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
    fetchAdminBlogs(token);
  }, [router]);

  const fetchAdminBlogs = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/user/my-blogs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBlogs(data.data || []);
      } else {
        setError(data.message || 'Failed to load blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login/admin');
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin/dashboard" className="text-white font-bold text-xl md:text-2xl">
              Admin<span className="text-purple-400">Dashboard</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm md:text-base hidden sm:inline">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white hover:text-purple-400 transition-colors text-sm md:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{user?.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">Manage your blog content and engage with your audience</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/admin/create"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 inline-block text-center"
          >
            Create New Blog
          </Link>
          <Link
            href="/blogs"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors inline-block text-center"
          >
            View All Blogs
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Blogs Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Your Blogs
          </h2>

          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-xl mb-4">No blogs yet. Create your first blog!</p>
              <Link
                href="/admin/create"
                className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
              >
                Create Blog
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`}>
                  <div className="group h-full bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    {/* Blog Header */}
                    <div className="p-6 pb-4 border-b border-slate-700/50">
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {blog.published ? (
                          <span className="text-green-400">✓ Published</span>
                        ) : (
                          <span className="text-yellow-400">⚠ Draft</span>
                        )}
                      </p>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-4">
                        {blog.content}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-400 border-t border-slate-700/50 pt-4">
                        <div className="flex gap-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {blog.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            {blog.comments || 0}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
