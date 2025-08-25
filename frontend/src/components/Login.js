// src/components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';

function Login({ onLogin }) {
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call login API
      const response = await userService.login(formData.email, formData.password);

      // If login successful
      setSuccess('Login successful!');

      // Create user object (you might need to adjust this based on your backend response)
      const userData = {
        id: response.userId || 1, // Adjust based on your backend response
        email: formData.email,
        role: response.role || 'CLIENT', // Adjust based on your backend response
        name: response.name || 'User'
      };

      // Call parent component's login handler
      onLogin(userData);

    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header text-center">
            {/* Logo - Try to load from public folder, fallback to placeholder */}
            <img
              src="/logo.png"
              alt="AgriConnect Logo"
              style={{ height: '60px', marginBottom: '10px' }}
              onError={(e) => {
                // Fallback to placeholder if logo doesn't exist
                e.target.outerHTML = `
                  <div style="
                    width: 60px;
                    height: 60px;
                    background-color: #28a745;
                    border-radius: 50%;
                    margin: 0 auto 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                  ">🌱</div>
                `;
              }}
            />
            <h3>AgriConnect - Login</h3>
          </div>
          <div className="card-body">
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Logging in...
                    </>
                  ) : (
                    '🌱 Login'
                  )}
                </button>
              </div>
            </form>

            {/* Link to Register */}
            <div className="text-center mt-3">
              <p>Don't have an account?
                <Link to="/register" className="text-success fw-bold text-decoration-none ms-1">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;