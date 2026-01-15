import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { logout } from '../services/userService';
import { APP_CONFIG } from '../constants/appConstants';

const Header = ({ navItems = [], showLogout = true }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            {imageError ? (
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">B</span>
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
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </a>
            ))}

            {/* Logout Button */}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
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
};

export default Header;

