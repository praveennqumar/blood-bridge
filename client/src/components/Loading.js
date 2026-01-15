import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading Component
 * Displays a loading spinner with optional message
 * 
 * @param {string} message - Optional loading message
 * @param {string} size - Size of the loader (sm, md, lg)
 */
const Loading = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-3',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-5',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className={`loader ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {message} 
        </p>
      )}
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Loading;

