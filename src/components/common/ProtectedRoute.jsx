// ============================================
// ProtectedRoute Component
// ============================================
// Wraps routes that require authentication.
// Redirects to /login if the user is not logged in.
//
// Usage in App.jsx:
//   <Route path="/dashboard" element={
//     <ProtectedRoute><Dashboard /></ProtectedRoute>
//   } />
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking session (first render), show nothing
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--color-light)',
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → render the page
  return children;
};

export default ProtectedRoute;
