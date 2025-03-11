// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role } = useContext(AuthContext);

  // Debug: Log current user and role
  console.log('ProtectedRoute - Current User:', currentUser);
  console.log('ProtectedRoute - User Role:', role);
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If role is unknown or not allowed, redirect to a fallback route (e.g., home)
  if (!role || !allowedRoles.includes(role)) {
    console.error('ProtectedRoute - Unknown or missing user role:', role); // Debug: Log unknown role
    return <Navigate to="/" />;
  }

  // If user is logged in and has the required role, render the children
  return children;
}

export default ProtectedRoute;
