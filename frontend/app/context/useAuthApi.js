'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export function useAuthApi() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(
    async (endpoint, options = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000${endpoint}`, {
          ...options,
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true, data };
      } catch (err) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const get = useCallback(
    (endpoint) => apiCall(endpoint, { method: 'GET' }),
    [apiCall]
  );

  const post = useCallback(
    (endpoint, body) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    [apiCall]
  );

  const put = useCallback(
    (endpoint, body) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    [apiCall]
  );

  const del = useCallback(
    (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
    [apiCall]
  );

  return {
    isLoading,
    error,
    apiCall,
    get,
    post,
    put,
    delete: del,
  };
}
