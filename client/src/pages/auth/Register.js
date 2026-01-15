import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    website: '',
    organisationName: '',
    hospitalName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.role) {
      toast.error('Please select a role');
      setLoading(false);
      return;
    }

    // Prepare data based on role
    const submitData = {
      role: formData.role,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      phone: formData.phone,
    };

    // Add role-specific fields
    if (formData.role === 'donar' || formData.role === 'admin') {
      if (!formData.name) {
        toast.error('Name is required for this role');
        setLoading(false);
        return;
      }
      submitData.name = formData.name;
    }

    if (formData.role === 'organisation') {
      if (!formData.organisationName) {
        toast.error('Organisation name is required');
        setLoading(false);
        return;
      }
      submitData.organisationName = formData.organisationName;
    }

    if (formData.role === 'hospital') {
      if (!formData.hospitalName) {
        toast.error('Hospital name is required');
        setLoading(false);
        return;
      }
      submitData.hospitalName = formData.hospitalName;
    }

    // Add website if provided
    if (formData.website) {
      submitData.website = formData.website;
    }

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Registration successful! Redirecting to login...');
        // Registration successful, redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        toast.error('Cannot connect to server. Please make sure the backend server is running on port 4040.');
      } else {
        toast.error('Network error. Please try again later.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNameField = formData.role === 'donar' || formData.role === 'admin';
  const showOrganisationName = formData.role === 'organisation';
  const showHospitalName = formData.role === 'hospital';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Bank</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
              >
                <option value="">Choose your role</option>
                <option value="donar">Donor</option>
                <option value="admin">Admin</option>
                <option value="organisation">Organisation</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>

            {/* Name Field (for Donor and Admin) */}
            {showNameField && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Organisation Name Field */}
            {showOrganisationName && (
              <div>
                <label
                  htmlFor="organisationName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Organisation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="organisationName"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter organisation name"
                />
              </div>
            )}

            {/* Hospital Name Field */}
            {showHospitalName && (
              <div>
                <label
                  htmlFor="hospitalName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hospitalName"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter hospital name"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your password (min. 6 characters)"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                placeholder="Enter your address"
              />
            </div>

            {/* Website Field (Optional) */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Website (Optional)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="https://example.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-red-600 hover:text-red-500 transition-colors"
              >
                Sign in
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

export default Register;
