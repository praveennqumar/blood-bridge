import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated by checking for token in localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;

