import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import ErrorBoundary from './ErrorBoundary';

/**
 * Layout Component
 * Main layout wrapper that provides consistent structure across the application
 * Includes Header, Content area, and Footer with error boundary protection
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered
 * @param {Array} props.navItems - Optional navigation items for header
 * @param {Array} props.footerLinks - Optional links for footer
 * @param {boolean} props.showLogout - Whether to show logout button in header
 * @param {boolean} props.fullWidth - Whether content should be full width
 * @param {string} props.contentClassName - Additional CSS classes for content
 */
const Layout = ({
  children,
  navItems = [],
  footerLinks = [],
  showLogout = true,
  fullWidth = false,
  contentClassName = '',
}) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50" style={{ height: 'auto', maxHeight: 'none' }}>
        <Header navItems={navItems} showLogout={showLogout} />
        <Content fullWidth={fullWidth} className={contentClassName}>
          {children}
        </Content>
        <Footer links={footerLinks} />
      </div>
    </ErrorBoundary>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
  footerLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      external: PropTypes.bool,
    })
  ),
  showLogout: PropTypes.bool,
  fullWidth: PropTypes.bool,
  contentClassName: PropTypes.string,
};

export default Layout;
