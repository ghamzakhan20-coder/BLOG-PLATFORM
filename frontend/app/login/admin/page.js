'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const router = useRouter();
  const { login, error: authError, clearError, isAuthenticated, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    clearError();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password, true);

      if (result.success) {
        router.push('/home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-white hover:text-purple-400 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Auth Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Admin Badge */}
          <div className="flex justify-center mb-6">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <span className="text-white text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Admin Portal
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="text-2xl font-bold text-white">
                Blog<span className="text-purple-400">Platform</span>
              </div>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Sign in with your admin credentials to manage content</p>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-purple-300 text-sm font-medium">Secure Access</p>
                <p className="text-purple-200/70 text-xs mt-1">This portal is restricted to authorized administrators</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error || authError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white text-sm font-medium">Password</label>
                <Link href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Verifying...' : 'Sign In as Admin'}
            </button>
          </form>

          {/* Account Status */}
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Need Admin Access?</span>
              <br />
              Contact the platform administrator to request admin privileges.
            </p>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Not an admin?{' '}
              <Link href="/login/user" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign in as user
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18.338 5.431l-16.8 10.08a.75.75 0 01-.938-.744V5.933a.75.75 0 01.938-.745l16.8 10.08a.75.75 0 010 1.233z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-gray-400">
              <p className="font-medium mb-1">Security Notice</p>
              <p>Keep your admin credentials confidential. Never share your password with anyone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
