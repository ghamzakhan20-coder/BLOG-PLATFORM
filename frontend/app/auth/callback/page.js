'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get token and user from URL parameters
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    // Handle error case
    if (error) {
      console.error('Authentication error:', error);
      alert('Login failed: ' + error);
      router.push('/login');
      return;
    }

    // Handle success case
    if (token && userParam) {
      try {
        // Parse user data from URL
        const userData = JSON.parse(decodeURIComponent(userParam));

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('Login successful!', userData);

        // Redirect to home page
        router.push('/');
      } catch (err) {
        console.error('Error parsing user data:', err);
        alert('Something went wrong. Please try again.');
        router.push('/login');
      }
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">🔄 Logging you in...</h2>
        <p className="text-gray-600">Please wait a moment...</p>
      </div>
    </div>
  );
}
