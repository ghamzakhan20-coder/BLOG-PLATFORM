'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-white font-bold text-xl md:text-2xl">
              Blog<span className="text-purple-400">Platform</span>
            </div>
            <div className="flex gap-2 md:gap-4">
              <Link
                href="/blogs"
                className="px-3 md:px-4 py-2 text-sm md:text-base text-white hover:text-purple-400 transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/login/user"
                className="px-3 md:px-4 py-2 text-sm md:text-base text-white hover:text-purple-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login/user?signup=true"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm md:text-base font-medium transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-6xl mx-auto text-center">
          {/* Main Hero */}
          <div className="mb-16 md:mb-20">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">Stories</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Welcome to BlogPlatform - Where writers and readers connect. Create engaging content, discover amazing stories, and build your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blogs"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Explore Blogs
              </Link>
              <Link
                href="/login/user?signup=true"
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all border border-slate-600 hover:border-slate-500"
              >
                Start Writing
              </Link>
            </div>
          </div>

          {/* Login Options Grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20">
            {/* Reader Card */}
            <div
              className="group"
              onMouseEnter={() => setHoveredCard('user')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105">
                  <div className="bg-slate-900 rounded-2xl h-full"></div>
                </div>

                {/* Card Content */}
                <div className="relative bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-10 transform transition-all duration-300 group-hover:border-blue-500/50">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Discover & Read</h2>

                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Explore amazing blog posts from writers worldwide. Like, comment, and engage with content you love.
                  </p>

                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Access 1000+ quality blogs
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Like & comment on posts
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Follow your favorite authors
                    </li>
                  </ul>

                  <div className="space-y-3">
                    <Link
                      href="/blogs"
                      className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Start Reading
                    </Link>
                    <Link
                      href="/login/user?signup=true"
                      className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Writer Card */}
            <div
              className="group"
              onMouseEnter={() => setHoveredCard('writer')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105">
                  <div className="bg-slate-900 rounded-2xl h-full"></div>
                </div>

                {/* Card Content */}
                <div className="relative bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-10 transform transition-all duration-300 group-hover:border-purple-500/50">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Create & Publish</h2>

                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Share your thoughts and stories with the world. Build your audience and become a recognized author.
                  </p>

                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Create unlimited blogs
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Edit blogs inline while reading
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Track likes and comments
                    </li>
                  </ul>

                  <div className="space-y-3">
                    <Link
                      href="/login/user?signup=true"
                      className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Start Writing
                    </Link>
                    <Link
                      href="/blogs"
                      className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500"
                    >
                      Explore Blogs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Instant publishing and real-time updates with zero lag</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Fully Secure</h3>
            <p className="text-gray-400 text-sm">Enterprise-grade encryption and privacy protection</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-400 text-sm">Intuitive interface designed for everyone</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              1000+
            </div>
            <p className="text-gray-400">Active Blogs</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2">
              500+
            </div>
            <p className="text-gray-400">Community Members</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
              10K+
            </div>
            <p className="text-gray-400">Monthly Readers</p>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
          <p className="text-gray-300 text-lg mb-8">Start sharing your stories or discover amazing content today. No credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login/user?signup=true"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Join Now - It's Free
            </Link>
            <Link
              href="/blogs"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all border border-slate-600 hover:border-slate-500"
            >
              Explore Blogs
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
}
