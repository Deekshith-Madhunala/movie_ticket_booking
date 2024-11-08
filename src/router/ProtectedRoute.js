import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is authenticated, render children, otherwise redirect to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
