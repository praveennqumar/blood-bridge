import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { APP_CONFIG } from '../constants/appConstants';

/**
 * Footer Component
 * Application footer with copyright and branding information
 * 
 * @param {Object} props - Component props
 * @param {Array} props.links - Optional footer links
 */
const Footer = ({ links = [] }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright Section */}
          <div className="flex items-center space-x-2">
            {!imageError ? (
              <img
                src={APP_CONFIG.LOGO_PATH}
                alt={`${APP_CONFIG.NAME} Logo`}
                className="h-6 w-6 object-contain"
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="h-6 w-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
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
            <p className="text-sm text-gray-600">
              © {APP_CONFIG.COPYRIGHT_YEAR} {APP_CONFIG.NAME}. All rights reserved.
            </p>
          </div>

          {/* Links Section */}
          {links.length > 0 && (
            <div className="flex items-center space-x-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))} 
            </div>
          )}

          {/* Tagline */}
          <div className="text-sm text-gray-600">
            <p>{APP_CONFIG.TAGLINE}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      external: PropTypes.bool,
    })
  ),
};

export default Footer;

