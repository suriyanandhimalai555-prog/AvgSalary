import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('token');

  // If token doesn't exist, redirect to login page instantly
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child routes (DashboardLayout and its nested pages)
  return <Outlet />;
};

export default ProtectedRoute;