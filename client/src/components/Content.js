import React from 'react';
import PropTypes from 'prop-types';

/**
 * Content Component
 * Main content wrapper with consistent styling and layout
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullWidth - Whether content should be full width
 */
const Content = ({ children, className = '', fullWidth = false }) => {
  const containerClass = fullWidth
    ? 'w-full'
    : 'max-w-7xl mx-auto w-full';

  return (
    <main className={`flex-1 ${containerClass} px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );
};

Content.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Content;

