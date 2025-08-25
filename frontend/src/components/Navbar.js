// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand fw-bold" to="/products">
          🌱 AgriConnect
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links */}
          <div className="navbar-nav me-auto">
            <Link className={isActive('/products')} to="/products">
              📦 All Products
            </Link>

            <Link className={isActive('/my-orders')} to="/my-orders">
              {user.role === 'CLIENT' ? '🛒 My Orders' : '📋 Orders Received'}
            </Link>

            {/* Show farmer-specific links */}
            {user.role === 'AGRICULTEUR' && (
              <>
                <Link className={isActive('/my-products')} to="/my-products">
                  🌾 My Products
                </Link>
                <Link className={isActive('/add-product')} to="/add-product">
                  ➕ Add Product
                </Link>
              </>
            )}
          </div>

          {/* User Info and Logout */}
          <div className="navbar-nav">
            <span className="navbar-text me-3">
              Welcome, <strong>{user.name}</strong>!
              <small className="text-light ms-2 px-2 py-1 bg-success bg-opacity-50 rounded">
                {user.role === 'AGRICULTEUR' ? '👨‍🌾 Farmer' : '🛒 Client'}
              </small>
            </span>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={onLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;