import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import RestaurantManagement from './RestaurantManagement';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import AdminLogin from './AdminLogin';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/login" />;
};

const AdminRoutes = () => {
  return (
    <Routes>      
      <Route path="/" element={<PrivateRoute><AdminDashboard /></PrivateRoute>}>
        <Route path="restaurants" element={<RestaurantManagement />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;