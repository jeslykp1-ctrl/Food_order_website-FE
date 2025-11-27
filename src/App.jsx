import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { AuthProvider } from "./context/auth-context";
import Navbar from "./components/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/footer";
import Restaurants from "./pages/restaurants";
import RestaurantDetails from "./pages/restaurant-details";
import OrderSummary from "./pages/order-summary";
import { CartProvider } from "./context/cart-context";
import Confirmation from "./pages/confirmation";
import ProtectedRoute from "./layout/protected-route";
import LoginPage from "./components/login";
import AdminDashboard from "./admin/AdminDashboard";
import RestaurantManagement from "./admin/RestaurantManagement";
import OrderManagement from "./admin/OrderManagement";
import MenuManagement from "./admin/MenuManagement";

import AdminProtectedRoute from "./layout/admin-protected-route";
import NotAuthorized from "./components/unauthorised";
import AdminNav from "./admin/AdminNav";
import { useAuth } from "./context/auth-context";

const App = () => {
  const queryClient = new QueryClient();
  const NavbarWrapper = () => {
    const { authUser } = useAuth(); // safe inside provider
    const isAdmin = authUser?.role === "admin";
    return isAdmin ? <AdminNav /> : <Navbar />;
  };
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <NavbarWrapper />{" "}
            <main className="flex-1">
              <Routes>
                {/* PUBLIC ROUTES */}

                <Route path="/login" element={<LoginPage />} />

                {/* USER PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route
                    path="/restaurants/:id"
                    element={<RestaurantDetails />}
                  />
                  <Route path="/order-summary" element={<OrderSummary />} />
                  <Route path="/order-confirm" element={<Confirmation />} />
                  {/* add more protected routes here */}
                </Route>

                {/* ADMIN PROTECTED ROUTES */}
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route
                    path="/admin/restaurants"
                    element={<RestaurantManagement />}
                  />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                  <Route
                    path="/admin/menu-management/:id"
                    element={<MenuManagement />}
                  />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
