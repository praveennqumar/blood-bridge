import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  // Check if user is authenticated by checking for token in localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // Redirect to home if already authenticated
    return <Navigate to="/" replace />;
  }

  // Render the public component if not authenticated
  return children;
};

export default PublicRoute;

