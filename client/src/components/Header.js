import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { logout } from '../services/userService';
import { APP_CONFIG } from '../constants/appConstants';
import { getUserDisplayName, getUserRole } from '../utils/userUtils';

const Header = ({ navItems = [], showLogout = true, user = null }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = getUserDisplayName(user);
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const roleLabel = getUserRole(user);
  const displayName = getUserDisplayName(user);

  // Role badge color map
  const roleBadgeColor = {
    Admin: 'bg-purple-100 text-purple-700',
    Donar: 'bg-red-100 text-red-700',
    Organisation: 'bg-blue-100 text-blue-700',
    Hospital: 'bg-green-100 text-green-700',
  };
  const badgeClass = roleBadgeColor[roleLabel] || 'bg-gray-100 text-gray-700';

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            {imageError ? (
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">B</span>
              </div>
            ) : (
              <img
                src={APP_CONFIG.LOGO_PATH}
                alt={`${APP_CONFIG.NAME} Logo`}
                className="h-10 w-10 object-contain"
                onError={() => setImageError(true)}
              />
            )}
            <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.NAME}</h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* User Avatar + Dropdown */}
            {showLogout && (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="user-avatar-btn"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {getInitials()}
                </button>

                {/* Dropdown Panel */}
                {dropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    style={{
                      animation: 'fadeSlideDown 0.18s ease-out',
                    }}
                  >
                    {/* Header gradient strip */}
                    <div className="bg-gradient-to-r from-red-500 to-red-700 px-5 py-4">
                      <div className="flex items-center space-x-3">
                        {/* Large avatar */}
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border-2 border-white/40 flex-shrink-0">
                          {getInitials()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {displayName}
                          </p>
                          {user?.email && (
                            <p className="text-red-100 text-xs truncate mt-0.5">
                              {user.email}
                            </p>
                          )}
                          {roleLabel && (
                            <span
                              className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/25 text-white`}
                            >
                              {roleLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="px-5 py-3 space-y-2 border-b border-gray-100">
                      {user?.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user?.address && (
                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="leading-snug">{user.address}</span>
                        </div>
                      )}
                      {user?.website && (
                        <div className="flex items-center space-x-2 text-sm">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:underline truncate"
                          >
                            {user.website}
                          </a>
                        </div>
                      )}
                      {/* Role badge row */}
                      {roleLabel && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
                            {roleLabel}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="px-3 py-2">
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                      >
                        <svg
                          className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Dropdown animation keyframes */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

Header.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
  showLogout: PropTypes.bool,
  user: PropTypes.object,
};

export default Header;
