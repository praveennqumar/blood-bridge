import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import { getCurrentUser, getStoredUser } from '../services/userService';
import { getUserDisplayName, getUserRole } from '../utils/userUtils';
import { APP_CONFIG } from '../constants/appConstants';

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get cached user first for faster initial render
        const cachedUser = getStoredUser();
        if (cachedUser) {
          setUser(cachedUser);
        }

        // Fetch fresh user data
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        } else if (!cachedUser) {
          setError('Unable to load user data. Please try refreshing the page.');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('An error occurred while loading your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading your profile..." />
      </Layout>
    );
  }

  if (error && !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section with Application Icon */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* Application Icon */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-full p-4 shadow-lg">
                {!imageError ? (
                  <img
                    src={APP_CONFIG.LOGO_PATH}
                    alt={`${APP_CONFIG.NAME} Logo`}
                    className="h-20 w-20 object-contain"
                    onError={handleImageError}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-20 w-20 bg-red-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Welcome Message */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {getUserDisplayName(user)}!
              </h1>
              <p className="text-xl text-red-100 mb-4">
                Thank you for being part of our Blood Bank community
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Role: {getUserRole(user)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Information Card */}
        {user && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 font-medium">{user.phone}</p>
                </div>
              )}
              {user.address && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900 font-medium">{user.address}</p>
                </div>
              )}
              {user.website && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions or Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Donate Blood</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your donation can save up to three lives. Every drop counts!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">View Inventory</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Check available blood units and manage inventory efficiently.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Community</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Connect with donors, hospitals, and organizations in your area.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Homepage;