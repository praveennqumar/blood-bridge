import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';


const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            toast.error('Please enter both email and new password');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            const data = await response.json();

            if (response.ok && data?.success) {
                toast.success(data.message || 'Password reset successful. You can now log in with your new password.');
                // Optionally clear fields
                setPassword('');
            } else {
                toast.error(data?.message || 'Failed to reset password. Please check your details and try again.');
            }
        } catch (err) {
            if (err.message === 'Failed to fetch') {
                toast.error('Cannot connect to server. Please make sure the backend server is running on port 4040.');
            } else {
                toast.error('An unexpected error occurred. Please try again later.');
            }
            console.error('Forgot password error:', err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full mx-auto">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                        <svg
                            className="w-10 h-10 text-white"
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                    <p className="text-gray-600">
                        Enter your email and new password to reset your account.
                    </p>
                </div>

                {/* Forgot Password Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                name="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Enter your new password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Remembered your password?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-red-600 hover:text-red-500 transition-colors"
                            >
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    © 2026 Blood Bank. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;