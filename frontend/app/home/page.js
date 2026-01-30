'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login/user');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchBlogs(token);
  }, [router]);

  const fetchBlogs = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBlogs(data.data?.slice(0, 6) || []);
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
    router.push('/login/user');
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

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/home" className="text-white font-bold text-xl md:text-2xl">
              Blog<span className="text-purple-400">Platform</span>
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
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{user?.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {isAdmin ? 'Manage your content and connect with your readers' : 'Discover amazing content and connect with writers'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link
            href="/blogs"
            className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Explore Blogs</h3>
            <p className="text-gray-400 text-sm">Discover new stories</p>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/create"
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Create Blog</h3>
              <p className="text-gray-400 text-sm">Write new content</p>
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Dashboard</h3>
              <p className="text-gray-400 text-sm">View analytics</p>
            </Link>
          )}

          {!isAdmin && (
            <Link
              href="/login/user?signup=true"
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Start Writing</h3>
              <p className="text-gray-400 text-sm">Share your story</p>
            </Link>
          )}
        </div>

        {/* Featured Blogs Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {isAdmin ? 'Latest Blogs' : 'Featured Blogs'}
            </h2>
            <Link
              href="/blogs"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-xl mb-4">No blogs yet</p>
              {isAdmin ? (
                <Link
                  href="/admin/create"
                  className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
                >
                  Create First Blog
                </Link>
              ) : (
                <Link
                  href="/blogs"
                  className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
                >
                  Explore Blogs
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`}>
                  <div className="group h-full bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="p-6 pb-4 border-b border-slate-700/50">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">{blog.author?.name || 'Anonymous'}</p>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                        {blog.content}
                      </p>

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

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Community Guidelines</h3>
            <p className="text-gray-300 mb-4">Help us maintain a positive and respectful community for all members.</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Be respectful and constructive in comments</li>
              <li>• No spam or self-promotion without context</li>
              <li>• Respect intellectual property rights</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Get Started Tips</h3>
            <p className="text-gray-300 mb-4">Make the most of your blogging experience.</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• {isAdmin ? 'Create high-quality, engaging content' : 'Read and engage with diverse blogs'}</li>
              <li>• Use relevant tags and categories</li>
              <li>• Engage with the community regularly</li>
              <li>• Check your notifications often</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
