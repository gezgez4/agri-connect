// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import MyProducts from './components/MyProducts';
import AddProduct from './components/AddProduct';
import MyOrders from './components/MyOrders';

function App() {
  // User state - stores logged-in user info
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Show navigation only when user is logged in */}
        {user && <Navbar user={user} onLogout={handleLogout} />}

        {/* Main content area */}
        <div className={user ? "container-fluid py-4" : "container py-5"}>
          <Routes>
            {/* Public routes (when not logged in) */}
            {!user ? (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                {/* Protected routes (when logged in) */}
                <Route path="/products" element={<ProductList user={user} />} />
                <Route path="/my-orders" element={<MyOrders user={user} />} />
                
                {/* Farmer-only routes */}
                {user.role === 'AGRICULTEUR' && (
                  <>
                    <Route path="/my-products" element={<MyProducts user={user} />} />
                    <Route path="/add-product" element={<AddProduct user={user} />} />
                  </>
                )}
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;