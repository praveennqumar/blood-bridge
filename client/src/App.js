import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from './pages/Homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ForgotPassword from './pages/auth/ForgotPassword';

// Organisation pages
import OrgDashboard from './pages/organisation/OrgDashboard';
import OrgInventory from './pages/organisation/OrgInventory';
import OrgDonorRequests from './pages/organisation/OrgDonorRequests';
import OrgHospitalRequests from './pages/organisation/OrgHospitalRequests';
import OrgCamps from './pages/organisation/OrgCamps';
import OrgReports from './pages/organisation/OrgReports';

/**
 * Main App Component
 * Root component that sets up routing and global error handling
 */
function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* General protected home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />

        {/* ── Organisation routes ── */}
        <Route
          path="/org/dashboard"
          element={
            <ProtectedRoute>
              <OrgDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/inventory"
          element={
            <ProtectedRoute>
              <OrgInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/donor-requests"
          element={
            <ProtectedRoute>
              <OrgDonorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/hospital-requests"
          element={
            <ProtectedRoute>
              <OrgHospitalRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/camps"
          element={
            <ProtectedRoute>
              <OrgCamps />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/reports"
          element={
            <ProtectedRoute>
              <OrgReports />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
}

export default App;
