'use client';

import React, { useState, useEffect } from 'react';
import AuthFlow from '@/components/auth/AuthFlow';
import App from '@/components/App';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, you'd validate the token with the backend
      setIsAuthenticated(true);
      // Load user data from localStorage or API
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const handleAuthComplete = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <AuthFlow onAuthComplete={handleAuthComplete} />;
  }

  return (
    <main className="min-h-screen">
      {user && <App user={user} onLogout={handleLogout} />}
    </main>
  );
}
